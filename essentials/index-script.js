const surpriseBtn = document.getElementById("surpriseBtn");
const voiceBtn = document.getElementById("voiceBtn");
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById('suggestions');
const searchBtn = document.getElementById("searchBtn");
const darkToggle = document.getElementById("darkModeToggle");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");
const historyTitle = document.getElementById("historyTitle");
const chatBtn = document.getElementById("chatBtn");
const gcseResults = document.getElementById("gcse-results");
const themeSelect = document.getElementById('theme');
const input = document.querySelector('input[type="search"]');
const ul = document.getElementById("historyList");

function saveLifetime(query) {
  const entry = { query, time: Date.now() };
  const life = JSON.parse(localStorage.getItem("lifetimeHistory") || "[]");
  life.unshift(entry);
  localStorage.setItem("lifetimeHistory", JSON.stringify(life));
}

const facts = [
  "Every snowflake that's ever fallen is unique, but none remember it.",
  "Sharks were swimming long before the first tree existed.",
  "The Great Pyramid was once polished so bright it reflected sunlight like a mirror.",
  "Octopuses taste with their skin; they never stop knowing the world.",
  "Lightning can strike the same place twice, and often does.",
  "Bees can smell fear. That's not a metaphor.",
  "There's a species of jellyfish that ages backward when threatened.",
  "The moon drifts a few centimeters farther from us each year. Every goodbye starts small.",
  "Your body replaces most of itself every few years, but keeps the same mind.",
  "Some whales sing songs that last for hours and change slightly each season.",
  "Bananas share about 60% of their DNA with you. Nature likes recycling.",
  "Ants have no lungs. They just let air wander through them.",
  "The sun makes up 99.8% of the mass in our solar system. Everything else is background noise.",
  "Glass is technically a slow-moving liquid; ancient windows prove it.",
  "A day on Venus lasts longer than its year. Time moves differently everywhere.",
  "Your heartbeat syncs with the rhythm of the music you love.",
  "There are more trees on Earth than stars in our galaxy.",
  "Butterflies see colors we can't imagine. The world hides extra versions of itself.",
  "The universe is still expanding, but no one knows into what.",
  "Some frogs freeze solid and wake up months later, unchanged.",
  "Crows remember faces for years and share enemies with their friends.",
  "Mount Everest grows taller every year, even while glaciers melt around it.",
  "Polar bear fur isn't white; it's hollow. Light just does the work.",
  "Your stomach gets a new lining every few days to avoid eating itself alive.",
  "A human body glows faintly in the dark, but the light is too dim to see.",
  "Rainbows can form at night, under moonlight. They're called moonbows.",
  "Every piece of gold on Earth was forged in a dying star.",
  "Wombats shape their droppings into cubes so they don't roll away.",
  "Penguins use the same pebble their whole lives to propose.",
  "The air you breathe right now likely passed through a dinosaur's lungs once.",
  "Jellyfish have no brains but can still navigate the oceans.",
  "Cats can't taste sweetness, but they crave curiosity instead.",
  "Your bones are stronger than steel of the same weight.",
  "Oysters can change gender depending on the season.",
  "There are more bacterial cells in your body than human ones.",
  "Whales whisper when predators might be listening.",
  "Some metals burst into flames when touched by water. Reactions aren't always gentle.",
  "Owls can rotate their heads 270 degrees without tearing a vessel.",
  "Carrots were once purple until we bred them orange for vanity.",
  "Trees can communicate underground through fungal networks.",
  "Your tongue print is as unique as your fingerprint.",
  "Antarctica is the largest desert on Earth. Cold doesn't cancel dry.",
  "In space, no one can cry properly—tears just stick to your face.",
  "Orcas teach hunting tactics to their young like family recipes.",
  "You can't tickle yourself because your brain predicts the move.",
  "There's a lake in Antarctica that hasn't seen sunlight for millions of years.",
  "A cloud can weigh over a million pounds and still hang in silence.",
  "Sloths move so slowly algae grows on them. They don't mind.",
  "The human nose can distinguish over a trillion scents.",
  "Some plants can count. Venus flytraps only close after two touches.",
  "Every coral reef has its own distinct accent of sound.",
  "The oldest living tree is older than the English language.",
  "Space smells faintly of burnt metal and seared steak.",
  "Some turtles breathe through their skin when underwater.",
  "A blue whale's heartbeat can be heard two miles away.",
  "Lightning heats air to five times hotter than the surface of the sun.",
  "The Eiffel Tower grows about six inches taller in summer heat.",
  "You share about 85% of your DNA with a mouse. Biology's lazy with templates.",
  "Elephants think humans are cute. They watch us the way we watch puppies.",
  "Bamboo can grow nearly a meter in a single day.",
  "Your skin renews itself every month without asking permission.",
  "Birds see magnetic fields. Migration is part science, part instinct.",
  "Sharks can sense a single drop of blood in millions of gallons of water.",
  "The deepest part of the ocean is darker than space.",
  "Some spiders use silk to float for miles through the air. They call it ballooning.",
  "The human brain generates enough electricity to power a light bulb.",
  "Pluto hasn't completed one orbit around the sun since its discovery.",
  "Your body temperature slightly drops before sleep—it's nature dimming the lights.",
  "Honey never spoils. Time can't touch it.",
  "Octopus ink doesn't just hide them—it dulls a predator's senses.",
  "Ravens play tricks on each other for no reason except joy.",
  "Pineapples take two years to grow, but ten seconds to disappear at a party.",
  "Bees can recognize human faces. They remember who's gentle.",
  "Some starfish can regenerate an entire body from one arm.",
  "Your veins hold about 60,000 miles of blood pathways. Enough to circle Earth twice.",
  "Salt used to be worth more than gold.",
  "Some lizards squirt blood from their eyes to scare off attackers.",
  "Tardigrades can survive in space, boiling water, and freezing vacuum.",
  "Every second, somewhere, lightning strikes about a hundred times.",
  "The oldest known animal lived for 507 years before being discovered and killed by science.",
  "The universe has more stars than there are grains of sand on every beach combined.",
  "Bats turn left almost every time they exit a cave. No one knows why.",
  "The average cumulus cloud weighs as much as 100 elephants.",
  "Snakes can predict earthquakes days before they happen.",
  "Your eyes see things upside down; your brain quietly flips them.",
  "Giraffes have the same number of neck bones as humans—just longer.",
  "Fire can exist without gravity. It burns in a perfect sphere.",
  "Some mushrooms glow in the dark. Forests have nightlights.",
  "You're taller in the morning than at night. Gravity keeps receipts.",
  "Every breath you take contains molecules from everyone who's ever lived.",
  "Water can boil and freeze at the same time, if the pressure is right.",
  "There's enough iron in your body to forge a small nail.",
  "A shrimp's heart sits in its head, right behind its smile.",
  "Every continent except Antarctica has at least one volcano still awake.",
  "Hummingbirds remember every flower they visit, even years later.",
  "Time passes faster at your head than at your feet.",
  "A single teaspoon of soil holds more organisms than people on Earth.",
  "Sea otters hold hands so they don't drift apart while sleeping.",
  "The northern lights are particles from the sun colliding with Earth's sky.",
  "Jupiter's magnetic field is 20,000 times stronger than Earth's.",
  "Every human started as a single cell smaller than a grain of salt."
];

