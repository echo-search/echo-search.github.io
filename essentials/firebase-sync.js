(function () {
  const FB_BASE = 'https://www.gstatic.com/firebasejs/12.6.0';
  const SCRIPTS = [
    `${FB_BASE}/firebase-app-compat.js`,
    `${FB_BASE}/firebase-auth-compat.js`,
    `${FB_BASE}/firebase-firestore-compat.js`
  ];

  const firebaseConfig = {
    apiKey: "AIzaSyBsJcShq-p4kDcRYyas_fYdWN7VWvgRi_I",
    authDomain: "echosearchh.firebaseapp.com",
    projectId: "echosearchh",
    storageBucket: "echosearchh.firebasestorage.app",
    messagingSenderId: "202629312430",
    appId: "1:202629312430:web:1895b1e1b0bd508f86223f",
    measurementId: "G-S2S8NLVQDT"
  };

  const THEMES_KEY = 'customThemes';
  const HISTORY_KEY = 'lifetimeHistory';

  let firebaseReady = false;
  let app = null;
  let auth = null;
  let db = null;
  let userDocUnsub = null;
  let currentUid = null;
  let suppressLocalWrite = false;
  let pushTimeout = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve();
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async function ensureFirebase() {
    if (firebaseReady) return;
    try {
      for (const src of SCRIPTS) {
        await loadScript(src);
      }
      if (!window.firebase) {
        console.warn('Firebase scripts loaded but window.firebase missing');
        return;
      }
      if (!firebase.apps || !firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
      } else {
        app = firebase.app();
      }
      auth = firebase.auth();
      db = firebase.firestore();
      firebaseReady = true;
      auth.onAuthStateChanged(user => {
        if (user) startSyncForUid(user.uid).catch(console.error);
        else stopSync();
      });
      const user = auth.currentUser;
      if (user) startSyncForUid(user.uid).catch(console.error);
    } catch (e) {
      console.error('Failed to load Firebase SDKs for sync:', e);
    }
  }

  function stableStringify(value) {
    if (value === null || value === undefined) return String(value);
    if (typeof value !== 'object') return String(value);

    if (Array.isArray(value)) {
      return '[' + value.map(v => stableStringify(v)).join(',') + ']';
    }

    const keys = Object.keys(value).sort();
    const parts = keys.map(k => JSON.stringify(k) + ':' + stableStringify(value[k]));
    return '{' + parts.join(',') + '}';
  }

  function getItemKey(item) {
    if (item && typeof item === 'object') {
      if (Object.prototype.hasOwnProperty.call(item, 'query') && Object.prototype.hasOwnProperty.call(item, 'time')) {
        const clone = Object.assign({}, item);
        delete clone.time;
        return stableStringify(clone);
      }
      return stableStringify(item);
    }
    return String(item);
  }

  function mergeUniqueArray(cloudArr = [], localArr = []) {
    const seen = new Set();
    const out = [];

    const combined = (Array.isArray(cloudArr) ? cloudArr : []).concat(Array.isArray(localArr) ? localArr : []);
    combined.forEach(item => {
      try {
        const k = getItemKey(item);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(item);
        }
      } catch (e) {
        const k = String(item);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(item);
        }
      }
    });
    return out;
  }

  function setLocalStorageSilently(key, valueStr) {
    suppressLocalWrite = true;
    try {
      localStorage.setItem(key, valueStr);
    } catch (e) {
      console.warn('localStorage set failed', e);
    } finally {
      setTimeout(() => {
        suppressLocalWrite = false;
      }, 50);
    }
  }

  function schedulePushToCloud() {
    if (!currentUid || !db) return;
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(async () => {
      try {
        const docRef = db.collection('users').doc(currentUid);
        const themes = JSON.parse(localStorage.getItem(THEMES_KEY) || '[]');
        const life = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        await docRef.set({ customThemes: themes, lifetimeHistory: life }, { merge: true });
      } catch (e) {
        console.error('Failed to push local data to cloud:', e);
      }
    }, 800);
  }

  async function startSyncForUid(uid) {
    await ensureFirebase();
    if (!firebaseReady) return;
    if (!uid) return;
    if (currentUid === uid && userDocUnsub) return;
    stopSync();
    currentUid = uid;

    const docRef = db.collection('users').doc(uid);

    try {
      const snap = await docRef.get();
      const cloud = snap.exists ? snap.data() || {} : {};
      const cloudThemes = Array.isArray(cloud.customThemes) ? cloud.customThemes : [];
      const cloudLife = Array.isArray(cloud.lifetimeHistory) ? cloud.lifetimeHistory : [];

      const localThemes = JSON.parse(localStorage.getItem(THEMES_KEY) || '[]');
      const localLife = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

      const mergedThemes = mergeUniqueArray(cloudThemes, localThemes);
      const mergedLife = mergeUniqueArray(cloudLife, localLife);

      await docRef.set({
        customThemes: mergedThemes,
        lifetimeHistory: mergedLife
      }, { merge: true });

      setLocalStorageSilently(THEMES_KEY, JSON.stringify(mergedThemes));
      setLocalStorageSilently(HISTORY_KEY, JSON.stringify(mergedLife));
    } catch (e) {
      console.error('Error merging local and cloud data:', e);
    }

    userDocUnsub = docRef.onSnapshot(doc => {
      if (!doc.exists) return;
      const data = doc.data() || {};
      try {
        const ct = Array.isArray(data.customThemes) ? data.customThemes : [];
        const lh = Array.isArray(data.lifetimeHistory) ? data.lifetimeHistory : [];
        setLocalStorageSilently(THEMES_KEY, JSON.stringify(ct));
        setLocalStorageSilently(HISTORY_KEY, JSON.stringify(lh));
      } catch (e) {
        console.error('Error applying snapshot data to localStorage:', e);
      }
    }, err => {
      console.error('Realtime listener error for user doc:', err);
    });
  }

  function stopSync() {
    if (userDocUnsub) {
      try { userDocUnsub(); } catch (e) {}
      userDocUnsub = null;
    }
    currentUid = null;
  }

  (function monkeypatchStorage() {
    try {
      if (!Storage.prototype.__echosearch_patched) {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          original.apply(this, arguments);
          try {
            const ev = new CustomEvent('localstorage-changed', { detail: { key, value } });
            window.dispatchEvent(ev);
          } catch (e) {}
        };
        Storage.prototype.__echosearch_patched = true;
      }
    } catch (e) {}
  })();

  window.addEventListener('localstorage-changed', (e) => {
    if (!currentUid || !db) return;
    if (suppressLocalWrite) return;
    const key = e.detail && e.detail.key;
    if (key === THEMES_KEY || key === HISTORY_KEY) {
      schedulePushToCloud();
    }
  });

  window.addEventListener('storage', (e) => {
    if (!currentUid || !db) return;
    if (!e.key) return;
    if (e.key === THEMES_KEY || e.key === HISTORY_KEY) {
      if (suppressLocalWrite) return;
      schedulePushToCloud();
    }
  });

  ensureFirebase().catch(err => {
    console.warn('Firebase sync initialization failed; continuing in local-only mode.', err);
  });

  window.__echosearchFirebaseSync = {
    isReady: () => firebaseReady,
    isSignedIn: () => !!currentUid,
    currentUid: () => currentUid,
    startSyncForUid,
    stopSync
  };
})();
