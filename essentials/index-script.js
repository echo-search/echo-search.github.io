document.documentElement.classList.remove('no-js');

const surpriseBtn = document.getElementById("surpriseBtn");
const voiceBtn = document.getElementById("voiceBtn");
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById('suggestions');
const searchBtn = document.getElementById("searchBtn");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");
const historyTitle = document.getElementById("historyTitle");
const chatBtn = document.getElementById("chatBtn");
const gcseResults = document.getElementById("gcse-results");
const themeSelect = document.getElementById('theme');
const input = document.querySelector('input[type="search"]');
const ul = document.getElementById("historyList");
const slider = document.getElementById("openInNewTabSlider");
const btn67 = document.getElementById("btn67");
const audio67 = document.getElementById("audio67");
const container = document.getElementById("emojiContainer");
const frame = document.getElementById("aiFrame");


let featurePanel = document.getElementById('featureResult');

window.onerror = function(msg, url, line, col, error) {
  alert(msg + " (line " + line + ")");
};

function ensurePanel() {
  if (!featurePanel) {
    featurePanel = document.createElement('div');
    featurePanel.id = 'featureResult';
    featurePanel.className = 'feature-result hidden';
    document.body.appendChild(featurePanel);
  }
}
ensurePanel();

function showFeatureResult({ type = 'generic', title = '', html = '', data = null }) {
  ensurePanel();
  featurePanel.innerHTML = `
    <div class="feature-backdrop"></div>
    <div class="feature-card" role="dialog" aria-modal="true">
      <div class="feature-header">
        <h3>${title || 'Result'}</h3>
        <button id="featureClose" aria-label="Close result">✕</button>
      </div>
      <div class="feature-content">${html}</div>
    </div>
  `;
  featurePanel.classList.remove('hidden');
  featurePanel.setAttribute('aria-hidden', 'false');

  const closeBtn = document.getElementById('featureClose');
  const backdrop = featurePanel.querySelector('.feature-backdrop');
  closeBtn.addEventListener('click', () => {
    featurePanel.classList.add('hidden');
    featurePanel.setAttribute('aria-hidden', 'true');
  });
  backdrop.addEventListener('click', () => {
    featurePanel.classList.add('hidden');
    featurePanel.setAttribute('aria-hidden', 'true');
  });

  const calcForm = featurePanel.querySelector('.mini-calc-form');
  if (calcForm) {
    const display = featurePanel.querySelector('.calc-display');
    const eqBtn = featurePanel.querySelector('.calc-eq');
    const clearBtnCalc = featurePanel.querySelector('.calc-clear');

    if (eqBtn) {
      eqBtn.addEventListener('click', () => {
        const expr = display.value.trim();
        const res = safeEvaluateExpression(expr);
        const out = (res === null) ? 'Invalid expression' : res;
        const outEl = featurePanel.querySelector('.calc-result');
        if (outEl) outEl.textContent = String(out);
      });
    }

    if (clearBtnCalc) {
      clearBtnCalc.addEventListener('click', () => {
        display.value = '';
        const outEl = featurePanel.querySelector('.calc-result');
        if (outEl) outEl.textContent = '';
      });
    }

    featurePanel.addEventListener('click', (ev) => {
      if (ev.target.matches('.calc-btn')) {
        const v = ev.target.getAttribute('data-val');
        const disp = featurePanel.querySelector('.calc-display');
        if (disp) {
          const start = disp.selectionStart || disp.value.length;
          const end = disp.selectionEnd || start;
          disp.value = disp.value.slice(0, start) + v + disp.value.slice(end);
          disp.focus();
          disp.selectionStart = disp.selectionEnd = start + v.length;
        }
      }
    });
  }
}

