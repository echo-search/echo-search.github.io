// Unified Firebase <> localStorage sync for EchoSearch
// - If a user signs in, localStorage <-> Firestore (users/{uid}) will be merged and kept in sync.
// - If no user is signed in, localStorage remains the source of truth.
// - This file is intentionally small and defensive: it dynamically loads the compat SDKs used elsewhere
//   in the site (matching login.html), and exposes basic sync behaviour without changing existing code paths.
//
// Usage: simply include <script src="/essentials/firebase-sync.js"></script> on pages that read/write
// localStorage keys 'customThemes' and 'lifetimeHistory'. This script will upgrade local-only behaviour
// to cloud syncing when a user signs in.
//
// Note: Ensure Firestore rules allow the intended read/write for authenticated users.

(function () {
  const FB_BASE = 'https://www.gstatic.com/firebasejs/12.6.0';
  const SCRIPTS = [
    `${FB_BASE}/firebase-app-compat.js`,
    `${FB_BASE}/firebase-auth-compat.js`,
    `${FB_BASE}/firebase-firestore-compat.js`
  ];

  // Your Firebase config -- keep in sync with login.html
  const firebaseConfig = {
    apiKey: "AIzaSyBsJcShq-p4kDcRYyas_fYdWN7VWvgRi_I",
    authDomain: "echosearchh.firebaseapp.com",
    projectId: "echosearchh",
    storageBucket: "echosearchh.firebasestorage.app",
    messagingSenderId: "202629312430",
    appId: "1:202629312430:web:1895b1e1b0bd508f86223f",
    measurementId: "G-S2S8NLVQDT"
  };

  // Keys we sync
  const THEMES_KEY = 'customThemes';
  const HISTORY_KEY = 'lifetimeHistory';

  // Internal state
  let firebaseReady = false;
  let app = null;
  let auth = null;
  let db = null;
  let userDocUnsub = null;
  let currentUid = null;
  let suppressLocalWrite = false;
  let pushTimeout = null;

  // Helper: load script sequentially
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        // Already present
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
      // Initialize app if not already
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
      // Start listening auth state
      auth.onAuthStateChanged(user => {
        if (user) startSyncForUid(user.uid).catch(console.error);
        else stopSync();
      });
      // If already signed in (persisted), trigger immediate sync
      const user = auth.currentUser;
      if (user) startSyncForUid(user.uid).catch(console.error);
    } catch (e) {
      console.error('Failed to load Firebase SDKs for sync:', e);
    }
  }

  // Merge arrays uniquely (by JSON string)
  function mergeUniqueArray(cloudArr = [], localArr = []) {
    const seen = new Set();
    const out = [];

    // prefer cloud order first, then local new items appended (preserve recent local)
    (cloudArr.concat(localArr)).forEach(item => {
      try {
        const k = JSON.stringify(item);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(item);
        }
      } catch (e) {
        // fallback: use item as string
        const k = String(item);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(item);
        }
      }
    });
    return out;
  }

  // Set localStorage safely while avoiding re-triggering push-to-cloud
  function setLocalStorageSilently(key, valueStr) {
    suppressLocalWrite = true;
    try {
      localStorage.setItem(key, valueStr);
    } catch (e) {
      console.warn('localStorage set failed', e);
    } finally {
      // small timeout to let any storage handlers run and then re-enable pushes
      setTimeout(() => {
        suppressLocalWrite = false;
      }, 50);
    }
  }

  // Debounced push of both keys to cloud user doc
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

  // Start listening to user's doc and merge
  async function startSyncForUid(uid) {
    await ensureFirebase();
    if (!firebaseReady) return;
    if (!uid) return;
    // If already syncing for same uid, no-op
    if (currentUid === uid && userDocUnsub) return;
    stopSync(); // tear down any previous
    currentUid = uid;

    const docRef = db.collection('users').doc(uid);

    // 1) merge local -> cloud (so local items are not lost)
    try {
      const snap = await docRef.get();
      const cloud = snap.exists ? snap.data() || {} : {};
      const cloudThemes = Array.isArray(cloud.customThemes) ? cloud.customThemes : [];
      const cloudLife = Array.isArray(cloud.lifetimeHistory) ? cloud.lifetimeHistory : [];

      const localThemes = JSON.parse(localStorage.getItem(THEMES_KEY) || '[]');
      const localLife = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

      const mergedThemes = mergeUniqueArray(cloudThemes, localThemes);
      const mergedLife = mergeUniqueArray(cloudLife, localLife);

      // write merged result into Firestore (create if necessary)
      await docRef.set({
        customThemes: mergedThemes,
        lifetimeHistory: mergedLife
      }, { merge: true });

      // reflect merged state immediately into localStorage so existing page code sees cloud data
      setLocalStorageSilently(THEMES_KEY, JSON.stringify(mergedThemes));
      setLocalStorageSilently(HISTORY_KEY, JSON.stringify(mergedLife));
    } catch (e) {
      console.error('Error merging local and cloud data:', e);
    }

    // 2) listen for remote changes and mirror to localStorage
    userDocUnsub = docRef.onSnapshot(doc => {
      if (!doc.exists) return;
      const data = doc.data() || {};
      try {
        const ct = Array.isArray(data.customThemes) ? data.customThemes : [];
        const lh = Array.isArray(data.lifetimeHistory) ? data.lifetimeHistory : [];
        // apply into localStorage silently so we don't ping-pong
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

  // Monkeypatch Storage.prototype.setItem to emit an in-window event so same-tab writes can be observed.
  // We do it once per inclusion.
  (function monkeypatchStorage() {
    try {
      if (!Storage.prototype.__echosearch_patched) {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          original.apply(this, arguments);
          try {
            // dispatch both a window event and a custom event name for older browsers
            const ev = new CustomEvent('localstorage-changed', { detail: { key, value } });
            window.dispatchEvent(ev);
          } catch (e) {
            // ignore
          }
        };
        Storage.prototype.__echosearch_patched = true;
      }
    } catch (e) {
      // ignore
    }
  })();

  // Listen to local changes (same-tab) and 'storage' (other-tab) to push updates to cloud
  window.addEventListener('localstorage-changed', (e) => {
    if (!currentUid || !db) return;
    if (suppressLocalWrite) return;
    // only react to our keys
    const key = e.detail && e.detail.key;
    if (key === THEMES_KEY || key === HISTORY_KEY) {
      schedulePushToCloud();
    }
  });

  window.addEventListener('storage', (e) => {
    if (!currentUid || !db) return;
    if (!e.key) return;
    if (e.key === THEMES_KEY || e.key === HISTORY_KEY) {
      // other tab changed localStorage: push to cloud
      if (suppressLocalWrite) return;
      schedulePushToCloud();
    }
  });

  // Kick off attempt to load Firebase; it's fine if it fails (we'll remain local-only)
  // The app will start syncing automatically when the user signs in (and persistence is already established).
  ensureFirebase().catch(err => {
    // non-fatal: site continues to work with localStorage only
    console.warn('Firebase sync initialization failed; continuing in local-only mode.', err);
  });

  // Expose a small debug API
  window.__echosearchFirebaseSync = {
    isReady: () => firebaseReady,
    isSignedIn: () => !!currentUid,
    currentUid: () => currentUid,
    startSyncForUid,
    stopSync
  };
})();
