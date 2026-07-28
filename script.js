const $ = s => document.querySelector(s);

let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';

// ===== DICTIONNAIRE =====
const translations = {
  'fr-FR': { searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", security: "Sécurité", protectionMode: "Mode de protection:", strongHelp: "Mode Renforcé : Aucune donnée n'est enregistrée.", privacy: "Vie privée & Historique", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", appearance: "Apparence", theme: "Thème:", light: "Clair", dark: "Sombre", system: "Système", fontSize: "Taille du texte:", small: "Petit", medium: "Moyen", large: "Grand", back: "Retour", recent: "Historique récent", speakNow: "Parlez maintenant...", noResults: "Aucun résultat trouvé pour" },
  'en-US': { searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", security: "Security", protectionMode: "Protection mode:", strongHelp: "Strong mode: No data is saved.", privacy: "Privacy", saveActivity: "Save activity", clearHistory: "Clear history", appearance: "Appearance", theme: "Theme:", light: "Light", dark: "Dark", system: "System", fontSize: "Text size:", small: "Small", medium: "Medium", large: "Large", back: "Back", recent: "Recent", speakNow: "Speak now...", noResults: "No results found for" }
};

// ===== BASE =====
function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];
  document.documentElement.dir = currentLang === 'ar-SA'? 'rtl' : 'ltr';
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;
  document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent = t[key]; });
}

function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); applyTranslations(); }
function goHome() { showPage('home'); loadHistory(); if($('#langSelect')) $('#langSelect').value = currentLang; if($('#securityMode')) $('#securityMode').value = currentSecurity; }
function showSuggestions() { $('#suggestions').classList.remove('hidden'); loadHistory(); }
function liveSuggest() {}
function selectSuggest(text) { $('#searchInput').value = text; search(); }

// ===== RECHERCHE WIKIPEDIA UNIQUEMENT =====
async function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;
  $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  $('#resultsList').innerHTML = `<p>Recherche en cours...</p>`;
  $('#aiBlock').classList.add('hidden'); // on cache Baobab IA

  await searchWikipedia(q);
}

async function searchWikipedia(query) {
  const langCode = currentLang.startsWith('fr')? 'fr' : currentLang.split('-')[0];
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&format=json&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResults(data.query.search, query, langCode);
  } catch(e) {
    $('#resultsList').innerHTML = `<p>Erreur réseau. Vérifie ta connexion.</p>`;
  }
}

function displayResults(results, query, langCode) {
  const t = translations[currentLang];
  if(results.length === 0) {
    $('#resultsList').innerHTML = `<p>${t.noResults} "${query}"</p>`;
    return;
  }
  $('#resultsList').innerHTML = results.map(r => `
    <div class="result-card">
      <div class="url">https://${langCode}.wikipedia.org/?curid=${r.pageid}</div>
      <a class="title" href="https://${langCode}.wikipedia.org/?curid=${r.pageid}" target="_blank">${r.title}</a>
      <div class="desc">${r.snippet.replace(/<[^>]*>/g, '')}...</div>
    </div>`).join('');
}

// ===== MICRO =====
let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Micro non supporté. Utilise Chrome.");
  const t = translations[currentLang];
  recognition = new SpeechRecognition();
  recognition.lang = currentLang;
  recognition.onstart = () => { $('#searchInput').placeholder = t.speakNow; };
  recognition.onresult = (event) => { $('#searchInput').value = event.results[0][0].transcript; $('#searchInput').placeholder = t.searchPlaceholder; search(); };
  recognition.onend = () => { $('#searchInput').placeholder = t.searchPlaceholder; };
  recognition.start();
}

// ===== CAMERA =====
function startImageSearch() {
  let input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
  input.onchange = e => {
    let file = e.target.files[0]; if (!file) return;
    $('#searchInput').value = file.name.replace(/\.[^/.]+$/, ""); // prend le nom du fichier sans.jpg
    search();
  };
  input.click();
}

// ===== PARAMETRES =====
function setSecurityMode(val) { currentSecurity = val; localStorage.setItem('baobabSecurity', val); $('#strongBanner').classList.toggle('hidden', val!== 'strong'); }
function setTheme(t) { if(t === 'system') t = window.matchMedia('(prefers-color-scheme: dark)').matches? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', t); }
function setFontSize(s) { document.body.style.fontSize = s; }

// ===== HISTORIQUE =====
function saveHistory(q) { if(!$('#saveActivity')?.checked) return; let h = JSON.parse(localStorage.getItem('hist') || '[]'); localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5))); loadHistory(); }
function loadHistory() { let h = JSON.parse(localStorage.getItem('hist') || '[]'); $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i}')">${i}</div>`).join(''); }
function clearHistory() { localStorage.removeItem('hist'); loadHistory(); alert('Historique effacé'); }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if($('#langSelect')){
    $('#langSelect').value = currentLang;
    applyTranslations();
    $('#langSelect').addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('baobabLang', currentLang);
      applyTranslations();
    });
  }
  if($('#securityMode')) $('#securityMode').value = currentSecurity;
  document.addEventListener('click', (e) => { if(!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) $('#suggestions').classList.add('hidden'); })
  goHome();
});