function safeEvaluateExpression(expr) {
  if (!expr || typeof expr !== 'string') return null;
  let normalized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**').replace(/,/g, '');
  if (!/^[0-9+\-*/%().\s*eE]+$/.test(normalized)) return null;
  try {
    const fn = new Function(`return (${normalized});`);
    const result = fn();
    if (typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) {
      return result;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function saveLifetime(query) {
  const entry = { query, time: Date.now() };
  const life = JSON.parse(localStorage.getItem("lifetimeHistory") || "[]");
  life.unshift(entry);
  localStorage.setItem("lifetimeHistory", JSON.stringify(life));
}

const facts = [
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call fake spaghetti? An impasta.",
    "Why did the scarecrow win an award? He was outstanding in his field.",
    "Why don't eggs tell jokes? They'd crack each other up.",
    "What do you call a fish wearing a bowtie? Sofishticated.",
    "Why did the bicycle fall over? It was two-tired.",
    "I tried to catch fog yesterday… Mist.",
    "Why don't oysters donate to charity? Because they're shellfish.",
    "What do you call cheese that isn't yours? Nacho cheese.",
    "Why did the tomato blush? Because it saw the salad dressing!",
    "Why was the math book sad? Too many problems.",
    "Why don't crabs share? Because they're shellfish.",
    "Why can't you trust stairs? They're always up to something.",
    "Why did the coffee file a police report? It got mugged.",
    "Why do cows wear bells? Because their horns don't work.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "What do you call a sleeping bull? A bulldozer.",
    "What do you call an alligator in a vest? An investigator.",
    "Why was six afraid of seven? Because seven eight nine.",
    "Why can't your nose be 12 inches long? Because then it would be a foot.",
    "What do you call a belt made of watches? A waist of time.",
    "Why did the cookie go to the hospital? It felt crumby.",
    "Why do bees have sticky hair? Because they use honeycombs.",
    "Why did the computer go to the doctor? It had a virus.",
    "What do you call a bear with no teeth? A gummy bear.",
    "Why did the stadium get hot? All the fans left.",
    "Why was the broom late? It swept in.",
    "Why don't oranges ever win races? They always peel out.",
    "Why did the picture go to jail? It was framed.",
    "Why did the banana go to the doctor? It wasn't peeling well.",
    "Why did the man run around his bed? He was trying to catch up on sleep.",
    "What do you call a dinosaur with an extensive vocabulary? A thesaurus.",
    "Why don't scientists trust atoms? They make up everything.",
    "Why did the chicken join a band? It had the drumsticks.",
    "What do you call a factory that makes good products? A satisfactory.",
    "Why don't vampires have friends? They're a pain in the neck.",
    "What do you call a snowman with a six-pack? An abdominal snowman.",
    "Why did the barber win the race? He took a short cut.",
    "Why did the frog take the bus? His car got toad.",
    "Why are ghosts bad liars? They are too transparent.",
    "Why don't elephants use computers? They're afraid of the mouse.",
    "Why did the grape stop in the middle of the road? It ran out of juice.",
    "Why don't seagulls fly over the bay? Because then they'd be bagels.",
    "Why did the music teacher go to jail? She got caught with too many notes.",
    "What do you call a cow with no legs? Ground beef.",
    "What do you call a cow with two legs? Lean beef.",
    "What do you call a cow that just gave birth? Decaffeinated.",
    "Why did the baker go to therapy? Too much kneaded attention.",
    "Why are elevator jokes so good? They work on many levels.",
    "Why don't pirates shower before walking the plank? They'll just wash up on shore.",
    "Why do chickens sit on eggs? Because they don't have chairs.",
    "Why was the belt arrested? Holding up a pair of pants.",
    "Why was the dictionary always calm? Because it had all the right words.",
    "What do you call a penguin in the desert? Lost.",
    "Why can't a leopard hide? He's always spotted.",
    "Why do birds fly south for the winter? It's faster than walking.",
    "What do you call a potato with glasses? A spec-tater.",
    "Why did the orange stop half-way up the hill? It ran out of juice.",
    "Why did the fish blush? It saw the ocean's bottom.",
    "What did the janitor say when he jumped out of the closet? Supplies!",
    "Why don't koalas count as bears? They don't have the koalafications.",
    "Why did the scarecrow keep getting promoted? He was outstanding in his field.",
    "Why do cows have hooves instead of feet? They lactose.",
    "Why was the cat sitting on the computer? It wanted to keep an eye on the mouse.",
    "What do you call an elephant that doesn't matter? An irrelephant.",
    "What do you call a sleeping dinosaur? Dino-snore.",
    "Why did the mushroom get invited to the party? He was a fungi.",
    "Why did the toilet paper roll down the hill? To get to the bottom.",
    "Why do melons have weddings? Because they cantaloupe.",
    "Why did the fish get bad grades? Because he was below sea level.",
    "What do you call a pig that knows karate? A pork chop.",
    "Why did the cookie go to school? It wanted to be a smart cookie.",
    "What do you call birds who stick together? Vel-crows.",
    "Why did the smartphone need glasses? It lost all its contacts.",
    "Why don't calendars ever get tired? They have too many dates.",
    "Why did the tree go to the dentist? To get a root canal.",
    "What do you call a dog magician? A labracadabrador.",
    "Why couldn't the bicycle stand on its own? It was two-tired.",
    "Why did the pirate go to school? To improve his arrr-ticulation.",
    "What did one wall say to the other? I'll meet you at the corner.",
    "Why did the cookie cry? Its mother was a wafer too long.",
    "What do you call a frog with no hind legs? Unhoppy.",
    "Why don't ducks tell jokes while flying? They'd quack up.",
    "Why was the math lesson so cold? Too many degrees.",
    "Why was the sand wet? Because the seaweed.",
    "Why did the balloon go near the needle? It was feeling brave.",
    "Why did the barber always win arguments? He always cut to the point.",
    "Why did the clown get fired? He couldn't put on a happy face.",
    "Why did the banana go out with the prune? It couldn't find a date.",
    "Why do mushrooms love parties? They're fungi, remember?",
    "Why did the lightbulb fail school? Too dim.",
    "Why do math teachers love parks? Natural logs.",
    "Why did the cookie join the gym? To get a little chip-per.",
    "Why did the snowman stare at the carrot aisle? Because he was picking his nose."
];

let openNewTab = false;

if (slider) {
  slider.addEventListener("click", () => {
    slider.classList.toggle("active");
    openNewTab = slider.classList.contains("active");
  });
} else {
  openNewTab = false;
}

function openResult(url, forceNewTab = false) {
  try {
    if (forceNewTab || openNewTab) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  } catch (e) {
    try { window.open(url, "_blank"); } catch (e2) {}
  }
}

function domainSearchHandler(query) {
  query = query.trim();

  const match = query.match(/^site:(.+)$/i);
  if (!match) return null;

  const domain = match[1].trim();
  return `https://www.google.com/search?q=site:${encodeURIComponent(domain)}`;
}

(function () {
  if (!themeSelect) return;

  const presets = [
    { name: 'Default', value: 'default' },
    { name: 'Dark', value: 'dark' },
    { name: 'Retro', value: 'retro' },
    { name: 'Neon', value: 'neon' },
    { name: 'Ocean', value: 'ocean' },
    { name: 'Midnight', value: 'midnight' },
    { name: 'Sunset', value: 'sunset' },
    { name: 'Matrix', value: 'matrix' },
    { name: 'Cyberpunk', value: 'cyberpunk' },
    { name: 'Forest', value: 'forest' },
    { name: 'Floral', value: 'floral' }
  ];

  function loadCustomThemes() {
    try {
      const raw = localStorage.getItem('customThemes');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse customThemes:', e);
      return [];
    }
  }

  function saveCustomThemes(themes) {
    localStorage.setItem('customThemes', JSON.stringify(themes || []));
  }

  function populateThemeSelect() {
    themeSelect.innerHTML = '';

    presets.forEach(p => {
      const opt = document.createElement('option');
      opt.value = `preset:${p.value}`;
      opt.textContent = p.name;
      themeSelect.appendChild(opt);
    });

    const sep = document.createElement('option');
    sep.disabled = true;
    sep.textContent = '───────────── Custom Themes ─────────────────';
    themeSelect.appendChild(sep);

    const customs = loadCustomThemes();
    if (customs.length === 0) {
      const noCustom = document.createElement('option');
      noCustom.disabled = true;
      noCustom.textContent = 'No custom themes';
      themeSelect.appendChild(noCustom);
    } else {
      customs.forEach((t, i) => {
        const opt = document.createElement('option');
        opt.value = `custom:${i}`;
        opt.textContent = t.name || `Custom ${i + 1}`;
        themeSelect.appendChild(opt);
      });
    }
  }

  function applyPreset(name) {
    const presetValues = presets.map(p => p.value);
    presetValues.forEach(cls => document.body.classList.remove(cls));
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--hover');
    document.documentElement.style.removeProperty('--text');
    document.body.style.backgroundImage = '';

    if (name === 'dark') {
      document.body.classList.add('dark-mode');
      const variant = 'default';
      document.body.classList.add(variant);
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add(name);
    }
  }

  function applyCustom(themeObj) {
    const presetValues = presets.map(p => p.value);
    presetValues.forEach(cls => document.body.classList.remove(cls));

    if (themeObj.bgColor) {
      document.documentElement.style.setProperty('--bg', themeObj.bgColor);
    } else {
      document.documentElement.style.removeProperty('--bg');
    }
    if (themeObj.textColor) {
      document.documentElement.style.setProperty('--text', themeObj.textColor);
    } else {
      document.documentElement.style.removeProperty('--text');
    }
    if (themeObj.accent) {
      document.documentElement.style.setProperty('--accent', themeObj.accent);
    } else {
      document.documentElement.style.removeProperty('--accent');
    }
    if (themeObj.hover) {
      document.documentElement.style.setProperty('--hover', themeObj.hover);
    } else {
      document.documentElement.style.removeProperty('--hover');
    }

    if (themeObj.bgImage) {
      document.body.style.backgroundImage = `url("${themeObj.bgImage}")`;
      document.body.style.backgroundSize = 'cover';
    } else {
      if (!/^linear-gradient|radial-gradient/i.test(themeObj.bgColor || '')) {
        document.body.style.backgroundImage = '';
      }
    }
  }

  function persistSelectedTheme(descriptor) {
    try {
      localStorage.setItem('selectedTheme', JSON.stringify(descriptor));
    } catch (e) {
      console.error('Failed to save selectedTheme', e);
    }
  }

  function restoreSelectedTheme() {
    try {
      const raw = localStorage.getItem('selectedTheme');
      if (!raw) return;
      const desc = JSON.parse(raw);
      if (desc.type === 'preset' && desc.name) {
        const v = `preset:${desc.name}`;
        const opt = Array.from(themeSelect.options).find(o => o.value === v);
        if (opt) themeSelect.value = v;
        applyPreset(desc.name);
      } else if (desc.type === 'custom' && typeof desc.index === 'number') {
        const customs = loadCustomThemes();
        const themeObj = customs[desc.index];
        if (themeObj) {
          const v = `custom:${desc.index}`;
          const opt = Array.from(themeSelect.options).find(o => o.value === v);
          if (opt) themeSelect.value = v;
          applyCustom(themeObj);
        }
      }
    } catch (e) {
      console.error('Failed to restore selectedTheme', e);
    }
  }

  themeSelect.addEventListener('change', (e) => {
    const v = e.target.value;
    if (!v) return;
    if (v.startsWith('preset:')) {
      const name = v.split(':')[1];
      applyPreset(name);
      persistSelectedTheme({ type: 'preset', name });
    } else if (v.startsWith('custom:')) {
      const index = parseInt(v.split(':')[1], 10);
      const customs = loadCustomThemes();
      const themeObj = customs[index];
      if (themeObj) {
        applyCustom(themeObj);
        persistSelectedTheme({ type: 'custom', index });
      }
    }
  });

  populateThemeSelect();
  restoreSelectedTheme();

  try {
    const activeRaw = localStorage.getItem('activeTheme');
    if (activeRaw) {
      const theme = JSON.parse(activeRaw);
      if (theme && theme.__fromThemesPage === true) {
        const customs = loadCustomThemes();
        const idx = customs.findIndex(ct => JSON.stringify(ct) === JSON.stringify(theme.data));
        let finalIndex = idx;
        if (idx === -1) {
          customs.push(theme.data);
          saveCustomThemes(customs);
          finalIndex = customs.length - 1;
        }
        populateThemeSelect();
        const selectValue = `custom:${finalIndex}`;
        const option = Array.from(themeSelect.options).find(o => o.value === selectValue);
        if (option) themeSelect.value = selectValue;
        applyCustom(theme.data);
        persistSelectedTheme({ type: 'custom', index: finalIndex });
      } else if (theme && theme.__applyPreset) {
        populateThemeSelect();
        const selectValue = `preset:${theme.name}`;
        const option = Array.from(themeSelect.options).find(o => o.value === selectValue);
        if (option) themeSelect.value = selectValue;
        applyPreset(theme.name);
        persistSelectedTheme({ type: 'preset', name: theme.name });
      }
      localStorage.removeItem('activeTheme');
    }
  } catch (e) {
    console.error('Error applying activeTheme from storage', e);
  }

})();

if (surpriseBtn) {
  surpriseBtn.addEventListener("click", () => {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    alert(fact);
  });
}

let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-UK";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    if (voiceBtn) voiceBtn.classList.add("listening");
  };

  recognition.onend = () => {
    if (voiceBtn) voiceBtn.classList.remove("listening");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (searchInput) {
      searchInput.value = transcript;
      doSearch(transcript);
    }
  };

  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      try { recognition.start(); } catch (e) { }
    });
  }
} else {
  if (voiceBtn) {
    voiceBtn.disabled = true;
    voiceBtn.title = "Voice input not supported in this browser.";
  }
}

