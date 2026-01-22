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

slider.addEventListener("click", () => {
  slider.classList.toggle("active");
  openNewTab = slider.classList.contains("active");
});

function openResult(url) {
  if (openNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
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

surpriseBtn.addEventListener("click", () => {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  alert(fact);
});

let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-UK";
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
    searchInput.value = transcript;
    doSearch(transcript);
  };

  voiceBtn.addEventListener("click", () => {
    try { recognition.start(); } catch (e) { }
  });
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = "Voice input not supported in this browser.";
}

window.__gcse = {
  callback: function() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');
    if (queryFromUrl) {
      const searchElement = google.search.cse.element.getElement("searchbox1");
      if (searchElement) {
        searchElement.execute(queryFromUrl);
        window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
      }
    }
   
    searchInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  }
};

function handleMathConversion(query) {
  query = query.trim();

  try {
    if (/^[0-9+\-*/^().\sÃÃ·eE,]+$|^[a-zA-Z0-9+\-*/^().\sÃÃ·eE,]+$/.test(query)) {
      return "Result: " + eval(query);
    }
  } catch(e) { }

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
        return `${value} ${from} = ${result} ${to}`;
      }
    }
    return "Conversion units not recognized.";
  }

  return null;
}

async function handleDictionarySearch(query) {
  const lower = query.toLowerCase().trim();
  const triggers = ["meaning of", "definition of", "define", "dictionary", "meaning"];
  const isDictionaryQuery = triggers.some(word => lower.includes(word));

  if (!isDictionaryQuery) return null;

  const word = lower.replace(/(meaning of|definition of|define|dictionary|meaning)/g, "").trim();
  if (!word) return "Please enter a word to define.";

  const wordUpper = word.toUpperCase();

  try {
    const localRes = await fetch("/essentials/dictionary.json");
    if (localRes.ok) {
      const localData = await localRes.json();
      if (localData && localData[wordUpper]) {
        const entry = localData[wordUpper];
        const meaning = entry.meaning || "No meaning found.";
        const example = entry.example || "No example available.";
        return `${word}: ${meaning}\nExample: ${example}`;
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
        return `${word}: ${meaning}\nExample: ${example}`;
      }
    }
  } catch (e) {}

  return "No definition found.";
}

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

function doSearch(query) {
  if (!query.trim()) return;

  const compact = query.replace(/\s+/g, '');
  if (compact === '67') {
    if (!window.__last67Played || (Date.now() - window.__last67Played > 3000)) {
      play67Effect();
      window.__last67Played = Date.now();
    }
    return;
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

  const searchElement = google.search.cse.element.getElement("searchbox1");
  if (searchElement) {
    searchElement.execute(query);
    window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
  }
}

searchBtn.addEventListener("click", async function() {
  const query = searchInput.value.trim();
  if(!query) return;

  const def = await handleDictionarySearch(query);
  if (def) {
    alert(def);
    return;
  }

  const result = handleMathConversion(query);
  if(result) {
    alert(result);
    return;
  }

  doSearch(query);
  searchInput.value = "";
});

let currentScript = null;
let currentFocus = -1;
let isNavigating = false;

window.handleGoogleSuggestions = function(data) {
  const matches = data[1]; 
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
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.style.display = 'none';
  }
});

let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
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
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

clearBtn.addEventListener("click", () => {
  history = [];
  saveHistory();
  renderHistory();
});

renderHistory();

searchBtn.addEventListener("click", function () {
  chatBtn.style.display = "block";
});

chatBtn.addEventListener("click", () => {
  window.open("https://chatgpt.com", "_blank");
});

window.addEventListener("load", () => {
  chatBtn.style.display = "none";
});
