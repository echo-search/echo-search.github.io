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
let featurePanel = document.getElementById('featureResult');
function ensurePanel(){
  if(!featurePanel){
    featurePanel = document.createElement('div');
    featurePanel.id = 'featureResult';
    featurePanel.className = 'feature-result hidden';
    document.body.appendChild(featurePanel);
  }
}
ensurePanel();
function showFeatureResult({type='generic',title='',html='',data=null}){
  ensurePanel();
  featurePanel.innerHTML = '<div class="feature-backdrop"></div><div class="feature-card" role="dialog" aria-modal="true"><div class="feature-header"><h3>'+escapeHtml(title||'Result')+'</h3><button id="featureClose" aria-label="Close result">✕</button></div><div class="feature-content">'+(html||'')+'</div></div>';
  featurePanel.classList.remove('hidden');
  featurePanel.setAttribute('aria-hidden','false');
  const closeBtn = document.getElementById('featureClose');
  const backdrop = featurePanel.querySelector('.feature-backdrop');
  const hidePanel = ()=>{ featurePanel.classList.add('hidden'); featurePanel.setAttribute('aria-hidden','true'); };
  if(closeBtn) closeBtn.addEventListener('click', hidePanel);
  if(backdrop) backdrop.addEventListener('click', hidePanel);
  const calcForm = featurePanel.querySelector('.mini-calc-form');
  if(calcForm){
    const display = featurePanel.querySelector('.calc-display');
    const eqBtn = featurePanel.querySelector('.calc-eq');
    const clearBtnCalc = featurePanel.querySelector('.calc-clear');
    if(eqBtn && display){
      eqBtn.addEventListener('click', ()=>{
        const expr = display.value.trim();
        const res = safeEvaluateExpression(expr);
        const out = (res === null) ? 'Invalid expression' : res;
        const outEl = featurePanel.querySelector('.calc-result');
        if(outEl) outEl.textContent = String(out);
      });
    }
    if(clearBtnCalc && display){
      clearBtnCalc.addEventListener('click', ()=>{
        display.value = '';
        const outEl = featurePanel.querySelector('.calc-result');
        if(outEl) outEl.textContent = '';
      });
    }
    featurePanel.addEventListener('click', (ev)=>{
      const btn = ev.target.closest && ev.target.closest('.calc-btn');
      if(btn){
        const v = btn.getAttribute('data-val') || '';
        const disp = featurePanel.querySelector('.calc-display');
        if(disp){
          const start = disp.selectionStart ?? disp.value.length;
          const end = disp.selectionEnd ?? start;
          disp.value = disp.value.slice(0,start) + v + disp.value.slice(end);
          disp.focus();
          const pos = start + v.length;
          disp.selectionStart = disp.selectionEnd = pos;
        }
      }
    });
  }
}
function escapeHtml(s){
  if(s==null) return '';
  return String(s).replace(/[&<>"']/g,function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
}
function safeEvaluateExpression(expr){
  if(!expr || typeof expr !== 'string') return null;
  let normalized = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/\^/g,'**').replace(/,/g,'');
  if(!/^[0-9+\-*/%().\s*eE]+$/.test(normalized)) return null;
  try{
    const fn = new Function('return ('+normalized+');');
    const result = fn();
    if(typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) return result;
    return null;
  }catch(e){
    return null;
  }
}
function saveLifetime(query){
  try{
    const entry = {query,time:Date.now()};
    const life = JSON.parse(localStorage.getItem("lifetimeHistory") || "[]");
    life.unshift(entry);
    localStorage.setItem("lifetimeHistory", JSON.stringify(life.slice(0,200)));
  }catch(e){}
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
if(slider){
  slider.addEventListener("click", ()=>{
    slider.classList.toggle("active");
    openNewTab = slider.classList.contains("active");
  });
}
function openResult(url){
  if(!url) return;
  try{
    if(openNewTab){
      window.open(url,"_blank");
    }else{
      window.location.href = url;
    }
  }catch(e){}
}
function domainSearchHandler(query){
  if(!query) return null;
  query = query.trim();
  const match = query.match(/^site:(.+)$/i);
  if(!match) return null;
  const domain = match[1].trim();
  if(!domain) return null;
  return 'https://www.google.com/search?q=site:'+encodeURIComponent(domain);
}
if(themeSelect){
  const presets = [{name:'Default',value:'default'},{name:'Dark',value:'dark'},{name:'Retro',value:'retro'},{name:'Neon',value:'neon'},{name:'Ocean',value:'ocean'},{name:'Midnight',value:'midnight'},{name:'Sunset',value:'sunset'},{name:'Matrix',value:'matrix'},{name:'Cyberpunk',value:'cyberpunk'},{name:'Forest',value:'forest'},{name:'Floral',value:'floral'}];
  function loadCustomThemes(){
    try{ const raw = localStorage.getItem('customThemes'); return raw ? JSON.parse(raw) : []; }catch(e){ return []; }
  }
  function saveCustomThemes(themes){ try{ localStorage.setItem('customThemes', JSON.stringify(themes || [])); }catch(e){} }
  function populateThemeSelect(){
    themeSelect.innerHTML = '';
    presets.forEach(p=>{ const opt = document.createElement('option'); opt.value = 'preset:'+p.value; opt.textContent = p.name; themeSelect.appendChild(opt); });
    const sep = document.createElement('option'); sep.disabled = true; sep.textContent = '──────────────── Custom Themes ────────────────'; themeSelect.appendChild(sep);
    const customs = loadCustomThemes();
    if(customs.length === 0){ const noCustom = document.createElement('option'); noCustom.disabled = true; noCustom.textContent = 'No custom themes'; themeSelect.appendChild(noCustom); } else { customs.forEach((t,i)=>{ const opt = document.createElement('option'); opt.value = 'custom:'+i; opt.textContent = t.name || ('Custom '+(i+1)); themeSelect.appendChild(opt); }); }
  }
  function clearPresetClasses(){ const presetValues = presets.map(p=>p.value); presetValues.forEach(cls=>document.body.classList.remove(cls)); document.body.classList.remove('dark-mode'); }
  function applyPreset(name){ clearPresetClasses(); if(name === 'dark'){ document.body.classList.add('dark-mode'); } else { document.body.classList.add(name); } document.documentElement.style.removeProperty('--bg'); document.documentElement.style.removeProperty('--accent'); document.documentElement.style.removeProperty('--hover'); document.documentElement.style.removeProperty('--text'); document.body.style.backgroundImage = ''; }
  function applyCustom(themeObj){ clearPresetClasses(); if(!themeObj || typeof themeObj !== 'object') return; if(themeObj.bgColor) document.documentElement.style.setProperty('--bg', themeObj.bgColor); else document.documentElement.style.removeProperty('--bg'); if(themeObj.textColor) document.documentElement.style.setProperty('--text', themeObj.textColor); else document.documentElement.style.removeProperty('--text'); if(themeObj.accent) document.documentElement.style.setProperty('--accent', themeObj.accent); else document.documentElement.style.removeProperty('--accent'); if(themeObj.hover) document.documentElement.style.setProperty('--hover', themeObj.hover); else document.documentElement.style.removeProperty('--hover'); if(themeObj.bgImage){ document.body.style.backgroundImage = 'url("'+themeObj.bgImage+'")'; document.body.style.backgroundSize = 'cover'; } else { if(!/^linear-gradient|radial-gradient/i.test(themeObj.bgColor||'')) document.body.style.backgroundImage = ''; } }
  function persistSelectedTheme(descriptor){ try{ localStorage.setItem('selectedTheme', JSON.stringify(descriptor)); }catch(e){} }
  function restoreSelectedTheme(){ try{ const raw = localStorage.getItem('selectedTheme'); if(!raw) return; const desc = JSON.parse(raw); if(desc.type === 'preset' && desc.name){ const v = 'preset:'+desc.name; const opt = Array.from(themeSelect.options).find(o=>o.value===v); if(opt) themeSelect.value = v; applyPreset(desc.name); } else if(desc.type === 'custom' && typeof desc.index === 'number'){ const customs = loadCustomThemes(); const themeObj = customs[desc.index]; if(themeObj){ const v = 'custom:'+desc.index; const opt = Array.from(themeSelect.options).find(o=>o.value===v); if(opt) themeSelect.value = v; applyCustom(themeObj); } } }catch(e){} }
  themeSelect.addEventListener('change', (e)=>{
    const v = e.target.value; if(!v) return; if(v.startsWith('preset:')){ const name = v.split(':')[1]; applyPreset(name); persistSelectedTheme({type:'preset',name}); } else if(v.startsWith('custom:')){ const index = parseInt(v.split(':')[1],10); const customs = loadCustomThemes(); const themeObj = customs[index]; if(themeObj){ applyCustom(themeObj); persistSelectedTheme({type:'custom',index}); } }
  });
  populateThemeSelect();
  restoreSelectedTheme();
  try{
    const activeRaw = localStorage.getItem('activeTheme');
    if(activeRaw){
      const theme = JSON.parse(activeRaw);
      if(theme && theme.__fromThemesPage === true){
        const customs = loadCustomThemes();
        const idx = customs.findIndex(ct=>JSON.stringify(ct)===JSON.stringify(theme.data));
        let finalIndex = idx;
        if(idx === -1){ customs.push(theme.data); saveCustomThemes(customs); finalIndex = customs.length - 1; }
        populateThemeSelect();
        const selectValue = 'custom:'+finalIndex;
        const option = Array.from(themeSelect.options).find(o=>o.value===selectValue);
        if(option) themeSelect.value = selectValue;
        applyCustom(theme.data);
        persistSelectedTheme({type:'custom',index:finalIndex});
      } else if(theme && theme.__applyPreset && theme.name){
        populateThemeSelect();
        const selectValue = 'preset:'+theme.name;
        const option = Array.from(themeSelect.options).find(o=>o.value===selectValue);
        if(option) themeSelect.value = selectValue;
        applyPreset(theme.name);
        persistSelectedTheme({type:'preset',name:theme.name});
      }
      localStorage.removeItem('activeTheme');
    }
  }catch(e){}
}
if(surpriseBtn){
  surpriseBtn.addEventListener("click", ()=>{
    const fact = facts[Math.floor(Math.random()*facts.length)];
    alert(fact);
  });
}
let recognition;
if(typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  try{
    recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = ()=>{ if(voiceBtn) voiceBtn.classList.add("listening"); };
    recognition.onend = ()=>{ if(voiceBtn) voiceBtn.classList.remove("listening"); };
    recognition.onresult = (event)=>{ try{ const transcript = event.results && event.results[0] && event.results[0][0] && event.results[0][0].transcript; if(transcript && searchInput){ searchInput.value = transcript; doSearch(transcript); } }catch(e){} };
    if(voiceBtn) voiceBtn.addEventListener("click", ()=>{ try{ recognition.start(); }catch(e){} });
  }catch(e){ recognition = null; }
}else{
  if(voiceBtn){ voiceBtn.disabled = true; voiceBtn.title = "Voice input not supported in this browser."; }
}
window.__gcse = { callback: function(){
  try{
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');
    if(queryFromUrl){
      if(window.google && google.search && google.search.cse && google.search.cse.element){
        const searchElement = google.search.cse.element.getElement("searchbox1");
        if(searchElement){
          searchElement.execute(queryFromUrl);
          if(gcseResults) window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
        }
      }
    }
    if(searchInput){
      searchInput.addEventListener("keydown", function(e){ if(e.key === "Enter"){ if(searchBtn) searchBtn.click(); } });
    }
  }catch(e){}
} };

/* ===========================
   New TIME HANDLER (replaces previous time snippet)
   - Uses Nominatim to geocode user-provided place text
   - Uses timeapi.io to fetch local time for coordinates
   - Does NOT use alert(); shows result in the feature popup via showFeatureResult()
   =========================== */

async function geocodeLocation(place) {
  if (!place) return null;

  try {
    const res = await fetch(
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(place)
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      lat: Number(data[0].lat),
      lon: Number(data[0].lon),
      name: data[0].display_name
    };
  } catch {
    return null;
  }
}

/* ===========================
   EXTRACT LOCATION
   Handles:
   time in london
   time at tokyo
   time for california
   =========================== */

function extractLocation(query) {
  const match = query.match(/\btime\s+(?:in|at|for)\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/* ===========================
   TIME HANDLER
   - Returns true if the query was a time query and was handled (popup shown)
   - Returns false if the query does not match a time query (so caller can continue)
   =========================== */

async function handleTime(query) {
  const locationText = extractLocation(query);
  if (!locationText) return false;

  const geo = await geocodeLocation(locationText);
  if (!geo) {
    showFeatureResult({ title: 'Time — Not found', html: '<p>Location not found.</p>' });
    return true;
  }

  // Get timezone + local time from coordinates
  try {
    const res = await fetch(
      `https://timeapi.io/api/Time/current/coordinate?latitude=${geo.lat}&longitude=${geo.lon}`
    );

    if (!res.ok) {
      showFeatureResult({ title: 'Time — Error', html: '<p>Could not fetch time.</p>' });
      return true;
    }

    const data = await res.json();

    const hour = String(data.hour ?? data.hours ?? new Date().getHours()).padStart(2, '0');
    const minute = String(data.minute ?? data.minutes ?? new Date().getMinutes()).padStart(2, '0');

    const tz = data.timeZone ?? data.timezone ?? '';
    const dateStr = (data.year && data.month && data.day) ? `${data.year}-${String(data.month).padStart(2,'0')}-${String(data.day).padStart(2,'0')}` : '';

    const htmlParts = [];
    htmlParts.push('<div class="time-block">');
    htmlParts.push('<div class="time-place">' + escapeHtml(geo.name) + '</div>');
    htmlParts.push('<div class="time-now"><strong>' + escapeHtml(hour + ':' + minute) + '</strong>' + (tz ? ' <span class="tz">(' + escapeHtml(tz) + ')</span>' : '') + '</div>');
    if (dateStr) htmlParts.push('<div class="time-date">' + escapeHtml(dateStr) + '</div>');
    htmlParts.push('</div>');

    showFeatureResult({ title: 'Time — ' + escapeHtml(geo.name), html: htmlParts.join('') });
    return true;
  } catch (e) {
    showFeatureResult({ title: 'Time — Error', html: '<p>Could not fetch time.</p>' });
    return true;
  }
}

const langMap = {af:'af',afrikaans:'af',sq:'sq',albanian:'sq',am:'am',amharic:'am',ar:'ar',arabic:'ar',hy:'hy',armenian:'hy',az:'az',azerbaijani:'az',eu:'eu',basque:'eu',be:'be',belarusian:'be',bn:'bn',bengali:'bn',bs:'bs',bosnian:'bs',bg:'bg',bulgarian:'bg',ca:'ca',catalan:'ca',ceb:'ceb',cebuano:'ceb',zh:'zh',chinese:'zh','chinese simplified':'zh','chinese (simplified)':'zh','simplified chinese':'zh','traditional chinese':'zh','chinese traditional':'zh','chinese (traditional)':'zh','zh-cn':'zh','zh-tw':'zh',co:'co',corsican:'co',hr:'hr',croatian:'hr',cs:'cs',czech:'cs',da:'da',danish:'da',nl:'nl',dutch:'nl',en:'en',english:'en','british english':'en','uk english':'en',eo:'eo',esperanto:'eo',et:'et',estonian:'et',fi:'fi',finnish:'fi',fr:'fr',french:'fr',fy:'fy',frisian:'fy',gl:'gl',galician:'gl',ka:'ka',georgian:'ka',de:'de',german:'de',el:'el',greek:'el',gu:'gu',gujarati:'gu',ht:'ht',haitian:'ht',ha:'ha',hausa:'ha',haw:'haw',hawaiian:'haw',he:'he',hebrew:'he',hi:'hi',hindi:'hi',hmn:'hmn',hmong:'hmng',hu:'hu',hungarian:'hu',is:'is',icelandic:'is',ig:'ig',igbo:'ig',id:'id',indonesian:'id',ga:'ga',irish:'ga',it:'it',italian:'it',ja:'ja',japanese:'ja',jw:'jw',javanese:'jw',kn:'kn',kannada:'kn',kk:'kk',kazakh:'kk',km:'km',khmer:'km',ko:'ko',korean:'ko',ku:'ku',kurdish:'ku',ky:'ky',kyrgyz:'ky',lo:'lo',lao:'lo',la:'la',latin:'la',lv:'lv',latvian:'lv',lt:'lt',lithuanian:'lt',lb:'lb',luxembourgish:'lb',mk:'mk',macedonian:'mk',mg:'mg',malagasy:'mg',ms:'ms',malay:'ms',ml:'ml',malayalam:'ml',mt:'mt',maltese:'mt',mi:'mi',maori:'mi',mr:'mr',marathi:'mr',mn:'mn',mongolian:'mn',my:'my',burmese:'my',ne:'ne',nepali:'ne',no:'no',norwegian:'no',ny:'ny',chichewa:'ny',ps:'ps',pashto:'ps',fa:'fa',persian:'fa',pl:'pl',polish:'pl',pt:'pt',portuguese:'pt',pa:'pa',punjabi:'pa',ro:'ro',romanian:'ro',ru:'ru',russian:'ru',sm:'sm',samoan:'sm',gd:'gd','scots gaelic':'gd',sr:'sr',serbian:'sr',st:'st',sesotho:'st',sn:'sn',shona:'sn',sd:'sd',sindhi:'sd',si:'si',sinhala:'si',sk:'sk',slovak:'sk',sl:'sl',slovenian:'sl',so:'so',somali:'so',es:'es',spanish:'es',su:'su',sundanese:'su',sw:'sw',swahili:'sw',sv:'sv',swedish:'sv',tg:'tg',tajik:'tg',ta:'ta',tamil:'ta',te:'te',telugu:'te',th:'th',thai:'th',tr:'tr',turkish:'tr',tk:'tk',turkmen:'tk',uk:'uk',ukrainian:'uk',ur:'ur',urdu:'ur',uz:'uz',uzbek:'uz',vi:'vi',vietnamese:'vi',cy:'cy',welsh:'cy',xh:'xh',xhosa:'xh',yi:'yi',yiddish:'yi',yo:'yo',yoruba:'yo',zu:'zu',zulu:'zu'};
async function handleSearch(input){
  if(!input || typeof input !== 'string') return null;
  const match = input.match(/^(.+?)\s+in\s+([a-zA-Z\s]+)$/i);
  if(!match) return null;
  const word = match[1].trim();
  let language = match[2].toLowerCase().replace(/\s+/g,' ').trim();
  if(!langMap[language]) return null;
  const tl = langMap[language];
  try{
    const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl='+tl+'&dt=t&q='+encodeURIComponent(word));
    if(!res.ok) return {type:'translation',error:'Translation failed.'};
    const data = await res.json();
    const translated = data?.[0]?.[0]?.[0] || null;
    if(!translated) return {type:'translation',error:'No translation returned.'};
    return {type:'translation',from:word,to:translated,targetLang:tl};
  }catch(e){
    return {type:'translation',error:'Translation failed.'};
  }
}
async function handleDictionarySearch(query){
  if(!query) return null;
  const lower = String(query).toLowerCase().trim();
  const triggers = ["meaning of","definition of","define","dictionary","meaning"];
  const isDictionaryQuery = triggers.some(word=>lower.includes(word));
  if(!isDictionaryQuery) return null;
  const word = lower.replace(/(meaning of|definition of|define|dictionary|meaning)/g,"").trim();
  if(!word) return {type:'dictionary',error:'Please enter a word to define.'};
  const wordUpper = word.toUpperCase();
  try{
    const localRes = await fetch("/essentials/dictionary.json");
    if(localRes.ok){
      const localData = await localRes.json();
      if(localData && localData[wordUpper]){
        const entry = localData[wordUpper];
        const meaning = entry.meaning || "No meaning found.";
        const example = entry.example || "No example available.";
        return {type:'dictionary',word,meaning,example,source:'local'};
      }
    }
  }catch(e){}
  try{
    const apiRes = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(word));
    if(apiRes.ok){
      const data = await apiRes.json();
      if(Array.isArray(data) && data[0]?.meanings?.[0]?.definitions?.[0]){
        const meaning = data[0].meanings[0].definitions[0].definition;
        const example = data[0].meanings[0].definitions[0].example || "No example available.";
        let audioUrl = null;
        if(Array.isArray(data[0].phonetics)){
          const phon = data[0].phonetics.find(p=>p.audio && p.audio.trim());
          if(phon && phon.audio){
            audioUrl = phon.audio.trim();
            if(audioUrl.startsWith('//')) audioUrl = 'https:'+audioUrl;
          }
        }
        return {type:'dictionary',word,meaning,example,source:'api',audio:audioUrl || null};
      }
    }
  }catch(e){}
  return {type:'dictionary',error:'No definition found.'};
}
async function handleWhoIs(input){
  if(!input) return null;
  const match = input.match(/^who\s+is\s+(.+)$/i);
  if(!match) return null;
  const person = match[1].trim();
  if(!person) return null;
  try{
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(person));
    if(!res.ok) return null;
    const data = await res.json();
    if(!data || !data.extract) return null;
    return {type:'whois',title:data.title,extract:data.extract,url:data.content_urls?.desktop?.page || null};
  }catch(e){
    return null;
  }
}
function capitalize(str){ if(!str) return ''; return str.split(" ").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" "); }
async function handleWikipediaSearch(query){
  if(!query || typeof query !== 'string') return null;
  const tCheck = query.trim().toLowerCase();
  if(/^(today's date|todays date|date today)$/.test(tCheck)) return null;
  if(/^time in\s+/.test(tCheck)) return null;
  const tMatch = query.match(/^(.+?)\s+in\s+([a-zA-Z\s]+)$/i);
  if(tMatch){
    const lang = tMatch[2].toLowerCase().trim().replace(/\s+/g,' ');
    if(langMap[lang]) return null;
  }
  const stopWords = ["who","whom","whose","what","which","when","where","why","how","is","are","was","were","be","been","being","do","does","did","doing","can","could","should","would","may","might","will","shall","the","a","an","of","for","to","in","on","at","by","with","about","as","from","into","like"];
  const cleanedQuery = query.toLowerCase().split(/\s+/).filter(word=>word && !stopWords.includes(word)).join(" ");
  if(!cleanedQuery) return null;
  try{
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(cleanedQuery));
    if(!res.ok) return null;
    const data = await res.json();
    if(data && data.extract) return {type:'wikipedia',title:data.title || cleanedQuery,extract:data.extract,url:data.content_urls?.desktop?.page || null};
    return null;
  }catch(e){
    return null;
  }
}
let currentScript = null;
let currentFocus = -1;
let isNavigating = false;
window.handleGoogleSuggestions = function(data){
  try{
    const matches = Array.isArray(data) ? (data[1] || []) : [];
    if(!suggestionsBox) return;
    suggestionsBox.innerHTML = '';
    if(!matches || matches.length === 0){ suggestionsBox.style.display = 'none'; return; }
    matches.forEach((match,index)=>{
      const text = (typeof match === 'string') ? match : (Array.isArray(match) ? match[0] : String(match));
      const li = document.createElement('li');
      li.textContent = text;
      li.setAttribute('data-index', index);
      li.addEventListener('click', ()=>{
        if(searchInput) searchInput.value = text;
        suggestionsBox.style.display = 'none';
        currentFocus = -1;
        doSearch(text);
      });
      suggestionsBox.appendChild(li);
    });
    suggestionsBox.style.display = 'block';
    currentFocus = -1;
  }catch(e){}
};
function fetchSuggestions(query){
  if(!query) return;
  if(currentScript){ currentScript.remove(); currentScript = null; }
  const script = document.createElement('script');
  currentScript = script;
  script.src = 'https://suggestqueries.google.com/complete/search?client=firefox&q='+encodeURIComponent(query)+'&callback=handleGoogleSuggestions';
  script.onload = ()=>{ setTimeout(()=>{ if(script.parentNode) script.remove(); },1000); };
  script.onerror = ()=>{ if(script.parentNode) script.remove(); if(suggestionsBox) suggestionsBox.style.display = 'none'; };
  document.body.appendChild(script);
}
if(searchInput){
  searchInput.addEventListener('input', (e)=>{
    if(isNavigating){ isNavigating = false; return; }
    const query = searchInput.value.trim();
    try{
      const compact = searchInput.value.replace(/\s+/g,'');
      if(compact === '67'){ if(!window.__last67Played || (Date.now() - window.__last67Played > 3000)){ play67Effect(); window.__last67Played = Date.now(); } }
    }catch(e){}
    if(!query){
      if(suggestionsBox){ suggestionsBox.innerHTML = ''; suggestionsBox.style.display = 'none'; }
      currentFocus = -1;
      return;
    }
    fetchSuggestions(query);
  });
  searchInput.addEventListener('keydown', function(e){
    const items = suggestionsBox ? suggestionsBox.getElementsByTagName('li') : [];
    if(!items || items.length === 0){
      if(e.key === 'Enter') return;
      else return;
    }
    if(e.key === "ArrowDown"){ isNavigating = true; currentFocus++; updateActive(items); e.preventDefault(); }
    else if(e.key === "ArrowUp"){ isNavigating = true; currentFocus--; updateActive(items); e.preventDefault(); }
    else if(e.key === "Enter"){ if(currentFocus > -1){ e.preventDefault(); if(items[currentFocus]) items[currentFocus].click(); } }
  });
}
function updateActive(items){
  if(!items) return false;
  for(let i=0;i<items.length;i++) items[i].classList.remove("active");
  if(currentFocus >= items.length) currentFocus = 0;
  if(currentFocus < 0) currentFocus = items.length - 1;
  items[currentFocus].classList.add("active");
  if(searchInput) searchInput.value = items[currentFocus].textContent;
}
document.addEventListener('click', e=>{
  try{
    if(searchInput && e.target !== searchInput && suggestionsBox && !suggestionsBox.contains(e.target)){ if(suggestionsBox) suggestionsBox.style.display = 'none'; currentFocus = -1; }
  }catch(err){}
});
function play67Effect(){
  if(!audio67 || !container) return;
  try{ audio67.currentTime = 0; audio67.play().catch(()=>{}); }catch(e){}
  for(let i=0;i<80;i++){
    setTimeout(()=>{
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
  setTimeout(()=>{ if(container) container.innerHTML = ""; },3500);
}
let searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
function doSearch(query){
  if(!query || !query.trim()) return;
  const compact = query.replace(/\s+/g,'');
  if(compact === '67'){ if(!window.__last67Played || (Date.now() - window.__last67Played > 3000)){ play67Effect(); window.__last67Played = Date.now(); } return; }
  try{
    searchHistory = searchHistory.filter(h=>h !== query);
    searchHistory.unshift(query);
    saveLifetime(query);
    if(searchHistory.length > 10) searchHistory = searchHistory.slice(0,10);
    saveHistory();
    renderHistory();
  }catch(e){}
  const domainURL = domainSearchHandler(query);
  if(domainURL){ openResult(domainURL); return; }
  if(/^[\w.-]+\.[a-z]{2,}$/i.test(query)){
    let url = query;
    if(!/^https?:\/\//i.test(url)) url = "https://"+url;
    openResult(url);
    return;
  }
  const searchElement = (window.google && google.search && google.search.cse && google.search.cse.element) ? google.search.cse.element.getElement("searchbox1") : null;
  if(searchElement){
    try{ searchElement.execute(query); if(gcseResults) window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" }); }catch(e){ }
  }
}
if(searchBtn){
  searchBtn.addEventListener("click", async function(){
    const query = (searchInput && searchInput.value) ? searchInput.value.trim() : "";
    if(!query) return;
    try{
      const weatherResult = await handleWeather(query);
      if(weatherResult){
        if(weatherResult.error){ showFeatureResult({title:'Weather',html:'<p>'+escapeHtml(weatherResult.error)+'</p>'}); }
        else if(weatherResult.type === 'weather'){
          if(weatherResult.when === 'tomorrow'){
            const html = '<div class="weather-block"><div class="weather-place">'+escapeHtml(weatherResult.place)+'</div><div class="weather-icon">'+escapeHtml(weatherResult.icon)+'</div><div class="weather-temps">High: <strong>'+escapeHtml(String(weatherResult.high))+'°C</strong> — Low: <strong>'+escapeHtml(String(weatherResult.low))+'°C</strong></div></div>';
            showFeatureResult({title:'Weather — '+escapeHtml(weatherResult.place),html});
          }else{
            const hoursHtml = (weatherResult.nextHours || []).map(h=>'<div class="hour-item">'+escapeHtml(h.time)+' — '+escapeHtml(h.icon)+' '+escapeHtml(String(h.temp))+'°C</div>').join('');
            const html = '<div class="weather-block"><div class="weather-place">'+escapeHtml(weatherResult.place)+'</div><div class="weather-now">'+escapeHtml(weatherResult.current.icon)+' Now: <strong>'+escapeHtml(String(weatherResult.current.temp))+'°C</strong> — Wind: '+escapeHtml(String(weatherResult.current.wind ?? 'N/A'))+' km/h</div><div class="weather-next"><strong>Next hours</strong>'+hoursHtml+'</div></div>';
            showFeatureResult({title:'Weather — '+escapeHtml(weatherResult.place),html});
          }
          if(searchInput) searchInput.value = "";
          if(chatBtn) chatBtn.style.display = "block";
          return;
        }
      }
    }catch(e){}
    try{
      const whoIsResult = await handleWhoIs(query);
      if(whoIsResult){
        const html = '<div class="whois-block"><div class="whois-title"><strong>'+escapeHtml(whoIsResult.title)+'</strong></div><div class="whois-extract">'+escapeHtml(whoIsResult.extract)+'</div>'+(whoIsResult.url?('<div class="whois-link"><a href="'+escapeHtml(whoIsResult.url)+'" target="_blank" rel="noopener">Read more on Wikipedia</a></div>'):'')+'</div>';
        showFeatureResult({title:'Who is '+escapeHtml(whoIsResult.title),html});
        if(searchInput) searchInput.value = "";
        if(chatBtn) chatBtn.style.display = "block";
        return;
      }
    }catch(e){}
    try{
      // NEW: handle time queries asynchronously and show popup result
      const handledTime = await handleTime(query);
      if(handledTime){
        if(searchInput) searchInput.value = "";
        if(chatBtn) chatBtn.style.display = "block";
        return;
      }
    }catch(e){}
    try{
      const translation = await handleSearch(query);
      if(translation){
        if(translation.error){ showFeatureResult({title:'Translation',html:'<p>'+escapeHtml(translation.error)+'</p>'}); }
        else if(translation.type === 'translation'){
          const html = '<div class="translation-block"><div class="translation-example">'+escapeHtml(translation.from)+' <span class="arrow">→</span> <strong>'+escapeHtml(translation.to)+'</strong></div><div class="translation-meta">Target language: '+escapeHtml(translation.targetLang)+'</div></div>';
          showFeatureResult({title:'Translation',html});
          if(searchInput) searchInput.value = "";
          if(chatBtn) chatBtn.style.display = "block";
          return;
        }
      }
    }catch(e){}
    try{
      const def = await handleDictionarySearch(query);
      if(def){
        if(def.error){ showFeatureResult({title:'Definition',html:'<p>'+escapeHtml(def.error)+'</p>'}); }
        else{
          const listenButtonHtml = '<button id="dictListenBtn" class="dict-listen" aria-label="Play pronunciation">🔊</button>';
          const html = '<div class="dict-block"><div class="dict-word">'+listenButtonHtml+' <strong>'+escapeHtml(def.word)+'</strong></div><div class="dict-meaning">'+escapeHtml(def.meaning)+'</div><div class="dict-example">Example: '+escapeHtml(def.example)+'</div><div class="dict-source">Source: '+escapeHtml(def.source || 'unknown')+'</div></div>';
          showFeatureResult({title:'Definition — '+escapeHtml(def.word),html});
          try{
            const listenBtn = featurePanel.querySelector('#dictListenBtn');
            if(listenBtn){
              if(def.audio){
                listenBtn.addEventListener('click', ()=>{
                  try{
                    let audioEl = featurePanel.querySelector('#dictAudioElem');
                    if(!audioEl){
                      audioEl = document.createElement('audio');
                      audioEl.id = 'dictAudioElem';
                      audioEl.src = def.audio;
                      featurePanel.appendChild(audioEl);
                    }
                    audioEl.currentTime = 0;
                    audioEl.play().catch(()=>{});
                  }catch(e){}
                });
              }else{
                listenBtn.disabled = true;
                listenBtn.title = "No pronunciation audio available.";
                listenBtn.style.opacity = "0.5";
                listenBtn.style.cursor = "not-allowed";
              }
            }
          }catch(e){}
          if(searchInput) searchInput.value = "";
          if(chatBtn) chatBtn.style.display = "block";
          return;
        }
      }
    }catch(e){}
    try{
      const result = handleMathConversion(query);
      if(result){
        if(result.type === 'math'){
          const html = '<div class="math-block"><div class="math-expression">Expression: <code>'+escapeHtml(result.expression)+'</code></div><div class="math-answer">Answer: <strong>'+escapeHtml(String(result.result))+'</strong></div><div class="mini-calc"><div class="mini-calc-title">Calculator</div><form class="mini-calc-form" onsubmit="return false;"><input class="calc-display" aria-label="Calculator input" value="'+escapeHtml(result.expression)+'" /><div class="calc-controls"><div class="calc-keypad" role="group" aria-label="Calculator keypad"><button type="button" class="calc-btn" data-val="7">7</button><button type="button" class="calc-btn" data-val="8">8</button><button type="button" class="calc-btn" data-val="9">9</button><button type="button" class="calc-btn" data-val="/">÷</button><button type="button" class="calc-btn" data-val="4">4</button><button type="button" class="calc-btn" data-val="5">5</button><button type="button" class="calc-btn" data-val="6">6</button><button type="button" class="calc-btn" data-val=\"*\">×</button><button type="button" class="calc-btn" data-val=\"1\">1</button><button type="button" class="calc-btn" data-val="2">2</button><button type="button" class="calc-btn" data-val="3">3</button><button type="button" class="calc-btn" data-val=\"-\">−</button><button type="button" class="calc-btn" data-val=\"0\">0</button><button type="button" class="calc-btn" data-val=\".\">.</button><button type="button" class="calc-eq">=</button><button type="button" class="calc-btn" data-val=\"+\">+</button></div><div class="calc-actions"><button type="button" class="calc-clear">Clear</button><div class="calc-result" aria-live="polite"></div></div></div></form></div></div>';
          showFeatureResult({title:'Calculator',html});
          if(searchInput) searchInput.value = "";
          if(chatBtn) chatBtn.style.display = "block";
          return;
        }else if(result.type === 'conversion'){
          if(result.error){ showFeatureResult({title:'Conversion',html:'<p>'+escapeHtml(result.error)+'</p>'}); }
          else{ const html = '<div class="conv-block">'+escapeHtml(String(result.inputValue))+' '+escapeHtml(result.from)+' = <strong>'+escapeHtml(String(result.result))+' '+escapeHtml(result.to)+'</strong></div>'; showFeatureResult({title:'Conversion',html}); if(searchInput) searchInput.value = ""; if(chatBtn) chatBtn.style.display = "block"; return; }
        }
      }
    }catch(e){}
    try{
      const wikiResult = await handleWikipediaSearch(query);
      if(wikiResult){
        renderToScreen2('Wikipedia — '+escapeHtml(wikiResult.title), '<div class="wiki-block"><div class="wiki-title"><strong>'+escapeHtml(wikiResult.title)+'</strong></div><div class="wiki-extract">'+escapeHtml(wikiResult.extract)+'</div>'+ (wikiResult.url?('<div class="wiki-link"><a href="'+escapeHtml(wikiResult.url)+'" target="_blank" rel="noopener">Read more on Wikipedia</a></div>'):'') +'</div>');
        if(searchInput) searchInput.value = "";
        if(chatBtn) chatBtn.style.display = "block";
      }
    }catch(e){}
    doSearch(query);
    if(searchInput) searchInput.value = "";
    if(chatBtn) chatBtn.style.display = "block";
  });
}
function renderToScreen2(title, html){
  if(!gcseResults) return;
  let wikiPanel = gcseResults.querySelector('#wikiPanel');
  if(!wikiPanel){
    wikiPanel = document.createElement('div');
    wikiPanel.id = 'wikiPanel';
    wikiPanel.className = 'feature-card wiki-screen2';
    gcseResults.insertBefore(wikiPanel, gcseResults.firstChild);
  }
  wikiPanel.innerHTML = '<div class="feature-header"><h3>'+escapeHtml(title)+'</h3></div><div class="feature-content">'+html+'</div>';
  window.scrollTo({ top: gcseResults.offsetTop, behavior: "smooth" });
}
function renderHistory(){
  if(!historyList) return;
  historyList.innerHTML = "";
  if(!searchHistory || searchHistory.length === 0){
    if(historyTitle) historyTitle.style.display = "none";
    if(clearBtn) clearBtn.style.display = "none";
    return;
  }
  if(historyTitle) historyTitle.style.display = "block";
  if(clearBtn) clearBtn.style.display = "inline-block";
  searchHistory.forEach((item)=>{
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", ()=>doSearch(item));
    historyList.appendChild(li);
  });
}
function saveHistory(){
  try{ localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); }catch(e){}
}
if(clearBtn){
  clearBtn.addEventListener("click", ()=>{
    searchHistory = [];
    saveHistory();
    renderHistory();
  });
}
if(chatBtn){
  chatBtn.addEventListener("click", ()=>{ try{ window.open("https://chatgpt.com","_blank"); }catch(e){} });
}
window.addEventListener("load", ()=>{ if(chatBtn) chatBtn.style.display = "none"; });
renderHistory();