window.__gcse = {
  callback: function() {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const queryFromUrl = hashParams.get('gsc.q');
    if (queryFromUrl) {
      if (window.google && google.search && google.search.cse && google.search.cse.element) {
        const searchElement = google.search.cse.element.getElement("searchbox1");
        if (searchElement) {
          searchElement.execute(queryFromUrl);
          window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          searchBtn.click();
        }
      });
    }
  }
};

function handleMathConversion(query) {
  query = String(query).trim();

  if (/^[0-9+\-*/^().\s×÷eE,]+$|^[a-zA-Z0-9+\-*/^().\s×÷eE,]+$/.test(query)) {
    if (/[0-9]/.test(query)) {
      const normalized = query.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**').replace(/,/g, '');
      const result = safeEvaluateExpression(normalized);
      if (result !== null) {
        return { type: 'math', expression: query, normalizedExpression: normalized, result };
      }
    }
  }

  const units = {
   "length": { "m": 1, "km": 1000, "cm": 0.01, "mm": 0.001, "in": 0.0254, "ft": 0.3048, "yd": 0.9144, "mi": 1609.344 },
   "area": { "m2": 1, "km2": 1000000, "cm2": 0.0001, "mm2": 0.000001, "ha": 10000, "acre": 4046.8564224 },
   "volume": { "l": 1, "ml": 0.001, "m3": 1000, "gal": 3.78541, "qt": 0.946353, "pint": 0.473176, "cup": 0.24 },
   "mass": { "g": 1, "kg": 1000, "mg": 0.001, "t": 1000000, "lb": 453.59237, "oz": 28.3495 },
   "time": { "s": 1, "min": 60, "h": 3600, "day": 86400, "week": 604800 },
   "speed": { "m/s": 1, "km/h": 0.277777778, "mph": 0.44704 },
   "data_storage": { "b": 1, "B": 8, "kb": 8192, "mb": 8388608, "gb": 8589934592, "tb": 8796093022208 },
   "data_transfer_rate": { "bps": 1, "kbps": 1000, "mbps": 1000000, "gbps": 1000000000 },
   "energy": { "j": 1, "kj": 1000, "cal": 4.184, "kcal": 4184, "wh": 3600, "kwh": 3600000 },
   "pressure": { "pa": 1, "kpa": 1000, "bar": 100000, "psi": 6894.757, "atm": 101325 },
   "angle": { "rad": 1, "deg": 0.01745329252 }
  };

  const convMatch = query.match(/^([\d.]+)\s*([a-zA-Z\/]+)\s*to\s*([a-zA-Z\/]+)$/i);
  if(convMatch) {
    const value = parseFloat(convMatch[1]);
    const from = convMatch[2].toLowerCase();
    const to = convMatch[3].toLowerCase();

    for(const cat in units){
      const u = units[cat];
      if(u[from] !== undefined && u[to] !== undefined){
        const result = value * u[from] / u[to];
        return { type: 'conversion', inputValue: value, from, to, result };
      }
    }
    return { type: 'conversion', error: "Conversion units not recognized." };
  }

  return null;
}

// FLIGHT SEARCH FEATURE - Vanilla JS
// =====================================

const AVIATION_API_KEY = '5643563ad8c9d64adf783272c2618b84';
const AVIATION_API_BASE = 'https://api.aviationstack.com/v1/flights';

const flightCache = new Map();

const FLIGHT_CARD_CSS = `
#flight-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.13);
  padding: 18px 20px 14px 20px;
  margin-bottom: 14px;
  background: var(--fc-bg, #fff);
  color: var(--fc-text, #202124);
  animation: fc-fadein 0.28s cubic-bezier(.4,0,.2,1);
  font-family: 'Google Sans', 'Segoe UI', Arial, sans-serif;
  overflow: hidden;
  position: relative;
}
@media (prefers-color-scheme: dark) {
  #flight-card { --fc-bg: #1e1e2e; --fc-text: #e2e2e8; }
}
body.dark-mode #flight-card, body.midnight #flight-card, body.matrix #flight-card, body.cyberpunk #flight-card, body.neon #flight-card {
  --fc-bg: #1e1e2e; --fc-text: #e2e2e8;
}
@keyframes fc-fadein {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
#flight-card .fc-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
#flight-card .fc-airline {
  font-size: 0.85rem;
  color: var(--fc-muted, #5f6368);
  flex: 1 1 auto;
}
body.dark-mode #flight-card .fc-airline,
body.midnight #flight-card .fc-airline,
body.neon #flight-card .fc-airline,
body.matrix #flight-card .fc-airline,
body.cyberpunk #flight-card .fc-airline {
  --fc-muted: #9aa0a6;
}
#flight-card .fc-flightnum {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}
#flight-card .fc-status {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: capitalize;
}
.fc-status-active    { background: #e6f4ea; color: #1e8e3e; }
.fc-status-landed    { background: #e6f4ea; color: #1e8e3e; }
.fc-status-delayed   { background: #fef7e0; color: #b06000; }
.fc-status-scheduled { background: #f1f3f4; color: #5f6368; }
.fc-status-cancelled { background: #fce8e6; color: #c5221f; }
.fc-status-unknown   { background: #f1f3f4; color: #5f6368; }
body.dark-mode .fc-status-active, body.midnight .fc-status-active,
body.neon .fc-status-active, body.matrix .fc-status-active,
body.cyberpunk .fc-status-active,
body.dark-mode .fc-status-landed, body.midnight .fc-status-landed {
  background: #0d3318; color: #81c995;
}
body.dark-mode .fc-status-delayed, body.midnight .fc-status-delayed,
body.neon .fc-status-delayed {
  background: #3b2a00; color: #fdd663;
}
body.dark-mode .fc-status-cancelled, body.midnight .fc-status-cancelled,
body.neon .fc-status-cancelled {
  background: #3c1010; color: #f28b82;
}
body.dark-mode .fc-status-scheduled, body.midnight .fc-status-scheduled,
body.neon .fc-status-scheduled, body.matrix .fc-status-scheduled {
  background: #2a2a3a; color: #9aa0a6;
}
#flight-card .fc-route {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
#flight-card .fc-iata {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}
#flight-card .fc-city {
  font-size: 0.75rem;
  color: var(--fc-muted, #5f6368);
  margin-top: 2px;
}
#flight-card .fc-arrow {
  flex: 1;
  text-align: center;
  font-size: 1.3rem;
  color: var(--fc-muted, #5f6368);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
#flight-card .fc-arrow-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #4285f4 0%, #34a853 100%);
  border-radius: 2px;
  margin: 3px 0;
}
#flight-card .fc-times {
  display: flex;
  gap: 0;
  margin-bottom: 12px;
}
#flight-card .fc-time-block {
  flex: 1;
}
#flight-card .fc-time-block:last-child { text-align: right; }
#flight-card .fc-time-label {
  font-size: 0.7rem;
  color: var(--fc-muted, #5f6368);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1px;
}
#flight-card .fc-time-sched {
  font-size: 1.1rem;
  font-weight: 600;
}
#flight-card .fc-time-est {
  font-size: 0.78rem;
  color: var(--fc-muted, #5f6368);
}
#flight-card .fc-time-est.delayed { color: #b06000; }
body.dark-mode #flight-card .fc-time-est.delayed,
body.midnight #flight-card .fc-time-est.delayed {
  color: #fdd663;
}
#flight-card .fc-divider {
  border: none;
  border-top: 1px solid var(--fc-border, #e8eaed);
  margin: 10px 0;
}
body.dark-mode #flight-card .fc-divider,
body.midnight #flight-card .fc-divider,
body.neon #flight-card .fc-divider { --fc-border: #3a3a4a; }
#flight-card .fc-bottom {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
#flight-card .fc-meta-item {
  display: flex;
  flex-direction: column;
}
#flight-card .fc-meta-label {
  font-size: 0.69rem;
  color: var(--fc-muted, #5f6368);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
#flight-card .fc-meta-value {
  font-size: 0.88rem;
  font-weight: 500;
}
#flight-card .fc-error {
  color: var(--fc-muted, #5f6368);
  font-size: 0.92rem;
  padding: 6px 0;
}
#flight-card .fc-source {
  font-size: 0.68rem;
  color: var(--fc-muted, #9aa0a6);
  margin-top: 10px;
  text-align: right;
}
@media (max-width: 480px) {
  #flight-card { padding: 14px 12px 10px 12px; }
  #flight-card .fc-iata { font-size: 1.5rem; }
  #flight-card .fc-time-sched { font-size: 0.95rem; }
}
`;

