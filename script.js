<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Baobab Search</title>
<style>
  :root { --bg:#F8F5F0; --text:#2D241F; --accent:#A0522D; --card:#FFFFFF; --border:#E0DAD1; }
  body { background:var(--bg); color:var(--text); font-family: system-ui, sans-serif; margin:0; padding:20px; }
 .hidden { display:none; }
 .search-bar { display:flex; gap:10px; max-width:700px; margin:20px auto; }
  #searchInput { flex:1; padding:12px; border:2px solid var(--border); border-radius:8px; }
  #searchBtn { padding:12px 20px; background:var(--accent); color:white; border:none; border-radius:8px; cursor:pointer; }
 .result-card { background:var(--card); border:1px solid var(--border); padding:15px; border-radius:8px; margin:10px auto; max-width:700px; }
 .result-card h3 a { color:var(--accent); text-decoration:none; }
  #aiBlock { background:var(--card); border-left:4px solid var(--accent); padding:15px; margin:20px auto; max-width:700px; border-radius:8px; }
  header { display:flex; justify-content:space-between; align-items:center; max-width:700px; margin:auto; }
</style>
</head>
<body>

<header>
  <div>
    <h1 id="logoTitle">Baobab Search</h1>
    <p id="tagline"></p>
  </div>
  <div>
    <select id="langSelect"><option value="fr">Français</option><option value="wo">Wolof</option></select>
    <select id="securitySelect"><option value="balanced">Équilibré</option><option value="strong">Strict</option></select>
    <button id="themeToggle">🌙</button>
  </div>
</header>

<div class="search-bar">
  <input type="text" id="searchInput" />
  <button id="searchBtn">Recher</button>
</div>

<div id="results"></div>

<div id="aiBlock" class="hidden">
  <h3 id="aiTitle"></h3>
  <p id="aiText"></p>
  <p><b id="aiSourcesLabel"></b> <span id="aiSources"></span></p>
  <button id="aiBtn"></button>
</div>

<p id="footerText" style="text-align:center; margin-top:40px;"></p>

<script>
// ========================================
// 1. COLLE TA CLÉ GOOGLE CLOUD ICI
const GEMINI_API_KEY = "TA_CLE_ICI";

let currentLang = 'fr';
let currentSecurity = 'balanced';
let currentTheme = 'light';

const $ = (id) => document.getElementById(id);

// TRADUCTIONS
const translations = {
  fr: { title: "Baobab Search", tagline: "La recherche africaine, intelligente et respectueuse.", placeholder: "Pose ta question à Baobab...", searching: "Recherche en cours...", aiTitle: "Baobab IA", aiThink: "Réflexion de Baobab IA...", aiBtn: "Demander à Baobab IA", aiSources: "Sources", footer: "Fait avec ❤️ pour l'Afrique. Powered by Google Gemini.", noResults: 'Aucun résultat trouvé pour' },
  wo: { title: "Baobab Seet", tagline: "Seetug Afrik bi, xel te jàmm.", placeholder: "Laj Baobab...", searching: "Dii seet...", aiTitle: "Baobab AI", aiThink: "Xalaat bi...", aiBtn: "Laj Baobab AI", aiSources: "Lëndëm yi", footer: "Def nañ ko ak bégg. Baobab, garab xam-xam.", noResults: 'Benna njit menul a fekk ci' }
};

// THÈMES
const themes = {
  light: { '--bg': '#F8F5F0', '--text': '#2D241F', '--accent': '#A0522D', '--card': '#FFFFFF', '--border': '#E0DAD1' },
  dark: { '--bg': '#1A1612', '--text': '#F8F5F0', '--accent': '#D4A373', '--card': '#2D241F', '--border': '#4A3F35' }
};

// AU DÉMARRAGE
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyTranslations();
  $('#searchBtn').addEventListener('click', performSearch);
  $('#searchInput').addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });
  $('#aiBtn').addEventListener('click', () => runBaobabAI($('#searchInput').value));
  $('#langSelect').addEventListener('change', (e) => { currentLang = e.target.value; applyTranslations(); });
  $('#securitySelect').addEventListener('change', (e) => { currentSecurity = e.target.value; });
  $('#themeToggle').addEventListener('click', toggleTheme);
});

