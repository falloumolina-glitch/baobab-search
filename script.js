const $ = s => document.querySelector(s);

let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';
let currentQuery = "";
let currentOffset = 0;

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

// ===== RECHERCHE WIKIPEDIA + IMAGES =====
async function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;
  currentQuery = q;
  currentOffset = 0;
  $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche en cours...</p>`;
  $('#aiBlock').classList.add('hidden');

  await searchWikipedia(q, 0);
}

async function searchWikipedia(query, offset) {
  const t = translations[currentLang];
  const langCode = currentLang.startsWith('fr')? 'fr' : currentLang.split('-')[0];
  const limit = 10; // 10 avec images c'est mieux
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

    // On récupère les images et liens pour tous les pageid d'un coup
    const pageIds = results.map(r => r.pageid).join('|');
    const detailsUrl = `https://${langCode}.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=pageimages|info&inprop=url&pithumbsize=150&format=json&origin=*`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    displayResults(results, detailsData.query.pages, query, langCode, total, offset, limit);
  } catch(e) {
    $('#resultsList').innerHTML = `<p style="padding:20px">Erreur réseau.</p>`;
  }
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

  // PAGINATION
  html += `<div style="display:flex;gap:10px;justify-content:center;padding:20px">`;
  if(offset > 0) html += `<button onclick="changePage(-1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">${t.prev}</button>`;
  if(offset + limit < total) html += `<button onclick="changePage(1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">${t.next}</button>`;
  html += `</div>`;

  $('#resultsList').innerHTML = html;
}

function changePage(direction) {
  const limit = 10;
  currentOffset += direction * limit;
  searchWikipedia(currentQuery, currentOffset);
  window.scrollTo(0,0);
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
  input.onchange = e => { let file = e.target.files[0]; if (!file) return; $('#searchInput').value = file.name.replace(/\.[^/.]+$/, ""); search(); };
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