function injectFlightCSS() {
  if (document.getElementById('fc-styles')) return;
  const style = document.createElement('style');
  style.id = 'fc-styles';
  style.textContent = FLIGHT_CARD_CSS;
  document.head.appendChild(style);
}

function isFlightQuery(query) {
  if (!query) return false;
  const q = query.trim().toUpperCase();
  if (/^[A-Z]{3}-[A-Z]{3}$/.test(q)) return { type: 'route', value: q };
  if (/^[A-Z]{2,3}\d{1,4}$/.test(q)) return { type: 'flight', value: q };
  return false;
}

function formatTime(isoStr) {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch { return '—'; }
}

function getStatusClass(status) {
  if (!status) return 'fc-status-unknown';
  const s = status.toLowerCase();
  if (s === 'active' || s === 'en-route') return 'fc-status-active';
  if (s === 'landed') return 'fc-status-landed';
  if (s === 'delayed') return 'fc-status-delayed';
  if (s === 'scheduled') return 'fc-status-scheduled';
  if (s === 'cancelled') return 'fc-status-cancelled';
  return 'fc-status-unknown';
}

function getFeatureCard() {
  let card = document.querySelector('.feature-card');
  if (!card) card = document.getElementById('featureResult');
  return card;
}

function removeFlightCard() {
  const existing = document.getElementById('flight-card');
  if (existing) existing.remove();
}

function renderFlightCard(flightData) {
  injectFlightCSS();
  removeFlightCard();

  const featureCard = getFeatureCard();
  if (!featureCard) return;

  const card = document.createElement('div');
  card.id = 'flight-card';

  if (!flightData) {
    card.innerHTML = `<div class="fc-error">No live flight data found.</div>`;
    featureCard.prepend(card);
    return;
  }

  const f = flightData;
  const flightNum = (f.flight && (f.flight.iata || f.flight.icao)) || '—';
  const airline = (f.airline && f.airline.name) || '—';
  const status = (f.flight_status) || 'unknown';
  const statusClass = getStatusClass(status);
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');

  const depIata = (f.departure && f.departure.iata) || '—';
  const arrIata = (f.arrival && f.arrival.iata) || '—';
  const depCity = (f.departure && f.departure.airport) || '';
  const arrCity = (f.arrival && f.arrival.airport) || '';

  const depSched = formatTime(f.departure && f.departure.scheduled);
  const depEst   = formatTime(f.departure && (f.departure.estimated || f.departure.actual));
  const arrSched = formatTime(f.arrival && f.arrival.scheduled);
  const arrEst   = formatTime(f.arrival && (f.arrival.estimated || f.arrival.actual));

  const depTerminal = (f.departure && f.departure.terminal) || null;
  const depGate     = (f.departure && f.departure.gate) || null;
  const arrTerminal = (f.arrival && f.arrival.terminal) || null;
  const arrGate     = (f.arrival && f.arrival.gate) || null;

  const depEstDelayed = depEst !== '—' && depEst !== depSched;
  const arrEstDelayed = arrEst !== '—' && arrEst !== arrSched;

  const metaItems = [];
  if (depTerminal) metaItems.push({ label: 'Dep. Terminal', value: depTerminal });
  if (depGate)     metaItems.push({ label: 'Dep. Gate', value: depGate });
  if (arrTerminal) metaItems.push({ label: 'Arr. Terminal', value: arrTerminal });
  if (arrGate)     metaItems.push({ label: 'Arr. Gate', value: arrGate });

  const metaHTML = metaItems.map(m =>
    `<div class="fc-meta-item">
      <span class="fc-meta-label">${m.label}</span>
      <span class="fc-meta-value">${m.value}</span>
    </div>`
  ).join('');

  card.innerHTML = `
    <div class="fc-top">
      <span class="fc-airline">${escapeHtml(airline)}</span>
      <span class="fc-flightnum">${escapeHtml(flightNum)}</span>
      <span class="fc-status ${statusClass}">${escapeHtml(statusLabel)}</span>
    </div>
    <div class="fc-route">
      <div>
        <div class="fc-iata">${escapeHtml(depIata)}</div>
        <div class="fc-city">${escapeHtml(depCity.substring(0,22))}</div>
      </div>
      <div class="fc-arrow">
        <div class="fc-arrow-line"></div>
        <span style="font-size:0.7rem;color:var(--fc-muted,#5f6368);">✈</span>
      </div>
      <div style="text-align:right;">
        <div class="fc-iata">${escapeHtml(arrIata)}</div>
        <div class="fc-city">${escapeHtml(arrCity.substring(0,22))}</div>
      </div>
    </div>
    <div class="fc-times">
      <div class="fc-time-block">
        <div class="fc-time-label">Departure</div>
        <div class="fc-time-sched">${depSched}</div>
        ${depEstDelayed ? `<div class="fc-time-est delayed">Est. ${depEst}</div>` : (depEst !== '—' ? `<div class="fc-time-est">${depEst}</div>` : '')}
      </div>
      <div class="fc-time-block">
        <div class="fc-time-label">Arrival</div>
        <div class="fc-time-sched">${arrSched}</div>
        ${arrEstDelayed ? `<div class="fc-time-est delayed">Est. ${arrEst}</div>` : (arrEst !== '—' ? `<div class="fc-time-est">${arrEst}</div>` : '')}
      </div>
    </div>
    ${metaItems.length > 0 ? `<hr class="fc-divider"><div class="fc-bottom">${metaHTML}</div>` : ''}
    <div class="fc-source">Flight data · AviationStack</div>
  `;

  featureCard.prepend(card);
}