function applyTranslations() {
  const t = translations[currentLang];
  $('#logoTitle').innerText = t.title;
  $('#tagline').innerText = t.tagline;
  $('#searchInput').placeholder = t.placeholder;
  $('#aiTitle').innerText = t.aiTitle;
  $('#aiBtn').innerText = t.aiBtn;
  $('#aiSourcesLabel').innerText = t.aiSources + ":";
  $('#footerText').innerText = t.footer;
}

function applyTheme() {
  const theme = themes[currentTheme];
  for(const key in theme) { document.documentElement.style.setProperty(key, theme[key]); }
  $('#themeToggle').innerText = currentTheme === 'light'? '🌙' : '☀️';
}

function toggleTheme() {
  currentTheme = currentTheme === 'light'? 'dark' : 'light';
  applyTheme();
}

// RECHERCHE
async function performSearch() {
  const query = $('#searchInput').value.trim();
  if(!query) return;

  $('#results').innerHTML = `<p>${translations[currentLang].searching}</p>`;
  $('#aiBlock').classList.add('hidden');
  $('#aiBtn').classList.remove('hidden');

  const wikiResults = await searchWikipedia(query);
  displayResults(wikiResults, query);

  if(currentSecurity!== 'strong' && GEMINI_API_KEY!== "TA_CLE_ICI") {
    runBaobabAI(query);
  }
}

async function searchWikipedia(query) {
  const langCode = currentLang === 'wo'? 'fr' : currentLang; // Wikipedia n'a pas wolof complet, fallback FR
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.query.search.slice(0, 5);
  } catch(e) {
    console.error(e);
    return [];
  }
}

function displayResults(results, query) {
  const t = translations[currentLang];
  if(results.length === 0) {
    $('#results').innerHTML = `<p>${t.noResults} "${query}"</p>`;
    return;
  }
  const langCode = currentLang === 'wo'? 'fr' : currentLang;
  $('#results').innerHTML = results.map(r => `
    <div class="result-card">
      <h3><a href="https://${langCode}.wikipedia.org/?curid=${r.pageid}" target="_blank">${r.title}</a></h3>
      <p>${r.snippet.replace(/<[^>]*>/g, '')}...</p>
    </div>
  `).join('');
}

// BAOBAB IA AVEC GOOGLE GEMINI
async function runBaobabAI(query) {
  if(!GEMINI_API_KEY || GEMINI_API_KEY === "TA_CLE_ICI") {
    $('#aiText').innerText = "Erreur: Colle ta clé Gemini dans GEMINI_API_KEY";
    $('#aiBlock').classList.remove('hidden');
    return;
  }

  const aiBlock = $('#aiBlock');
  if(currentSecurity === 'strong') { aiBlock.classList.add('hidden'); return; }
  aiBlock.classList.remove('hidden');
  $('#aiText').innerText = translations[currentLang].aiThink;
  $('#aiBtn').classList.add('hidden');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{text: `Tu es Baobab IA, un assistant de recherche pour l'Afrique. Réponds en ${currentLang}. Sois utile, concis et chaleureux. Donne des faits. Question: ${query}`}]
        }]
      })
    });

    if(!response.ok) throw new Error("Erreur API Google");

    const data = await response.json();
    $('#aiText').innerText = data.candidates[0].content.parts[0].text;
    $('#aiSources').innerText = "Google Gemini";
    $('#aiBtn').classList.remove('hidden');
  } catch (error) {
    $('#aiText').innerText = "Erreur: Vérifie ta clé Google et que l'API Gemini est activée.";
    $('#aiBtn').classList.remove('hidden');
  }
}
</script>
</body>
</html>
