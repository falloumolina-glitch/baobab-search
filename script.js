// ========================================
// BAOBAB SEARCH - VERSION 100% GRATUITE SANS CLÉ
// ========================================

let currentLang = 'fr';
let currentSecurity = 'balanced';
let currentTheme = 'light';

const $ = (id) => document.getElementById(id);

// TRADUCTIONS
const translations = {
  fr: { title: "Baobab Search", tagline: "La recherche africaine, intelligente et respectueuse.", placeholder: "Pose ta question à Baobab...", searching: "Recherche en cours...", aiTitle: "Baobab IA", aiThink: "Baobab réfléchit à partir de Wikipedia...", aiBtn: "Demander à Baobab IA", aiSources: "Sources", footer: "Fait avec ❤️ pour l'Afrique. 100% Gratuit, 0 clé API." },
  wo: { title: "Baobab Seet", tagline: "Seetug Afrik bi, xel te jàmm.", placeholder: "Laj Baobab...", searching: "Dii seet...", aiTitle: "Baobab AI", aiThink: "Baobab di xalaat...", aiBtn: "Laj Baobab AI", aiSources: "Lëndëm yi", footer: "Def nañ ko ak bégg. Baobab, garab xam-xam. Free 100%." }
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

// RECHERCHE WIKIPEDIA
async function performSearch() {
  const query = $('#searchInput').value.trim();
  if(!query) return;

  $('#results').innerHTML = `<p>${translations[currentLang].searching}</p>`;
  $('#aiBlock').classList.add('hidden');
  $('#aiBtn').classList.remove('hidden');

  const wikiResults = await searchWikipedia(query);
  displayResults(wikiResults, query);

  if(currentSecurity!== 'strong') {
    runBaobabAI(query); // L'IA va résumer Wikipedia
  }
}

async function searchWikipedia(query) {
  const url = `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.query.search.slice(0, 5);
  } catch(e) { return []; }
}

function displayResults(results, query) {
  if(results.length === 0) {
    $('#results').innerHTML = `<p>Aucun résultat trouvé pour "${query}"</p>`;
    return;
  }
  $('#results').innerHTML = results.map(r => `
    <div class="result-card">
      <h3><a href="https://fr.wikipedia.org/?curid=${r.pageid}" target="_blank">${r.title}</a></h3>
      <p>${r.snippet.replace(/<[^>]*>/g, '')}...</p>
    </div>
  `).join('');
}

// BAOBAB IA SANS CLÉ - IL RÉSUME WIKIPEDIA
async function runBaobabAI(query) {
  const aiBlock = $('#aiBlock');
  if(currentSecurity === 'strong') { aiBlock.classList.add('hidden'); return; }
  aiBlock.classList.remove('hidden');
  $('#aiText').innerText = translations[currentLang].aiThink;
  $('#aiBtn').classList.add('hidden');

  try {
    // On prend le 1er résultat Wikipedia et on le "résume"
    const res = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(query)}&format=json&origin=*`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    let extract = pages[pageId].extract || "Désolé, je n'ai rien trouvé sur ça.";

    // On coupe pour faire un résumé
    if(extract.length > 600) extract = extract.substring(0, 600) + "...";

    $('#aiText').innerText = extract;
    $('#aiSources').innerHTML = `<span>Source: Wikipedia</span>`;
    $('#aiBtn').classList.remove('hidden');
  } catch (error) {
    $('#aiText').innerText = "Baobab n'a pas trouvé d'info. Essaie une autre question.";
    $('#aiBtn').classList.remove('hidden');
  }
}