async function handleFlightSearch(query) {
  const match = isFlightQuery(query);
  if (!match) {
    removeFlightCard();
    return;
  }

  injectFlightCSS();

  // Show loading state immediately
  removeFlightCard();
  const featureCard = getFeatureCard();
  if (featureCard) {
    const loadingCard = document.createElement('div');
    loadingCard.id = 'flight-card';
    loadingCard.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:4px 0;">
        <span style="font-size:0.9rem;color:var(--fc-muted,#5f6368);">Loading flight data…</span>
      </div>`;
    injectFlightCSS();
    featureCard.prepend(loadingCard);
  }

  const cacheKey = match.value;
  if (flightCache.has(cacheKey)) {
    renderFlightCard(flightCache.get(cacheKey));
    return;
  }

  let url = AVIATION_API_BASE + '?access_key=' + encodeURIComponent(AVIATION_API_KEY);
  if (match.type === 'route') {
    const parts = match.value.split('-');
    url += '&dep_iata=' + encodeURIComponent(parts[0]) + '&arr_iata=' + encodeURIComponent(parts[1]);
  } else {
    url += '&flight_iata=' + encodeURIComponent(match.value);
  }

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('API error ' + resp.status);
    const json = await resp.json();
    const flights = json && json.data;
    if (!flights || flights.length === 0) {
      flightCache.set(cacheKey, null);
      renderFlightCard(null);
      return;
    }
    const best = flights[0];
    flightCache.set(cacheKey, best);
    renderFlightCard(best);
  } catch (e) {
    // Fail silently but show "no data"
    renderFlightCard(null);
  }
}

// Hook into the existing doSearch / searchBtn flow
// Patches the existing doSearch function non-destructively
(function patchDoSearch() {
  const _orig = window.doSearch;
  if (typeof _orig === 'function') {
    window.doSearch = async function(query) {
      _orig.call(this, query);
      await handleFlightSearch(query);
    };
  } else {
    // Fallback: watch searchBtn click and Enter key
    document.addEventListener('DOMContentLoaded', function() {
      const searchBtn = document.getElementById('searchBtn');
      const searchInput = document.getElementById('searchInput');

      if (searchBtn) {
        searchBtn.addEventListener('click', async function() {
          const q = searchInput ? searchInput.value.trim() : '';
          if (q) await handleFlightSearch(q);
        });
      }
      if (searchInput) {
        searchInput.addEventListener('keydown', async function(e) {
          if (e.key === 'Enter') {
            const q = searchInput.value.trim();
            if (q) await handleFlightSearch(q);
          }
        });
      }
    });
  }
})();

// escapeHtml utility (safe to redefine — only adds if missing)
if (typeof window.escapeHtml === 'undefined') {
  window.escapeHtml = function(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(m) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]);
    });
  };
}

async function handleWeather(input) {
  const tomorrowMatch = input.match(/^weather\s+tomorrow\s+in\s+(.+)$/i);
  const todayMatch = input.match(/^weather\s+in\s+(.+)$/i);

  if (!tomorrowMatch && !todayMatch) return null;

  const place = (tomorrowMatch || todayMatch)[1].trim();
  const isTomorrow = !!tomorrowMatch;

  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`
    );
    if (!geoRes.ok) return { type: 'weather', error: `Couldn't find "${place}".` };
    const geo = await geoRes.json();
    if (!geo.length) return { type: 'weather', error: `Couldn't find "${place}".` };

    const { lat, lon, display_name } = geo[0];

    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    );
    if (!wRes.ok) return { type: 'weather', error: "Weather lookup failed." };
    const w = await wRes.json();

    const icon = c => ({
      0:"☀️",1:"🌤️",2:"⛅",3:"🌥️",
      45:"🌫️",48:"🌫️",
      51:"🌦️",61:"🌧️",71:"🌨️",
      95:"⛈️"
    }[c] || "🌡️");

    if (isTomorrow) {
      if (!w.daily || !Array.isArray(w.daily.temperature_2m_max) || w.daily.temperature_2m_max.length < 2) {
        return { type: 'weather', error: `No forecast available for tomorrow in ${display_name}.` };
      }
      return {
        type: 'weather',
        place: display_name,
        when: 'tomorrow',
        icon: icon(w.daily.weathercode[1]),
        high: w.daily.temperature_2m_max[1],
        low: w.daily.temperature_2m_min[1]
      };
    }

    const pad = n => String(n).padStart(2, '0');
    const d = new Date();
    const nowHour = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}`;

    let start = -1;
    if (w.hourly && Array.isArray(w.hourly.time)) {
      start = w.hourly.time.findIndex(t => t.startsWith(nowHour));
    }

    if (start === -1) start = 0;

    let nextHours = [];
    for (let i = start; i < start + 6; i++) {
      if (!w.hourly.time[i]) break;
      nextHours.push({
        time: w.hourly.time[i].slice(11,16),
        icon: icon(w.hourly.weathercode[i]),
        temp: w.hourly.temperature_2m[i]
      });
    }

    return {
      type: 'weather',
      place: display_name,
      when: 'today',
      current: { temp: w.current_weather?.temperature, wind: w.current_weather?.windspeed, icon: icon(w.current_weather?.weathercode) },
      nextHours
    };

  } catch (e) {
    console.error('handleWeather error', e);
    return { type: 'weather', error: "Weather lookup failed." };
  }
}

const langMap = {
  af: 'af', afrikaans: 'af',
  sq: 'sq', albanian: 'sq',
  am: 'am', amharic: 'am',
  ar: 'ar', arabic: 'ar',
  hy: 'hy', armenian: 'hy',
  az: 'az', azerbaijani: 'az',
  eu: 'eu', basque: 'eu',
  be: 'be', belarusian: 'be',
  bn: 'bn', bengali: 'bn',
  bs: 'bs', bosnian: 'bs',
  bg: 'bg', bulgarian: 'bg',
  ca: 'ca', catalan: 'ca',
  ceb: 'ceb', cebuano: 'ceb',
  zh: 'zh', chinese: 'zh',
  'chinese simplified': 'zh',
  'chinese (simplified)': 'zh',
  'simplified chinese': 'zh',
  'traditional chinese': 'zh',
  'chinese traditional': 'zh',
  'chinese (traditional)': 'zh',
  'zh-cn': 'zh', 'zh-tw': 'zh',
  co: 'co', corsican: 'co',
  hr: 'hr', croatian: 'hr',
  cs: 'cs', czech: 'cs',
  da: 'da', danish: 'da',
  nl: 'nl', dutch: 'nl',
  en: 'en', english: 'en',
  'british english': 'en',
  'uk english': 'en',
  eo: 'eo', esperanto: 'eo',
  et: 'et', estonian: 'et',
  fi: 'fi', finnish: 'fi',
  fr: 'fr', french: 'fr',
  fy: 'fy', frisian: 'fy',
  gl: 'gl', galician: 'gl',
  ka: 'ka', georgian: 'ka',
  de: 'de', german: 'de',
  el: 'el', greek: 'el',
  gu: 'gu', gujarati: 'gu',
  ht: 'ht', haitian: 'ht',
  ha: 'ha', hausa: 'ha',
  haw: 'haw', hawaiian: 'haw',
  he: 'he', hebrew: 'he',
  hi: 'hi', hindi: 'hi',
  hmn: 'hmn', hmong: 'hmng',
  hu: 'hu', hungarian: 'hu',
  is: 'is', icelandic: 'is',
  ig: 'ig', igbo: 'ig',
  id: 'id', indonesian: 'id',
  ga: 'ga', irish: 'ga',
  it: 'it', italian: 'it',
  ja: 'ja', japanese: 'ja',
  jw: 'jw', javanese: 'jw',
  kn: 'kn', kannada: 'kn',
  kk: 'kk', kazakh: 'kk',
  km: 'km', khmer: 'km',
  ko: 'ko', korean: 'ko',
  ku: 'ku', kurdish: 'ku',
  ky: 'ky', kyrgyz: 'ky',
  lo: 'lo', lao: 'lo',
  la: 'la', latin: 'la',
  lv: 'lv', latvian: 'lv',
  lt: 'lt', lithuanian: 'lt',
  lb: 'lb', luxembourgish: 'lb',
  mk: 'mk', macedonian: 'mk',
  mg: 'mg', malagasy: 'mg',
  ms: 'ms', malay: 'ms',
  ml: 'ml', malayalam: 'ml',
  mt: 'mt', maltese: 'mt',
  mi: 'mi', maori: 'mi',
  mr: 'mr', marathi: 'mr',
  mn: 'mn', mongolian: 'mn',
  my: 'my', burmese: 'my',
  ne: 'ne', nepali: 'ne',
  no: 'no', norwegian: 'no',
  ny: 'ny', chichewa: 'ny',
  ps: 'ps', pashto: 'ps',
  fa: 'fa', persian: 'fa',
  pl: 'pl', polish: 'pl',
  pt: 'pt', portuguese: 'pt',
  pa: 'pa', punjabi: 'pa',
  ro: 'ro', romanian: 'ro',
  ru: 'ru', russian: 'ru',
  sm: 'sm', samoan: 'sm',
  gd: 'gd', 'scots gaelic': 'gd',
  sr: 'sr', serbian: 'sr',
  st: 'st', sesotho: 'st',
  sn: 'sn', shona: 'sn',
  sd: 'sd', sindhi: 'sd',
  si: 'si', sinhala: 'si',
  sk: 'sk', slovak: 'sk',
  sl: 'sl', slovenian: 'sl',
  so: 'so', somali: 'so',
  es: 'es', spanish: 'es',
  su: 'su', sundanese: 'su',
  sw: 'sw', swahili: 'sw',
  sv: 'sv', swedish: 'sv',
  tg: 'tg', tajik: 'tg',
  ta: 'ta', tamil: 'ta',
  te: 'te', telugu: 'te',
  th: 'th', thai: 'th',
  tr: 'tr', turkish: 'tr',
  tk: 'tk', turkmen: 'tk',
  uk: 'uk', ukrainian: 'uk',
  ur: 'ur', urdu: 'ur',
  uz: 'uz', uzbek: 'uz',
  vi: 'vi', vietnamese: 'vi',
  cy: 'cy', welsh: 'cy',
  xh: 'xh', xhosa: 'xh',
  yi: 'yi', yiddish: 'yi',
  yo: 'yo', yoruba: 'yo',
  zu: 'zu', zulu: 'zu'
};

async function handleSearch(input) {
  const match = input.match(/^(.+?)\s+in\s+([a-zA-Z\s]+)$/i);
  if (!match) return null;

  const word = match[1].trim();

  let language = match[2]
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (!langMap[language]) return null;

  const tl = langMap[language];

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(word)}`
    );

    if (!res.ok) return { type: 'translation', error: 'Translation failed.' };

    const data = await res.json();
    const translated = data?.[0]?.[0]?.[0] || null;
    if (!translated) return { type: 'translation', error: 'No translation returned.' };

    return { type: 'translation', from: word, to: translated, targetLang: tl };
  } catch {
    return { type: 'translation', error: 'Translation failed.' };
  }
}

