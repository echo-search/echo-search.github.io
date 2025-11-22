// HistoryManager for EchoSearch
// Stores entries as: [{ id, query, ts }]
// Key used: "searchHistory"
// This file handles migration from older string-only arrays to the new object format.

(function(global){
  const storageKey = 'searchHistory';
  function now() { return Date.now(); }
  function makeId() { return String(Date.now()) + '-' + Math.random().toString(36).slice(2,9); }
  function formatTs(ts) {
    if(!ts) return 'Unknown';
    const d = new Date(ts);
    return d.toLocaleString(undefined, {year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  }

  function readRaw() {
    try {
      const raw = localStorage.getItem(storageKey);
      if(!raw) return [];
      return JSON.parse(raw);
    } catch(e) {
      console.error('Failed to parse searchHistory', e);
      return [];
    }
  }

  function write(arr) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(arr));
      try {
        window.dispatchEvent(new Event('storage'));
      } catch(e){}
    } catch(e) {
      console.error('Failed to write searchHistory', e);
    }
  }

  function migrateIfNeeded(raw) {
    if(!Array.isArray(raw)) return [];
    if(raw.length === 0) return [];
    if(typeof raw[0] === 'string') {
      return raw.map(s => ({ id: makeId(), query: s, ts: now() }));
    }
    return raw.map(item => {
      return {
        id: item.id || makeId(),
        query: (item.query || item.q || '') + '',
        ts: item.ts || now()
      };
    });
  }

  function getAll() {
    const raw = readRaw();
    return migrateIfNeeded(raw).sort((a,b)=> b.ts - a.ts);
  }

  function saveAll(arr) {
    write(arr);
  }

  function add(query) {
    if(!query || !String(query).trim()) return;
    const entries = getAll();
    const cleaned = entries.filter(e=> e.query !== query);
    const item = { id: makeId(), query: String(query), ts: now() };
    cleaned.unshift(item);
    saveAll(cleaned);
    return item;
  }

  function deleteById(id) {
    const arr = getAll().filter(e => e.id !== id);
    saveAll(arr);
  }

  function deleteRange(rangeMs) {
    const cutoff = now() - rangeMs;
    const arr = getAll().filter(e => e.ts < cutoff);
    saveAll(arr);
  }

  function clearAll() {
    saveAll([]);
  }

  function formatTsPublic(ts) { return formatTs(ts); }

  const API = {
    storageKey,
    getAll,
    add,
    deleteById,
    deleteRange,
    clearAll,
    formatTs: formatTsPublic
  };

  global.HistoryManager = API;

})(window);
