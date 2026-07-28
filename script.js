const $ = s => document.querySelector(s);

let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';
let currentQuery = "";
let currentOffset = 0;
let currentFilter = 'all';

const translations = {
  'fr-FR': { searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", security: "Sécurité", protectionMode: "Mode de protection:", strongHelp: "Mode Renforcé : Aucune donnée n'est enregistrée.", privacy: "Vie privée & Historique", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", appearance: "Apparence", theme: "Thème:", light: "Clair", dark: "Sombre", system: "Système", fontSize: "Taille du texte:", small: "Petit", medium: "Moyen", large: "Grand", back: "Retour", recent: "Historique récent", speakNow: "Parlez maintenant...", noResults: "Aucun résultat trouvé pour", resultsFor: "Résultats pour", next: "Suivant", prev: "Précédent", readMore: "Lire l'article complet" },
  'en-US': { searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", security: "Security", protectionMode: "Protection mode:", strongHelp: "Strong mode: No data is saved.", privacy: "Privacy", saveActivity: "Save activity", clearHistory: "Clear history", appearance: "Appearance", theme: "Theme:", light: "Light", dark: "Dark", system: "System", fontSize: "Text size:", small: "Small", medium: "Medium", large: "Large", back: "Back", recent: "Recent", speakNow: "Speak now...", noResults: "No results found for", resultsFor: "Results for", next: "Next", prev: "Previous", readMore: "Read full article" }
};

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

// ===== GESTION DES ONGLETS =====
function setFilter(filter) {
  currentFilter = filter;
  currentOffset = 0;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  if(filter === 'all') searchWikipedia(currentQuery, 0);
  if(filter === 'images') searchWikimediaImages(currentQuery);
  if(filter === 'videos') $('#resultsList').innerHTML = `<p style="padding:20px">Bientôt : Vidéos pour "${currentQuery}"</p>`;
  if(filter === 'news') $('#resultsList').innerHTML = `<p style="padding:20px">Bientôt : Actualités pour "${currentQuery}"</p>`;
  if(filter === 'maps') $('#resultsList').innerHTML = `<p style="padding:20px">Bientôt : Carte pour "${currentQuery}"</p>`;
}

// ===== RECHERCHE D'IMAGES =====
async function searchWikimediaImages(query) {
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche d'images...</p>`;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=20&prop=imageinfo&iiprop=url|thumbmime|url&iiurlwidth=300&format=json&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.pages || {};
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:20px">`;
    Object.values(pages).forEach(p => {
      if(p.imageinfo) {
        const imgUrl = p.imageinfo[0].thumburl || p.imageinfo[0].url;
        html += `<a href="${p.imageinfo[0].url}" target="_blank"><img src="${imgUrl}" style="width:100%;height:150px;object-fit:cover;border-radius:8px"></a>`;
      }
    });
    html += `</div>`;
    $('#resultsList').innerHTML = html;
  } catch(e) { $('#resultsList').innerHTML = `<p style="padding:20px">Aucune image trouvée</p>`; }
}

// ===== RECHERCHE PRINCIPALE - FIX ICI =====
async function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;

  q = q.trim();
  currentQuery = q;
  currentOffset = 0;
  currentFilter = 'all';

  // FIX : On synchronise les 2 inputs pour éviter le bug "La poésie"
  if($('#searchInput')) $('#searchInput').value = q;
  if($('#searchInput2')) $('#searchInput2').value = q;

  saveHistory(q);
  showPage('results');

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');

  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche en cours...</p>`;
  $('#aiBlock').classList.add('hidden');

  await searchWikipedia(q, 0);
}

async function searchWikipedia(query, offset) {
  const t = translations[currentLang];
  const langCode = currentLang.startsWith('fr')? 'fr' : currentLang.split('-')[0];
  const limit = 10;
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&sroffset=${offset}&format=json&origin=*`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = data.query.search;
    const total = data.query.searchinfo.totalhits;

    if(results.length === 0) {
      $('#resultsList').innerHTML = `<p style="padding:20px">${t.noResults} "${query}"</p>`;
      return;
    }

    const pageIds = results.map(r => r.pageid).join('|');
    const detailsUrl = `https://${langCode}.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=pageimages|info&inprop=url&pithumbsize=150&format=json&origin=*`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    displayResults(results, detailsData.query.pages, query, langCode, total, offset, limit);
  } catch(e) { $('#resultsList').innerHTML = `<p style="padding:20px">Erreur réseau.</p>`; }
}

function displayResults(results, pages, query, langCode, total, offset, limit) {
  const t = translations[currentLang];
  let html = `<p style="padding:12px 24px;color:#5f6368">${t.resultsFor} <b>${query}</b> - ${total} résultats</p>`;

  html += results.map(r => {
    const page = pages[r.pageid];
    const img = page.thumbnail? `<img src="${page.thumbnail.source}" style="width:120px;height:90px;object-fit:cover;border-radius:8px;margin-right:12px">` : '';
    const url = page.fullurl;

    return `
    <div class="result-card" style="display:flex;gap:12px;padding:12px 24px;border-bottom:1px solid #eee">
      ${img}
      <div style="flex:1">
        <a class="title" href="${url}" target="_blank" style="font-size:18px;color:#1A73E8;text-decoration:none">${r.title}</a>
        <div class="url" style="color:#006621;font-size:14px">${url}</div>
        <div class="desc" style="color:#4d5156;font-size:14px;line-height:1.5">${r.snippet.replace(/<[^>]*>/g, '')}...</div>
        <a href="${url}" target="_blank" style="color:#1A73E8;font-size:13px">${t.readMore} →</a>
      </div>
    </div>`;
  }).join('');

  html += `<div style="display:flex;gap:10px;justify-content:center;padding:20px">`;
  if(offset > 0) html += `<button onclick="changePage(-1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">${t.prev}</button>`;
  if(offset + limit < total) html += `<button onclick="changePage(1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">${t.next}</button>`;
  html += `</div>`;

  $('#resultsList').innerHTML = html;
}

function changePage(direction) {
  const limit = 10;
  currentOffset += direction * limit;
  if(currentFilter === 'all') searchWikipedia(currentQuery, currentOffset);
  if(currentFilter === 'images') searchWikimediaImages(currentQuery);
  window.scrollTo(0,0);
}

// ===== MICRO / CAMERA / PARAMETRES / HISTORIQUE =====
let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Micro non supporté. Utilise Chrome.");
  const t = translations[currentLang];
  recognition = new SpeechRecognition();
  recognition.lang = currentLang;
  recognition.onstart = () => { $('#searchInput').placeholder = t.speakNow; };
  recognition.onresult = (event) => { $('#searchInput').value = event.results[0][0].transcript; search(); };
  recognition.onend = () => { $('#searchInput').placeholder = t.searchPlaceholder; };
  recognition.start();
}

function startImageSearch() {
  let input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
  input.onchange = e => { let file = e.target.files[0]; if (!file) return; $('#searchInput').value = file.name.replace(/\.[^/.]+$/, ""); search(); };
  input.click();
}

function setSecurityMode(val) { currentSecurity = val; localStorage.setItem('baobabSecurity', val); $('#strongBanner').classList.toggle('hidden', val!== 'strong'); }
function setTheme(t) { if(t === 'system') t = window.matchMedia('(prefers-color-scheme: dark)').matches? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', t); }
function setFontSize(s) { document.body.style.fontSize = s; }
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
