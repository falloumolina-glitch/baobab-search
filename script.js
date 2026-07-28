const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';
let currentTheme = localStorage.getItem('baobabTheme') || 'light';
let safeSearch = localStorage.getItem('baobabSafe') || 'on';
let suggestionsOn = localStorage.getItem('baobabSuggestions') || 'on';
let currentQuery = ""; let currentOffset = 0; let currentFilter = 'all';

// 1. COLLE TA CLE SERPAPI ICI SEULEMENT
const SERPAPI_KEY = "TA_CLE_ICI";

const translations = {
  'fr-FR': { searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", security: "Sécurité", protectionMode: "Mode de protection:", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", back: "Retour", recent: "Historique récent", speakNow: "Parlez maintenant...", noResults: "Aucun résultat trouvé pour", resultsFor: "Résultats pour", next: "Suivant", prev: "Précédent", readMore: "Lire l'article complet", all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", maps: "Maps", aiAnswer: "Réponse IA" },
  'en-US': { searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", security: "Security", protectionMode: "Protection mode:", saveActivity: "Save activity", clearHistory: "Clear recent history", back: "Back", recent: "Recent", speakNow: "Speak now...", noResults: "No results found for", resultsFor: "Results for", next: "Next", prev: "Previous", readMore: "Read full article", all: "All", images: "Images", videos: "Videos", news: "News", maps: "Maps", aiAnswer: "AI Answer" }
};

function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;
  document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent = t[key]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const key = el.getAttribute('data-i18n-placeholder'); if(t[key]) el.placeholder = t[key]; });
}

function applyTheme() {
  if(currentTheme === 'system') {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', sysDark? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }
}

function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); applyTranslations(); }
function goHome() { showPage('home'); loadHistory(); if($('#langSelect')) $('#langSelect').value = currentLang; if($('#securityMode')) $('#securityMode').value = currentSecurity; if($('#themeSelect')) $('#themeSelect').value = currentTheme; if($('#safeSearch')) $('#safeSearch').value = safeSearch; if($('#suggestionsToggle')) $('#suggestionsToggle').value = suggestionsOn; }
function showSuggestions() { if(suggestionsOn === 'off') return; $('#suggestions').classList.remove('hidden'); loadHistory(); }
function selectSuggest(text) { $('#searchInput').value = text; search(); }

function toggleImageMenu() { $('#imageMenu').classList.toggle('hidden'); }
function startImageSearch(type) {
  $('#imageMenu').classList.add('hidden');
  let input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
  if(type === 'camera') input.capture = 'environment';
  input.onchange = e => { let file = e.target.files[0]; if (!file) return; $('#searchInput').value = file.name.replace(/\.[^/.]+$/, ""); search(); };
  input.click();
}

function setFilter(e, filter) {
  e.preventDefault(); currentFilter = filter; currentOffset = 0;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  if(!currentQuery) return;
  searchSERP(currentQuery, filter);
}

// 2. NOUVELLE FONCTION SERPAPI - REMPLACE TOUT LE RESTE
async function searchSERP(query, filter = 'all') {
  const t = translations[currentLang] || translations['fr-FR'];
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche en cours sur Google...</p>`;

  let params = `q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&engine=google&num=20&hl=${currentLang.split('-')[0]}&gl=sn`;
  if(safeSearch === 'on') params += `&safe=active`;

  if(filter === 'news') params += `&tbm=nws`;
  if(filter === 'images') params += `&tbm=isch`;
  if(filter === 'videos') params += `&tbm=vid`;

  try {
    const res = await fetch(`https://serpapi.com/search.json?${params}`);
    const data = await res.json();
    let html = ``;

    // BLOC REPONSE IA EN HAUT
    if(data.answer_box && filter === 'all') {
      html += `<div id="aiBlock" style="margin:20px 24px; padding:16px; background:var(--card); border:1px solid var(--border); border-radius:12px">
        <h3 style="margin:0 0 8px 0">🤖 ${t.aiAnswer}</h3>
        <p style="margin:0">${data.answer_box.answer || data.answer_box.snippet}</p>
        <a href="${data.answer_box.link}" target="_blank" style="font-size:12px;color:var(--muted)">Source</a>
      </div>`;
    }

    // BLOC RESULTATS
    let results = data.organic_results || data.news_results || data.video_results || data.images_results || [];

    if(results.length > 0) {
      if(filter === 'all') html += `<p style="padding:12px 24px;color:var(--muted)">${t.resultsFor} <b>${query}</b> • ${data.search_information?.total_results} résultats</p>`;

      if(filter === 'images') {
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:20px">`;
        results.forEach(item => { html += `<a href="${item.original}" target="_blank"><img src="${item.thumbnail}" style="width:100%;height:150px;object-fit:cover;border-radius:8px"></a>`; });
        html += `</div>`;
      } else {
        results.forEach(item => {
          html += `<div style="padding:12px 24px;border-bottom:1px solid var(--border)">
            <a href="${item.link || item.url}" target="_blank" rel="noopener" style="font-size:18px;color:var(--link);text-decoration:none">${item.title}</a>
            <div style="color:#006621;font-size:14px">${item.displayed_link || item.link}</div>
            <div style="color:var(--text);font-size:14px;line-height:1.5">${item.snippet || item.description}</div>
          </div>`;
        });
      }
    } else {
      html += `<p style="padding:20px">${t.noResults} "${query}"</p>`;
    }
    $('#resultsList').innerHTML = html;

  } catch(e) {
    console.error("Erreur SERPAPI:", e);
    $('#resultsList').innerHTML = `<p style="padding:20px">Erreur API. Vérifie ta clé et tes crédits.</p>`;
  }
}

