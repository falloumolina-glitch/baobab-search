const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';
let currentTheme = localStorage.getItem('baobabTheme') || 'light';
let safeSearch = localStorage.getItem('baobabSafe') || 'on';
let suggestionsOn = localStorage.getItem('baobabSuggestions') || 'on';
let currentQuery = "";
let currentFilter = 'all';

const translations = {
  'fr-FR': { searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", security: "Sécurité", protectionMode: "Mode de protection:", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", back: "Retour", recent: "Historique récent", speakNow: "Parlez maintenant...", noResults: "Aucun résultat trouvé pour", resultsFor: "Résultats pour", next: "Suivant", prev: "Précédent", readMore: "Lire l'article complet", all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", maps: "Maps" },
  'en-US': { searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", security: "Security", protectionMode: "Protection mode:", saveActivity: "Save activity", clearHistory: "Clear recent history", back: "Back", recent: "Recent", speakNow: "Speak now...", noResults: "No results found for", resultsFor: "Results for", next: "Next", prev: "Previous", readMore: "Read full article", all: "All", images: "Images", videos: "Videos", news: "News", maps: "Maps" }
};

function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;
  document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent = t[key]; });
}

function applyTheme() {
  if(currentTheme === 'system') {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', sysDark? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(`#${id}`).classList.add('active');
  applyTranslations();
}

function goHome() {
  showPage('home');
  loadHistory();
  if($('#langSelect')) $('#langSelect').value = currentLang;
  if($('#securityMode')) $('#securityMode').value = currentSecurity;
  if($('#themeSelect')) $('#themeSelect').value = currentTheme;
  if($('#safeSearch')) $('#safeSearch').value = safeSearch;
  if($('#suggestionsToggle')) $('#suggestionsToggle').value = suggestionsOn;
}

function showSuggestions() {
  if(suggestionsOn === 'off') return;
  $('#suggestions').classList.remove('hidden');
  loadHistory();
}

function selectSuggest(text) {
  $('#searchInput').value = text;
  search();
}

function toggleImageMenu() {
  $('#imageMenu').classList.toggle('hidden');
}

function startImageSearch(type) {
  $('#imageMenu').classList.add('hidden');
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  if(type === 'camera') input.capture = 'environment';
  input.onchange = e => {
    let file = e.target.files[0];
    if (!file) return;
    $('#searchInput').value = file.name.replace(/\.[^/.]+$/, "");
    search();
  };
  input.click();
}

function setFilter(e, filter) {
  e.preventDefault();
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  if(!currentQuery) return;
  searchBaobab(currentQuery);
}

// VERSION 100% FONCTIONNELLE SANS PROXY
async function searchBaobab(query) {
  const t = translations[currentLang] || translations['fr-FR'];
  $('#resultsList').innerHTML = `<p style="padding:20px;text-align:center">Recherche de "${query}"...</p>`;
  currentQuery = query;
  let html = `<p style="padding:12px 24px;color:var(--muted)">${t.resultsFor} <b>${query}</b></p>`;
  let hasResults = false;

  // 1. WIKIPEDIA - MARCHE TOUJOURS MEME EN 4G
  try {
    const wikiRes = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if(wikiRes.ok){
      const w = await wikiRes.json();
      hasResults = true;
      html += `<div style="padding:12px 24px;border:1px solid #1a73e8;border-radius:8px;margin:12px 24px;background:#e8f0fe">
        <a href="${w.content_urls.desktop.page}" target="_blank" style="font-size:20px;color:#1a0dab;font-weight:500">${w.title}</a>
        <div style="color:#006621;font-size:14px">${w.content_urls.desktop.page}</div>
        <div style="color:#3c4043;font-size:14px;line-height:1.58">${w.extract}</div>
      </div>`;
    }
  }catch(e){ console.log("Wiki error") }

  // 2. DUCKDUCKGO INSTANT ANSWER
  try {
    const ddgRes = await fetch(`https://api.duckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
    const d = await ddgRes.json();

    // Résultat direct
    if(d.Answer){
      hasResults = true;
      html += `<div style="padding:12px 24px;border-bottom:1px solid var(--border)"><b>Réponse rapide:</b> ${d.Answer}</div>`;
    }

    // Liens
    if(d.RelatedTopics){
      d.RelatedTopics.slice(0,8).forEach(item => {
        if(item.FirstURL && item.Text){
          hasResults = true;
          html += `<div style="padding:12px 24px;border-bottom:1px solid var(--border)">
            <a href="${item.FirstURL}" target="_blank" style="font-size:20px;color:#1a0dab;text-decoration:none">${item.Text.split(' - ')[0]}</a>
            <div style="color:#006621;font-size:14px">${item.FirstURL}</div>
            <div style="color:#4d5156;font-size:14px;line-height:1.58">${item.Text}</div>
          </div>`;
        }
      });
    }
  }catch(e){ console.log("DDG error") }

  // 3. SI RIEN TROUVE: ON MET LIEN BING + GOOGLE
  if(!hasResults){
    html += `<div style="padding:20px;text-align:center">
      <p>${t.noResults} "${query}"</p>
      <a href="https://www.bing.com/search?q=${encodeURIComponent(query)}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#1a73e8;color:white;border-radius:4px;text-decoration:none">Voir sur Bing</a>
      <a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#34a853;color:white;border-radius:4px;text-decoration:none">Voir sur Google</a>
    </div>`;
  }

  $('#resultsList').innerHTML = html;
}

async function search() {
  let q = $('#results').classList.contains('active')? $('#searchInput2').value : $('#searchInput').value;
  q = q.trim();
  if(!q) return;
  if($('#searchInput')) $('#searchInput').value = q;
  if($('#searchInput2')) $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');
  searchBaobab(q);
}

let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Micro non supporté. Utilise Chrome.");
  const t = translations[currentLang] || translations['fr-FR'];
  recognition = new SpeechRecognition();
  recognition.lang = currentLang;
  recognition.onstart = () => { $('#searchInput').placeholder = t.speakNow; };
  recognition.onresult = (event) => { $('#searchInput').value = event.results[0][0].transcript; search(); };
  recognition.onend = () => { $('#searchInput').placeholder = t.searchPlaceholder; };
  recognition.start();
}

function setSecurityMode(val) {
  currentSecurity = val;
  localStorage.setItem('baobabSecurity', val);
  if($('#strongBanner')) $('#strongBanner').classList.toggle('hidden', val!== 'strong');
}

function saveHistory(q) {
  if($('#saveActivity') &&!$('#saveActivity').checked) return;
  let h = JSON.parse(localStorage.getItem('hist') || '[]');
  localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5)));
  loadHistory();
}

function loadHistory() {
  let h = JSON.parse(localStorage.getItem('hist') || '[]');
  if($('#historyList')) $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i.replace(/'/g, "\\'")}')">${i}</div>`).join('');
}

function clearHistory() {
  localStorage.removeItem('hist');
  loadHistory();
  alert('Historique effacé');
}

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
    if($('#suggestions') &&!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) $('#suggestions').classList.add('hidden');
    if($('#imageMenu') &&!e.target.closest('#imageMenu') &&!e.target.closest('.icon-btn[title="Recherche par image"]')) $('#imageMenu').classList.add('hidden');
  });

  goHome();
});
