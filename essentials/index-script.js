// essentials/index-script.js — full fixed version (alerts on special handlers)
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
const slider = document.getElementById("openInNewTabSlider");
const btn67 = document.getElementById("btn67");
const audio67 = document.getElementById("audio67");
const container = document.getElementById("emojiContainer");

// history must be defined early
let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

function saveLifetime(query) {
  try {
    const entry = { query, time: Date.now() };
    const life = JSON.parse(localStorage.getItem("lifetimeHistory") || "[]");
    life.unshift(entry);
    localStorage.setItem("lifetimeHistory", JSON.stringify(life));
  } catch (e) {
    console.error("saveLifetime error", e);
  }
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
  "What do you call a cow with no legs? Ground beef."
  // (list truncated for readability - you can keep the full list if desired)
];

let openNewTab = false;
if (slider) {
  slider.addEventListener("click", () => {
    slider.classList.toggle("active");
    openNewTab = slider.classList.contains("active");
  });
}

function openResult(url) {
  if (!url) return;
  if (openNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
}

function domainSearchHandler(query) {
  if (!query) return null;
  query = query.trim();
  const match = query.match(/^site:(.+)$/i);
  if (!match) return null;
  const domain = match[1].trim();
  return `https://www.google.com/search?q=site:${encodeURIComponent(domain)}`;
}

/* ===========================
   THEME SELECT (unchanged logic but guarded)
   =========================== */
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
    sep.textContent = '────────── Custom Themes ──────────';
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

  if (themeSelect) {
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
  }
})();

/* Surprise button — alerts a random fact */
if (surpriseBtn) {
  surpriseBtn.addEventListener("click", () => {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    alert(fact);
  });
}

/* ===== voice recognition (guarded) ===== */
let recognition;
if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-GB";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    voiceBtn.classList.add("listening");
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("listening");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (searchInput) {
      searchInput.value = transcript;
      doSearch(transcript);
    }
  };

  voiceBtn.addEventListener("click", () => {
    try { recognition.start(); } catch (e) { console.error(e); }
  });
} else if (voiceBtn) {
  voiceBtn.disabled = true;
  voiceBtn.title = "Voice input not supported in this browser.";
}

/* ==============
   Google custom search callback
   ============== */
window.__gcse = {
  callback: function() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryFromUrl = urlParams.get('q');
      if (queryFromUrl && window.google && google.search && google.search.cse) {
        const searchElement = google.search.cse.element.getElement("searchbox1");
        if (searchElement) {
          searchElement.execute(queryFromUrl);
          if (gcseResults) window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
        }
      }

      if (searchInput) {
        searchInput.addEventListener("keydown", function(e) {
          if (e.key === "Enter") {
            if (searchBtn) searchBtn.click();
          }
        });
      }
    } catch (e) {
      console.error("__gcse callback error", e);
    }
  }
};

/* ===== Math / conversions ===== */
function handleMathConversionRaw(query) {
  if (!query) return null;
  query = query.trim();

  // quick numeric expression detection (allow digits, operators, parentheses, decimal, whitespace, E notation, ^)
  const numericExpr = query.replace(/,/g, '').replace(/\s+/g, '');
  if (/^[0-9+\-*/^().eE%]+$/.test(numericExpr)) {
    // replace ^ with ** and handle percent
    try {
      let expr = query.replace(/,/g, '').replace(/\^/g, '**').trim();
      // remove any characters not allowed (safety)
      if (!/^[0-9+\-*/().\s*%eE**]+$/.test(expr)) {
        // fallback: do not eval suspicious expressions
        // continue to unit conversion detection
      } else {
        // handle percent (e.g., "50%")
        expr = expr.replace(/(\d+(\.\d+)?)%/g, "($1/100)");
        // Evaluate safely using Function
        const val = Function(`"use strict"; return (${expr})`)();
        if (typeof val === 'number' && isFinite(val)) {
          return `Result: ${val}`;
        }
      }
    } catch (e) {
      // ignore and continue to other handlers
    }
  }

  // units conversion detection: "12 km to m"
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

  const convMatch = query.match(/^([\d.,]+)\s*([a-zA-Z\/]+)\s*to\s*([a-zA-Z\/]+)$/i);
  if (convMatch) {
    const value = parseFloat(convMatch[1].replace(/,/g, ''));
    const from = convMatch[2].toLowerCase();
    const to = convMatch[3].toLowerCase();

    for (const cat in units) {
      const u = units[cat];
      if (u[from] !== undefined && u[to] !== undefined) {
        const result = value * u[from] / u[to];
        return `${value} ${from} = ${result} ${to}`;
      }
    }
    return "Conversion units not recognized.";
  }

  return null;
}