async function handleDictionarySearch(query) {
  const lower = String(query).toLowerCase().trim();
  const triggers = ["meaning of", "definition of", "define", "dictionary", "meaning"];
  const isDictionaryQuery = triggers.some(word => lower.includes(word));

  if (!isDictionaryQuery) return null;

  const word = lower.replace(/(meaning of|definition of|define|dictionary|meaning)/g, "").trim();
  if (!word) return { type: 'dictionary', error: 'Please enter a word to define.' };

  const wordUpper = word.toUpperCase();

  try {
    const localRes = await fetch("dictionary.json");
    if (localRes.ok) {
      const localData = await localRes.json();
      if (localData && localData[wordUpper]) {
        const entry = localData[wordUpper];
        const meaning = entry.meaning || "No meaning found.";
        const example = entry.example || "No example available.";
        return { type: 'dictionary', word, meaning, example, source: 'local' };
      }
    }
  } catch (e) {}

  try {
    const apiRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (Array.isArray(data) && data[0]?.meanings?.[0]?.definitions?.[0]) {
        const meaning = data[0].meanings[0].definitions[0].definition;
        const example = data[0].meanings[0].definitions[0].example || "No example available.";
        let audioUrl = null;
        if (Array.isArray(data[0].phonetics)) {
          const phon = data[0].phonetics.find(p => p.audio && p.audio.trim());
          if (phon && phon.audio) {
            audioUrl = phon.audio.trim();
            if (audioUrl.startsWith('//')) audioUrl = 'https:' + audioUrl;
          }
        }
        return { type: 'dictionary', word, meaning, example, source: 'api', audio: audioUrl || null };
      }
    }
  } catch (e) {}

  return { type: 'dictionary', error: 'No definition found.' };
}

async function handleWhoIs(input) {
  const match = input.match(/^who\s+is\s+(.+)$/i);
  if (!match) return null;

  const person = match[1].trim();

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(person)}`
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.extract) return null;

    return { type: 'whois', title: data.title, extract: data.extract, url: data.content_urls?.desktop?.page || null };
  } catch {
    return null;
  }
}

const ALL_TIMEZONES = (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function')
  ? Intl.supportedValuesOf("timeZone")
  : [];

function handleTimeAndDate(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase().trim();

  if (
    q === "today's date" ||
    q === "todays date" ||
    q === "date today"
  ) {
    return new Date().toDateString();
  }

  const match = q.match(/^time in (.+)$/);
  if (match) {
    const city = match[1].trim();
    const timezone = cityToTimezone(city);

    if (!timezone) return null;

    const time = new Date().toLocaleTimeString("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit"
    });

    return `Time in ${capitalize(city)}: ${time}`;
  }

  return null;
}

function cityToTimezone(city) {
  if (!city) return null;
  const c = city
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, "_");

  for (const tz of ALL_TIMEZONES) {
    try {
      if (tz.toLowerCase().endsWith("/" + c)) {
        return tz;
      }
    } catch (e) {}
  }

  for (const tz of ALL_TIMEZONES) {
    try {
      if (tz.toLowerCase().includes(c)) {
        return tz;
      }
    } catch (e) {}
  }

  return null;
}

function capitalize(str) {
  if (!str) return '';
  return str
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

let lastWikiState = null;

function sanitizeWikiHtml(html) {
  if (!html) return '';
  let out = html.replace(/<(script|style)[\s\S]*?>[\s\S]*?<\/\1>/gi, '');
  out = out.replace(/\s(on\w+)=["'][^"']*["']/gi, '');
  out = out.replace(/href=(["'])javascript:[^"']*\1/gi, 'href="#"');
  out = out.replace(/<form[\s\S]*?>[\s\S]*?<\/form>/gi, '');
  out = out.replace(/<meta[\s\S]*?>/gi, '');
  out = out.replace(/<div[^>]*class="[^"]*(mw-editsection|toc|reference|rellink|mw-references-wrap)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  out = out.replace(/javascript:/gi, '#');
  return out;
}

async function fetchFullArticleHtml(titleOrUrl) {
  if (!titleOrUrl) throw new Error('No title or url provided');

  let title = titleOrUrl;
  try {
    const m = String(titleOrUrl).match(/\/wiki\/([^#?/]+)/);
    if (m && m[1]) {
      title = decodeURIComponent(m[1]);
    }
  } catch (e) {}

  const api = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&formatversion=2&origin=*`;

  const res = await fetch(api);
  if (!res.ok) throw new Error('Failed to fetch full article');
  const data = await res.json();

  const pageHtml = data?.parse?.text;
  if (!pageHtml) throw new Error('No page HTML returned');

  return sanitizeWikiHtml(pageHtml);
}

async function fetchAndShowFullArticle(titleOrUrl) {
  if (!titleOrUrl) return;

  const titleDisplay = (typeof titleOrUrl === 'string') ? titleOrUrl.replace(/_/g, ' ') : 'Article';
  showFeatureResult({ title: `Loading — ${escapeHtml(titleDisplay)}`, html: `<div style="padding:16px;">Loading full article…</div>` });

  try {
    const sanitizedHtml = await fetchFullArticleHtml(titleOrUrl);

    const backBtnHtml = `<button id="wikiBackBtn" class="wiki-back" style="margin-right:8px;">Back to summary</button>`;
    const externalLink = `<a href="https://en.wikipedia.org/wiki/${encodeURIComponent(titleOrUrl)}" target="_blank" rel="noopener" style="margin-left:8px;">Open on Wikipedia</a>`;

    const fullHtml = `
      <div class="wiki-full-header" style="margin-bottom:12px;">
        ${backBtnHtml}
        ${externalLink}
      </div>
      <div class="wiki-full-article">${sanitizedHtml}</div>
    `;

    showFeatureResult({ title: `${escapeHtml(titleDisplay)} — Full article`, html: fullHtml });

    const backBtn = featurePanel.querySelector('#wikiBackBtn');
    if (backBtn && lastWikiState && lastWikiState.summaryHtml) {
      backBtn.addEventListener('click', () => {
        showFeatureResult({ title: `Wikipedia — ${escapeHtml(lastWikiState.title)}`, html: lastWikiState.summaryHtml });
        const rm = featurePanel.querySelector('#wikiReadMoreBtn');
        if (rm) {
          rm.addEventListener('click', () => {
            const url = rm.getAttribute('data-url') || lastWikiState.pageUrl;
            fetchAndShowFullArticle(url);
          });
        }
      });
    }

  } catch (e) {
    console.error('fetchAndShowFullArticle error', e);
    showFeatureResult({
      title: `Full article`,
      html: `<p>Unable to load full article inside the popup. You can open it on Wikipedia: <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(titleOrUrl)}" target="_blank" rel="noopener">Open on Wikipedia</a></p>`
    });
  }
}