(function () {
  if (!themeSelect) return;

  const presets = [
    { name: 'Default', value: 'default' },
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
    document.body.classList.add(name);
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
  
    const query = searchInput.value.trim();
    if (query) {
      const searchElement = google.search.cse.element.getElement("searchbox1");
      if (searchElement) {
        searchElement.execute(query);
        window.scrollTo({ 
          top: gcseResults.offsetTop, 
          behavior: "smooth" 
        });
      }
    }
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
    searchBtn.addEventListener("click", function() {
      const query = searchInput.value.trim();
      if (!query) return;
      const searchElement = google.search.cse.element.getElement("searchbox1");
      if (searchElement) {
        searchElement.execute(query);
        window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
      } else {
        console.error("Search element not found.");
      }
    });

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
    if (/^[0-9+\-*/^().\s×÷eE,]+$|^[a-zA-Z0-9+\-*/^().\s×÷eE,]+$/.test(query)) {
      return "Result: " + eval(query);
    }
  } catch(e) { }

  const units = {
    length: { m:1, km:1000, cm:0.01, mm:0.001, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.34 },
    weight: { kg:1, g:0.001, mg:0.000001, lb:0.453592, oz:0.0283495, ton:1000 },
    volume: { l:1, ml:0.001, m3:1000, gal:3.78541, qt:0.946353, pint:0.473176 },
    speed: { "m/s":1, "km/h":0.277778, "mph":0.44704, "ft/s":0.3048 },
    time: { s:1, min:60, h:3600, day:86400 },
    area: { m2:1, km2:1e6, cm2:0.0001, mm2:1e-6, acre:4046.86, ha:10000 },
    currency: { USD:1, EUR:0.92, GBP:0.80, JPY:145.0 }
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

searchBtn.addEventListener("click", function() {
  const query = searchInput.value.trim();
  if(!query) return;

  handleDictionarySearch(query).then(def => {
    if (def) {
      alert(def);
      return;
    }
  });

  const result = handleMathConversion(query);
  if(result) {
    alert(result);
  } else {
    if (/^[\w.-]+\.[a-z]{2,}$/i.test(query)) {
      let url = query;
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      window.location.href = url;
      return;
    }
    const searchElement = google.search.cse.element.getElement("searchbox1");
    if(searchElement) {
      searchElement.execute(query);
      window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
    }
  }
});

let allSuggestions = [];

fetch('/essentials/suggestions.json')
  .then(res => res.json())
  .then(data => { allSuggestions = data; })
  .catch(err => console.error('Error loading suggestions:', err));

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  suggestionsBox.innerHTML = '';

  if (!query) {
    suggestionsBox.style.display = 'none';
    return;
  }

  const matches = allSuggestions.filter(item =>
    item.toLowerCase().includes(query)
  ).slice(0, 10);

  matches.forEach(match => {
    const li = document.createElement('li');
    li.textContent = match;
    li.addEventListener('click', () => {
      searchInput.value = match;
      suggestionsBox.style.display = 'none';
      doSearch(match);
    });
    suggestionsBox.appendChild(li);
  });

  suggestionsBox.style.display = matches.length ? 'block' : 'none';
});

document.addEventListener('click', e => {
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.style.display = 'none';
  }
});

function applyDarkFromStorage() {
  const d = localStorage.getItem('darkMode');
  if (d === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.textContent = '☀️ Light Mode';
    darkToggle.setAttribute('aria-pressed','true');
  } else {
    document.body.classList.remove('dark-mode');
    darkToggle.textContent = '🌙 Dark Mode';
    darkToggle.setAttribute('aria-pressed','false');
  }
}

darkToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  darkToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  darkToggle.setAttribute('aria-pressed', String(isDark));
});

applyDarkFromStorage();

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

function doSearch(query) {
  if (!query.trim()) return;

  history = history.filter(h => h !== query);
  history.unshift(query);
  saveLifetime(query);

  if (history.length > 10) history.pop();

  saveHistory();
  renderHistory();

  const searchElement = google.search.cse.element.getElement("searchbox1");
  if (searchElement) {
    searchElement.execute(query);
    window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
  }
}

searchBtn.addEventListener("click", () => {
  doSearch(searchInput.value);
  searchInput.value = "";
});

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

document.documentElement.classList.remove('no-js');