function handleMathConversion(query) {
  const r = handleMathConversionRaw(query);
  if (r) {
    alert(r);
    return true;
  }
  return false;
}

/* ===== Who is (Wikipedia) — alerts summary if found ===== */
async function handleWhoIs(input) {
  const match = input.match(/^who\s+is\s+(.+)$/i);
  if (!match) return false;

  const person = match[1].trim();
  if (!person) return false;

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(person)}`
    );
    if (!res.ok) return false;

    const data = await res.json();
    if (!data || !data.extract) return false;

    alert(`${data.title}\n\n${data.extract}`);
    return true;
  } catch (e) {
    console.error('handleWhoIs error', e);
    return false;
  }
}

/* ===== Weather handler (alerts formatted weather) ===== */
async function handleWeather(input) {
  const tomorrowMatch = input.match(/^weather\s+tomorrow\s+in\s+(.+)$/i);
  const todayMatch = input.match(/^weather\s+in\s+(.+)$/i);

  if (!tomorrowMatch && !todayMatch) return false;

  const place = (tomorrowMatch || todayMatch)[1].trim();
  const isTomorrow = !!tomorrowMatch;

  try {
    // 1) Geocode place → lat/lon (limit=1)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`
    );
    if (!geoRes.ok) {
      alert(`Couldn't find "${place}".`);
      return true;
    }
    const geo = await geoRes.json();
    if (!geo.length) {
      alert(`Couldn't find "${place}".`);
      return true;
    }

    const { lat, lon, display_name } = geo[0];

    // 2) Fetch weather - use open-meteo
    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    );
    if (!wRes.ok) {
      alert("Weather lookup failed.");
      return true;
    }
    const w = await wRes.json();

    const icon = c => ({
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
      45: "🌫️", 48: "🌫️",
      51: "🌦️", 61: "🌧️", 71: "❄️",
      95: "⛈️"
    }[c] || "🌡️");

    if (isTomorrow) {
      if (!w.daily || !Array.isArray(w.daily.temperature_2m_max) || w.daily.temperature_2m_max.length < 2) {
        alert(`No forecast available for tomorrow in ${display_name}.`);
        return true;
      }
      const text = `🌍 Tomorrow in ${display_name}\n\n${icon(w.daily.weathercode?.[1])}\n🌡️ High: ${w.daily.temperature_2m_max[1]}°C\n🌡️ Low: ${w.daily.temperature_2m_min[1]}°C`;
      alert(text);
      return true;
    }

    // Today + next 6 hours
    const pad = n => String(n).padStart(2, '0');
    const d = new Date();
    const nowHour = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}`;

    let start = -1;
    if (w.hourly && Array.isArray(w.hourly.time)) {
      start = w.hourly.time.findIndex(t => t.startsWith(nowHour));
    }
    if (start === -1) start = 0;

    let hours = "";
    for (let i = start; i < start + 6; i++) {
      if (!w.hourly.time[i]) break;
      hours += `\n${w.hourly.time[i].slice(11, 16)} — ${icon(w.hourly.weathercode?.[i]) || ''} ${w.hourly.temperature_2m?.[i]}°C`;
    }

    const text = `🌍 Weather in ${display_name}\n\n${icon(w.current_weather?.weathercode)}\n🌡️ Now: ${w.current_weather?.temperature}°C\n🌬️ Wind: ${w.current_weather?.windspeed ?? 'N/A'} km/h\n\n🕒 Next hours:${hours}`;
    alert(text);
    return true;
  } catch (e) {
    console.error('handleWeather error', e);
    alert("Weather lookup failed.");
    return true;
  }
}

/* =========================
   TRANSLATION (alerts)
   ========================= */
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
  hmn: 'hmn', hmong: 'hmn',
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
  // Trigger ONLY on: one word + "in" + language
  const match = input.match(/^([a-zA-Z]+)\s+in\s+([a-zA-Z\s]+)$/i);
  if (!match) return false;

  const word = match[1].trim();

  let language = match[2]
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (!langMap[language]) return false;

  const tl = langMap[language];

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(word)}`
    );

    if (!res.ok) {
      alert("Translation failed.");
      return true;
    }

    const data = await res.json();
    const translation = data?.[0]?.[0]?.[0] || "No translation returned.";
    alert(translation);
    return true;
  } catch (e) {
    console.error('handleSearch error', e);
    alert("Translation failed.");
    return true;
  }
}