let currentScript = null;
let currentFocus = -1;
let isNavigating = false;

window.handleGoogleSuggestions = function(data) {
  const matches = data[1];
  if (!suggestionsBox) return;
  suggestionsBox.innerHTML = '';

  if (!matches || matches.length === 0) {
    suggestionsBox.style.display = 'none';
    return;
  }

  matches.forEach((match, index) => {
    const li = document.createElement('li');
    li.textContent = match;
    li.setAttribute('data-index', index);

    li.addEventListener('click', () => {
      searchInput.value = match;
      suggestionsBox.style.display = 'none';
      currentFocus = -1;
      doSearch(match);
    });

    suggestionsBox.appendChild(li);
  });

  suggestionsBox.style.display = 'block';
  currentFocus = -1;
};

function fetchSuggestions(query) {
  if (currentScript) {
    currentScript.remove();
    currentScript = null;
  }

  const script = document.createElement('script');
  currentScript = script;
  script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&callback=handleGoogleSuggestions`;

  script.onload = () => {
    setTimeout(() => {
      if (script.parentNode) script.remove();
    }, 1000);
  };

  script.onerror = () => {
    if (script.parentNode) script.remove();
  };

  document.body.appendChild(script);
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    if (isNavigating) {
      isNavigating = false;
      return;
    }

    const query = searchInput.value.trim();

    try {
      const compact = searchInput.value.replace(/\s+/g, '');
      if (compact === '67') {
        if (!window.__last67Played || (Date.now() - window.__last67Played > 3000)) {
          play67Effect();
          window.__last67Played = Date.now();
        }
      }
    } catch (e) {
      console.error('67 detection error', e);
    }

    if (!query) {
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';
      currentFocus = -1;
      return;
    }

    fetchSuggestions(query);
  });

  searchInput.addEventListener('keydown', function(e) {
    const items = suggestionsBox ? suggestionsBox.getElementsByTagName('li') : [];
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      isNavigating = true;
      currentFocus++;
      updateActive(items);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      isNavigating = true;
      currentFocus--;
      updateActive(items);
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (currentFocus > -1) {
        e.preventDefault();
        if (items[currentFocus]) items[currentFocus].click();
      }
    }
  });
}

function updateActive(items) {
  if (!items) return false;

  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }

  if (currentFocus >= items.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = items.length - 1;

  items[currentFocus].classList.add("active");
  searchInput.value = items[currentFocus].textContent;
}

document.addEventListener('click', e => {
  if (searchInput && !searchInput.contains(e.target) && suggestionsBox && !suggestionsBox.contains(e.target)) {
    if (suggestionsBox) suggestionsBox.style.display = 'none';
  }
});

function play67Effect() {
  if (!audio67 || !container) return;

  try {
    audio67.currentTime = 0;
    audio67.play().catch(() => {});
  } catch (e) {}

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const emoji = document.createElement("span");
      emoji.textContent = "6️⃣7️⃣";

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      emoji.style.left = x + "px";
      emoji.style.top = y + "px";
      emoji.style.position = "absolute";
      emoji.style.pointerEvents = "none";
      emoji.style.userSelect = "none";

      container.appendChild(emoji);
    }, Math.random() * 3000);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 3000);
}

async function doSearch(query) {

if (chatBtn) chatBtn.style.display = "block";

const frame = document.getElementById("aiFrame");

frame.style.display = "block";
frame.src = `/essentials/echo-ai-embed.html?q=${encodeURIComponent(query)}`;

if (query.length > 3) {
  frame.style.display = "block";
} else {
  frame.style.display = "none";
}

  if (!query || !query.trim()) return;

  query = String(query).trim();

  const compact = query.replace(/\s+/g, '');
  if (compact === '67') {
    if (!window.__last67Played || (Date.now() - window.__last67Played > 3000)) {
      play67Effect();
      window.__last67Played = Date.now();
    }
    return;
  }

  try {
    try {
      const weatherResult = await handleWeather(query);
      if (weatherResult) {
        if (weatherResult.error) {
          showFeatureResult({ title: 'Weather', html: `<p>${escapeHtml(weatherResult.error)}</p>` });
        } else if (weatherResult.type === 'weather') {
          if (weatherResult.when === 'tomorrow') {
            const html = `
              <div class="weather-block">
                <div class="weather-place">${escapeHtml(weatherResult.place)}</div>
                <div class="weather-icon">${weatherResult.icon}</div>
                <div class="weather-temps">High: <strong>${weatherResult.high}°C</strong> — Low: <strong>${weatherResult.low}°C</strong></div>
              </div>
            `;
            showFeatureResult({ title: `Weather — ${escapeHtml(weatherResult.place)}`, html });
          } else {
            const hoursHtml = (weatherResult.nextHours || []).map(h => `<div class="hour-item">${h.time} — ${h.icon} ${h.temp}°C</div>`).join('');
            const html = `
              <div class="weather-block">
                <div class="weather-place">${escapeHtml(weatherResult.place)}</div>
                <div class="weather-now">${weatherResult.current.icon} Now: <strong>${weatherResult.current.temp}°C</strong> — Wind: ${weatherResult.current.wind ?? 'N/A'} km/h</div>
                <div class="weather-next"><strong>Next hours</strong>${hoursHtml}</div>
              </div>
            `;
            showFeatureResult({ title: `Weather — ${escapeHtml(weatherResult.place)}`, html });
          }
          searchInput.value = "";
          if (chatBtn) chatBtn.style.display = "block";
          return;
        }
      }
    } catch (e) {
      console.error('Weather handler threw', e);
    }

    try {
      const whoIsResult = await handleWhoIs(query);
      if (whoIsResult) {
        if (whoIsResult.type === 'whois') {
          const readMoreUrl = whoIsResult.url || `https://en.wikipedia.org/wiki/${encodeURIComponent(whoIsResult.title)}`;
          const html = `
            <div class="whois-block">
              <div class="whois-title"><strong>${escapeHtml(whoIsResult.title)}</strong></div>
              <div class="whois-extract">${escapeHtml(whoIsResult.extract)}</div>
              <div class="whois-actions" style="margin-top:8px;">
                <button id="wikiReadMoreBtn" class="wiki-readmore" data-url="${escapeHtml(readMoreUrl)}">Read more</button>
              </div>
            </div>
          `;

          lastWikiState = {
            type: 'whois',
            title: whoIsResult.title,
            summaryHtml: html,
            pageUrl: readMoreUrl,
            query
          };

          showFeatureResult({ title: `Who is ${escapeHtml(whoIsResult.title)}`, html });

          const content = featurePanel.querySelector('.feature-content');
          if (content) {
            content.innerHTML = html;
          }

          try {
            const readBtn = featurePanel.querySelector('#wikiReadMoreBtn');
            if (readBtn) {
              readBtn.addEventListener('click', () => {
                const url = readBtn.getAttribute('data-url') || readMoreUrl;
                fetchAndShowFullArticle(url);
              });
            }
          } catch (e) {
            console.error('Failed to attach WhoIs read more handler', e);
          }

          searchInput.value = "";
          if (chatBtn) chatBtn.style.display = "block";
          return;
        }
      }
    } catch (e) {
      console.error('WhoIs handler threw', e);
    }

    try {
      const timeResult = handleTimeAndDate(query);
      if (timeResult) {
        const html = `<div class="time-block">${escapeHtml(timeResult)}</div>`;
        showFeatureResult({ title: 'Time & Date', html });
        searchInput.value = "";
        if (chatBtn) chatBtn.style.display = "block";
        return;
      }
    } catch (e) {
      console.error('Time handler threw', e);
    }

    try {
      const translation = await handleSearch(query);
      if (translation) {
        if (translation.error) {
          showFeatureResult({ title: 'Translation', html: `<p>${escapeHtml(translation.error)}</p>` });
        } else if (translation.type === 'translation') {
          const html = `
            <div class="translation-block">
              <div class="translation-example">${escapeHtml(translation.from)} <span class="arrow">→</span> <strong>${escapeHtml(translation.to)}</strong></div>
              <div class="translation-meta">Target language: ${escapeHtml(translation.targetLang)}</div>
            </div>
          `;
          showFeatureResult({ title: 'Translation', html });
          searchInput.value = "";
          if (chatBtn) chatBtn.style.display = "block";
          return;
        }
      }
    } catch (e) {
      console.error('Translation handler threw', e);
    }

    try {
      const def = await handleDictionarySearch(query);
      if (def) {
        if (def.error) {
          showFeatureResult({ title: 'Definition', html: `<p>${escapeHtml(def.error)}</p>` });
        } else {
          const listenButtonHtml = `<button id="dictListenBtn" class="dict-listen" aria-label="Play pronunciation">🔊</button>`;
          const html = `
            <div class="dict-block">
              <div class="dict-word">${listenButtonHtml} <strong>${escapeHtml(def.word)}</strong></div>
              <div class="dict-meaning">${escapeHtml(def.meaning)}</div>
              <div class="dict-example">Example: ${escapeHtml(def.example)}</div>
              <div class="dict-source">Source: ${escapeHtml(def.source || 'unknown')}</div>
            </div>
          `;
          showFeatureResult({ title: `Definition — ${escapeHtml(def.word)}`, html });

          try {
            const listenBtn = featurePanel.querySelector('#dictListenBtn');
            if (listenBtn) {
              if (def.audio) {
                listenBtn.addEventListener('click', () => {
                  try {
                    let audioEl = featurePanel.querySelector('#dictAudioElem');
                    if (!audioEl) {
                      audioEl = document.createElement('audio');
                      audioEl.id = 'dictAudioElem';
                      audioEl.src = def.audio;
                      featurePanel.appendChild(audioEl);
                    }
                    audioEl.currentTime = 0;
                    audioEl.play().catch(() => {});
                  } catch (e) { console.error('Audio play failed', e); }
                });
              } else {
                listenBtn.disabled = true;
                listenBtn.title = "No pronunciation audio available.";
                listenBtn.style.opacity = "0.5";
                listenBtn.style.cursor = "not-allowed";
              }
            }
          } catch (e) {
            console.error('Failed to attach dictionary audio handler', e);
          }

          searchInput.value = "";
          if (chatBtn) chatBtn.style.display = "block";
          return;
        }
      }
    } catch (e) {
      console.error('Dictionary handler threw', e);
    }

    try {
      const result = handleMathConversion(query);
      if(result) {
        if (result.type === 'math') {
          const html = `
            <div class="math-block">
              <div class="math-expression">Expression: <code>${escapeHtml(result.expression)}</code></div>
              <div class="math-answer">Answer: <strong>${escapeHtml(String(result.result))}</strong></div>

              <div class="mini-calc">
                <div class="mini-calc-title">Calculator</div>
                <form class="mini-calc-form" onsubmit="return false;">
                  <input class="calc-display" aria-label="Calculator input" value="${escapeHtml(result.expression)}" />
                  <div class="calc-controls">
                    <div class="calc-keypad" role="group" aria-label="Calculator keypad">
                      <button type="button" class="calc-btn" data-val="7">7</button>
                      <button type="button" class="calc-btn" data-val="8">8</button>
                      <button type="button" class="calc-btn" data-val="9">9</button>
                      <button type="button" class="calc-btn" data-val="/">÷</button>

                      <button type="button" class="calc-btn" data-val="4">4</button>
                      <button type="button" class="calc-btn" data-val="5">5</button>
                      <button type="button" class="calc-btn" data-val="6">6</button>
                      <button type="button" class="calc-btn" data-val="*">×</button>

                      <button type="button" class="calc-btn" data-val="1">1</button>
                      <button type="button" class="calc-btn" data-val="2">2</button>
                      <button type="button" class="calc-btn" data-val="3">3</button>
                      <button type="button" class="calc-btn" data-val="-">−</button>

                      <button type="button" class="calc-btn" data-val="0">0</button>
                      <button type="button" class="calc-btn" data-val=".">.</button>
                      <button type="button" class="calc-eq">=</button>
                      <button type="button" class="calc-btn" data-val="+">+</button>
                    </div>
                    <div class="calc-actions">
                      <button type="button" class="calc-clear">Clear</button>
                      <div class="calc-result" aria-live="polite"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          `;
          showFeatureResult({ title: 'Calculator', html });
          searchInput.value = "";
          if (chatBtn) chatBtn.style.display = "block";
          return;
        } else if (result.type === 'conversion') {
          if (result.error) {
            showFeatureResult({ title: 'Conversion', html: `<p>${escapeHtml(result.error)}</p>` });
          } else {
            const html = `<div class="conv-block">${result.inputValue} ${escapeHtml(result.from)} = <strong>${escapeHtml(String(result.result))} ${escapeHtml(result.to)}</strong></div>`;
            showFeatureResult({ title: 'Conversion', html });
            searchInput.value = "";
            if (chatBtn) chatBtn.style.display = "block";
            return;
          }
        }
      }
    } catch (e) {
      console.error('Math handler threw', e);
    }

  } catch (e) {
    console.error('Instant-answer detection error', e);
  }

  history = history.filter(h => h !== query);
  history.unshift(query);
  saveLifetime(query);

  if (history.length > 10) history.pop();

  saveHistory();
  renderHistory();

  const domainURL = domainSearchHandler(query);
  if (domainURL) {
    openResult(domainURL);
    return;
  }

  if (/^[\w.-]+\.[a-z]{2,}$/i.test(query)) {
    let url = query;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    openResult(url);
    return;
  }

  const searchElement = (window.google && google.search && google.search.cse && google.search.cse.element) ? google.search.cse.element.getElement("searchbox1") : null;
  if (searchElement) {
    searchElement.execute(query);
    if (gcseResults) {
      try {
        window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
      } catch (e) {}
    }
  } else {
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    try {
      window.open(googleUrl, '_blank');
    } catch (e) {
      openResult(googleUrl, true);
    }
  }
}

