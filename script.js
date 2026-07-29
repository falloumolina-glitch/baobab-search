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

// VERSION QUI AFFICHE TOUS LES RESULTATS
async function searchBaobab(query) {
  const t = translations[currentLang] || translations['fr-FR'];
  $('#resultsList').innerHTML = `<p style="padding:20px;text-align:center">Recherche de "${query}" sur Baobab...</p>`;
  currentQuery = query;
  let html = "";
  let allResults = [];
  let errors = [];

  // 1. APERÇU BAOBAB IA - WIKIPEDIA
  try {
    const wiki = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if(wiki.ok){
      const w = await wiki.json();
      html += `
        <div style="padding:16px 24px;margin:12px 24px;border:1px solid #a855f7;border-radius:12px;background:linear-gradient(135deg,#1e1b4b,#312e81)">
          <div style="font-size:14px;color:#c4b5fd;font-weight:600;margin-bottom:8px">✨ Aperçu Baobab IA</div>
          <div style="color:#e5e7eb;line-height:1.6;font-size:15px">${w.extract}</div>
          <a href="${w.content_urls.desktop.page}" target="_blank" style="color:#a5b4fc;font-size:13px;margin-top:8px;display:block">Source: Wikipedia</a>
        </div>
      `;
    }
  }catch(e){ errors.push("Wiki") }

  html += `<p style="padding:12px 24px;color:var(--muted)">${t.resultsFor} <b>${query}</b></p>`;

  // 2. MOTEUR 1 : BING = DUCKDUCKGO - 20 RESULTATS
  try {
    const ddg = await fetch(`https://api.duckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
    const d = await ddg.json();

    if(d.AbstractText && d.AbstractURL){
      allResults.push({title: `⚡ ${d.Heading}`, url: d.AbstractURL, content: d.AbstractText, source: 'Bing'});
    }
    d.RelatedTopics.slice(0,20).forEach(item => { // 20 au lieu de 15
      if(item.FirstURL) allResults.push({title: item.Text.split(' - ')[0], url: item.FirstURL, content: item.Text, source: 'Bing'});
    });
  }catch(e){ errors.push("Bing") }

  // 3. MOTEUR 2 : WIKIPEDIA SEARCH - 10 RESULTATS
  try {
    const wikiSearch = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&format=json&origin=*`);
    const ws = await wikiSearch.json();
    ws.query.search.forEach(item => {
      allResults.push({
        title: `📖 ${item.title}`,
        url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
        content: item.snippet.replace(/<[^>]*>/g, ''),
        source: 'Wikipedia'
      });
    });
  }catch(e){ errors.push("WikiSearch") }

  // 4. MOTEUR 3 : WIKIDATA - 5 RESULTATS
  try {
    const wd = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=fr&limit=5&format=json&origin=*`); // 5 au lieu de 3
    const wdData = await wd.json();
    wdData.search.forEach(item => {
      allResults.push({title: `🏷️ ${item.label}`, url: `https://www.wikidata.org/wiki/${item.id}`, content: item.description || 'Fiche d\'information', source: 'Wikidata'});
    });
  }catch(e){ errors.push("Wikidata") }

  // 5. AFFICHAGE DE TOUS LES RESULTATS
  if(allResults.length > 0){
    allResults.forEach(item => {
      html += `<div style="padding:14px 24px;border-bottom:1px solid var(--border)">
        <a href="${item.url}" target="_blank" style="font-size:20px;color:#8b5cf6;text-decoration:none;line-height:1.3;font-weight:500">${item.title}</a>
        <div style="color:#4ade80;font-size:14px;margin:2px 0;word-break:break-all">${item.url}</div>
        <div style="color:var(--text);font-size:14px;line-height:1.58">${item.content}</div>
        <div style="color:#70757a;font-size:12px;margin-top:4px">Source: ${item.source}</div>
      </div>`;
    });
  } else {
    html += `<div style="padding:40px;text-align:center;color:var(--muted)">
      <p>${t.noResults} "${query}"</p>
      <p style="font-size:13px">Erreur moteurs: ${errors.join(', ')}</p>
    </div>`;
  }

  html += `<p style="padding:12px 24px;color:var(--muted);font-size:13px"><b>${allResults.length}</b> résultats trouvés sur Baobab</p>`;
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