/* ===== Dictionary / definition (alerts) ===== */
async function handleDictionarySearch(query) {
  try {
    const lower = query.toLowerCase().trim();
    const triggers = ["meaning of", "definition of", "define", "dictionary", "meaning"];
    const isDictionaryQuery = triggers.some(word => lower.includes(word));
    if (!isDictionaryQuery) return false;

    const word = lower.replace(/(meaning of|definition of|define|dictionary|meaning)/g, "").trim();
    if (!word) {
      alert("Please enter a word to define.");
      return true;
    }

    const wordUpper = word.toUpperCase();

    // Try local dictionary first
    try {
      const localRes = await fetch("/essentials/dictionary.json");
      if (localRes.ok) {
        const localData = await localRes.json();
        if (localData && localData[wordUpper]) {
          const entry = localData[wordUpper];
          const meaning = entry.meaning || "No meaning found.";
          const example = entry.example || "No example available.";
          alert(`${word}: ${meaning}\nExample: ${example}`);
          return true;
        }
      }
    } catch (e) {
      // ignore local failure
    }

    // Fallback to dictionaryapi.dev
    try {
      const apiRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data) && data[0]?.meanings?.[0]?.definitions?.[0]) {
          const meaning = data[0].meanings[0].definitions[0].definition;
          const example = data[0].meanings[0].definitions[0].example || "No example available.";
          alert(`${word}: ${meaning}\nExample: ${example}`);
          return true;
        }
      }
    } catch (e) {
      // ignore
    }

    alert("No definition found.");
    return true;
  } catch (e) {
    console.error('handleDictionarySearch error', e);
    return false;
  }
}

/* ===== 67 effect ===== */
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
      emoji.style.fontSize = (12 + Math.random() * 24) + "px";
      container.appendChild(emoji);
    }, Math.random() * 3000);
  }

  setTimeout(() => {
    if (container) container.innerHTML = "";
  }, 3000);
}

/* ==============
   Core search flow
   ============== */