async function search() {
  let q = $('#results').classList.contains('active')? $('#searchInput2').value : $('#searchInput').value;
  q = q.trim(); if(!q) return;
  currentQuery = q; currentOffset = 0; currentFilter = 'all';
  if($('#searchInput')) $('#searchInput').value = q;
  if($('#searchInput2')) $('#searchInput2').value = q;
  saveHistory(q); showPage('results');
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');

  searchSERP(q, 'all');
}

let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Micro non supporté. Utilise Chrome.");
  const t = translations[currentLang] || translations['fr-FR']; recognition = new SpeechRecognition(); recognition.lang = currentLang;
  recognition.onstart = () => { $('#searchInput').placeholder = t.speakNow; };
  recognition.onresult = (event) => { $('#searchInput').value = event.results[0][0].transcript; search(); };
  recognition.onend = () => { $('#searchInput').placeholder = t.searchPlaceholder; }; recognition.start();
}

function setSecurityMode(val) { currentSecurity = val; localStorage.setItem('baobabSecurity', val); $('#strongBanner').classList.toggle('hidden', val!== 'strong'); }
function saveHistory(q) { if($('#saveActivity') &&!$('#saveActivity').checked) return; let h = JSON.parse(localStorage.getItem('hist') || '[]'); localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5))); loadHistory(); }
function loadHistory() { let h = JSON.parse(localStorage.getItem('hist') || '[]'); $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i.replace(/'/g, "\\'")}')">${i}</div>`).join(''); }
function clearHistory() { localStorage.removeItem('hist'); loadHistory(); alert('Historique effacé'); }

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  if($('#langSelect')){
    $('#langSelect').value = currentLang;
    applyTranslations();
    $('#langSelect').addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('baobabLang', currentLang);
      applyTranslations();
    });
  }
  if($('#themeSelect')){
    $('#themeSelect').value = currentTheme;
    $('#themeSelect').addEventListener('change', (e) => {
      currentTheme = e.target.value;
      localStorage.setItem('baobabTheme', currentTheme);
      applyTheme();
    });
  }
  if($('#safeSearch')){
    $('#safeSearch').value = safeSearch;
    $('#safeSearch').addEventListener('change', (e) => {
      safeSearch = e.target.value;
      localStorage.setItem('baobabSafe', safeSearch);
    });
  }
  if($('#suggestionsToggle')){
    $('#suggestionsToggle').value = suggestionsOn;
    $('#suggestionsToggle').addEventListener('change', (e) => {
      suggestionsOn = e.target.value;
      localStorage.setItem('baobabSuggestions', suggestionsOn);
    });
  }
  if($('#securityMode')) $('#securityMode').value = currentSecurity;

  document.addEventListener('click', (e) => {
    if(!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) $('#suggestions').classList.add('hidden');
    if(!e.target.closest('#imageMenu') &&!e.target.closest('.icon-btn[title="Recherche par image"]')) $('#imageMenu').classList.add('hidden');
  })
  goHome();
});