let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = "";

  if (history.length === 0) {
    if (historyTitle) historyTitle.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  if (historyTitle) historyTitle.style.display = "block";
  if (clearBtn) clearBtn.style.display = "inline-block";

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => doSearch(item));
    historyList.appendChild(li);
  });
}

function saveHistory() {
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    history = [];
    saveHistory();
    renderHistory();
  });
}

renderHistory();

if (chatBtn) {
  chatBtn.addEventListener("click", () => {
    window.open("/essentials/echo_ai", "_blank");
  });
}

window.addEventListener("load", () => {
  if (chatBtn) chatBtn.style.display = "none";
});

if (searchBtn) {
  searchBtn.addEventListener("click", function() {
    const query = (searchInput && searchInput.value) ? searchInput.value.trim() : '';
    if (!query) return;
    doSearch(query);
  });
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, function (m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]);
  });
}

window.addEventListener("message", (e) => {
  if (e.data.height) {
    document.getElementById("aiFrame").style.height = e.data.height + "px";
  }
});

const iframe = document.querySelector("iframe");

const styles = getComputedStyle(document.documentElement);

iframe.contentWindow.postMessage({
  text: styles.getPropertyValue("--text"),
  bg: styles.getPropertyValue("--bg")
}, "*");

function checkWifi() {
  const offlineBox = document.getElementById("offline-box");
  if (!offlineBox) return;

  const show = () => offlineBox.style.display = "block";
  const hide = () => offlineBox.style.display = "none";

  // If browser already reports offline, show immediately
  if (navigator.onLine === false) {
    show();
    return;
  }

  // Primary probe: a small cross-origin GET to a 204 endpoint.
  // Use no-cors so the browser doesn't block the request; when offline this will reject.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  fetch('https://www.gstatic.com/generate_204', {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-store',
    signal: controller.signal
  })
    .then(() => {
      clearTimeout(timeoutId);
      // request succeeded -> online
      hide();
    })
    .catch(() => {
      clearTimeout(timeoutId);
      // Primary probe failed -> fallback to local favicon HEAD check (original behavior)
      const controller2 = new AbortController();
      const t2 = setTimeout(() => controller2.abort(), 3000);

      fetch("/favicon.ico", {
        method: "HEAD",
        cache: "no-store",
        signal: controller2.signal
      })
        .then(resp => {
          clearTimeout(t2);
          (resp && resp.ok) ? hide() : show();
        })
        .catch(() => {
          clearTimeout(t2);
          show();
        });
    });
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/essentials/service-worker.js")
        .catch(err => console.log("SW failed:", err));
}