function doSearch(query) {
  if (!query || !query.trim()) return;

  const compact = query.replace(/\s+/g, '');
  if (compact === '67') {
    if (!window.__last67Played || (Date.now() - window.__last67Played > 3000)) {
      play67Effect();
      window.__last67Played = Date.now();
    }
    return;
  }

  // update local history (unique, most recent first)
  try {
    history = history.filter(h => h !== query);
    history.unshift(query);
    saveLifetime(query);

    if (history.length > 10) history = history.slice(0, 10);

    saveHistory();
    renderHistory();
  } catch (e) {
    console.error('history update error', e);
  }

  // site:domain handler
  const domainURL = domainSearchHandler(query);
  if (domainURL) {
    openResult(domainURL);
    return;
  }

  // bare domain
  if (/^[\w.-]+\.[a-z]{2,}$/i.test(query)) {
    let url = query;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    openResult(url);
    return;
  }

  try {
    if (window.google && google.search && google.search.cse) {
      const searchElement = google.search.cse.element.getElement("searchbox1");
      if (searchElement) {
        searchElement.execute(query);
        if (gcseResults) window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
        return;
      }
    }
  } catch (e) {
    // ignore and fallback to regular google search
  }


/* ===== Search button handler: check special handlers first; they will alert() and return true if handled ===== */
if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", async function() {
    const query = searchInput.value.trim();
    if (!query) return;

    // WEATHER
    try {
      const weatherHandled = await handleWeather(query);
      if (weatherHandled) {
        searchInput.value = "";
        if (chatBtn) chatBtn.style.display = "block";
        return;
      }
    } catch (e) { console.error(e); }

    // TRANSLATION (one word in language)
    try {
      const translationHandled = await handleSearch(query);
      if (translationHandled) {
        searchInput.value = "";
        if (chatBtn) chatBtn.style.display = "block";
        return;
      }
    } catch (e) { console.error(e); }

    // WHO IS
    try {
      const whoHandled = await handleWhoIs(query);
      if (whoHandled) {
        searchInput.value = "";
        if (chatBtn) chatBtn.style.display = "block";
        return;
      }
    } catch (e) { console.error(e); }

    // DICTIONARY
    try {
      const dictHandled = await handleDictionarySearch(query);
      if (dictHandled) {
        searchInput.value = "";
        if (chatBtn) chatBtn.style.display = "block";
        return;
      }
    } catch (e) { console.error(e); }

    // MATH / conversions
    try {
      const mathHandled = handleMathConversion(query);
      if (mathHandled) {
        searchInput.value = "";
        if (chatBtn) chatBtn.style.display = "block";
        return;
      }
    } catch (e) { console.error(e); }

    // fallback to normal search
    doSearch(query);
    searchInput.value = "";
    if (chatBtn) chatBtn.style.display = "block";
  });
}

/* ===== Google suggestions integration ===== */
let currentScript = null;
let currentFocus = -1;
let isNavigating = false;

window.handleGoogleSuggestions = function(data) {
  try {
    if (!suggestionsBox) return;
    const matches = data && data[1] ? data[1] : [];
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
        if (searchInput) searchInput.value = match;
        suggestionsBox.style.display = 'none';
        currentFocus = -1;
        doSearch(match);
      });

      suggestionsBox.appendChild(li);
    });

    suggestionsBox.style.display = 'block';
    currentFocus = -1;
  } catch (e) {
    console.error('handleGoogleSuggestions error', e);
  }
};

function fetchSuggestions(query) {
  if (!query) return;
  if (!document || !document.body) return;

  if (currentScript) {
    currentScript.remove();
    currentScript = null;
  }

  const script = document.createElement('script');
  currentScript = script;
  script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&callback=handleGoogleSuggestions`;
  script.async = true;

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
    } catch (err) {
      console.error('67 detection error', err);
    }

    if (!query) {
      if (suggestionsBox) {
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
      }
      currentFocus = -1;
      return;
    }

    fetchSuggestions(query);
  });

  searchInput.addEventListener('keydown', function(e) {
    if (!suggestionsBox) return;
    const items = suggestionsBox.getElementsByTagName('li');
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

/* helpers for suggestion navigation */
function updateActive(items) {
  if (!items) return false;

  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }

  if (currentFocus >= items.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = items.length - 1;

  items[currentFocus].classList.add("active");
  if (searchInput) searchInput.value = items[currentFocus].textContent;
  return true;
}

document.addEventListener('click', e => {
  if (!searchInput || !suggestionsBox) return;
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.style.display = 'none';
  }
});

/* ===== History rendering and persistence ===== */
function renderHistory() {
  if (!historyList || !historyTitle || !clearBtn) return;

  historyList.innerHTML = "";

  if (!history || history.length === 0) {
    historyTitle.style.display = "none";
    clearBtn.style.display = "none";
    return;
  }

  historyTitle.style.display = "block";
  clearBtn.style.display = "inline-block";

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => doSearch(item));
    historyList.appendChild(li);
  });
}

function saveHistory() {
  try {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  } catch (e) {
    console.error('saveHistory error', e);
  }
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    history = [];
    saveHistory();
    renderHistory();
  });
}

/* initial render */
renderHistory();

/* chat button and load */
if (chatBtn) {
  chatBtn.addEventListener("click", () => {
    window.open("https://chatgpt.com", "_blank");
  });

  window.addEventListener("load", () => {
    chatBtn.style.display = "none";
  });
}
