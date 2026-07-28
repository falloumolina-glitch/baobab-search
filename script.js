const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';
let currentTheme = localStorage.getItem('baobabTheme') || 'light';
let safeSearch = localStorage.getItem('baobabSafe') || 'on';
let suggestionsOn = localStorage.getItem('baobabSuggestions') || 'on';
let currentQuery = ""; let currentOffset = 0; let currentFilter = 'all';

const translations = {
  'fr-FR': { searchPlaceholder: "Rechercher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", security: "Sécurité", protectionMode: "Mode de protection:", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", back: "Retour", recent: "Historique récent", speakNow: "Parlez maintenant...", noResults: "Aucun résultat trouvé pour", resultsFor: "Résultats pour", next: "Suivant", prev: "Précédent", readMore: "Lire l'article complet", all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", maps: "Maps" },
  'en-US': { searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", security: "Security", protectionMode: "Protection mode:", saveActivity: "Save activity", clearHistory: "Clear recent history", back: "Back", recent: "Recent", speakNow: "Speak now...", noResults: "No results found for", resultsFor: "Results for", next: "Next", prev: "Previous", readMore: "Read full article", all: "All", images: "Images", videos: "Videos", news: "News", maps: "Maps" }
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
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche en cours...</p>`;
  if(filter === 'all') runAllSearch(currentQuery);
  if(filter === 'images') searchWikimediaImages(currentQuery);
  if(filter === 'videos') searchVideos(currentQuery);
  if(filter === 'news') searchNews(currentQuery, true);
  if(filter === 'maps') searchMaps(currentQuery);
}

async function runAllSearch(query) {
  $('#resultsList').innerHTML = ``; // on vide
  await Promise.all([ // on lance en parallèle
    searchNews(query, false),
    searchWikipedia(query, 0)
  ]);
}

async function searchWikimediaImages(query) {
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche d'images...</p>`;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=20&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const pages = data.query?.pages || {};
    if(Object.keys(pages).length === 0) { $('#resultsList').innerHTML = `<p style="padding:20px">Aucune image trouvée</p>`; return; }
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:20px">`;
    Object.values(pages).forEach(p => { if(p.imageinfo) { const imgUrl = p.imageinfo[0].thumburl; html += `<a href="${p.imageinfo[0].url}" target="_blank" rel="noopener"><img src="${imgUrl}" style="width:100%;height:150px;object-fit:cover;border-radius:8px"></a>`; } });
    html += `</div>`; $('#resultsList').innerHTML = html;
  } catch(e) { $('#resultsList').innerHTML = `<p style="padding:20px">Erreur images</p>`; }
}
function searchVideos(query) { $('#resultsList').innerHTML = `<iframe width="100%" height="600" src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}" frameborder="0" allowfullscreen style="padding:0 24px"></iframe>`; }

// CORRIGE : Plus d'iframe. On fait des vrais liens cliquables
async function searchNews(query, onlyNews = false) {
  const t = translations[currentLang] || translations['fr-FR'];
  if(onlyNews) $('#resultsList').innerHTML = `<p style="padding:20px">Chargement des actualités...</p>`;

  const hl = currentLang.startsWith('fr')? 'fr' : 'en';
  const gl = currentLang.startsWith('fr')? 'FR' : 'US';
  const newsURL = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;

  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(newsURL)}`);
    const data = await response.json();

    if(data.status === 'ok' && data.items && data.items.length > 0){
        let html = `<h3 style="padding:20px 24px 0 24px">📰 ${t.news} pour "${query}"</h3>`;
        data.items.slice(0, onlyNews? 20 : 5).forEach(item => {
            const pubDate = new Date(item.pubDate).toLocaleDateString(currentLang);
            html += `
            <div style="padding:12px 24px;border-bottom:1px solid var(--border)">
                <div style="font-size:12px; color:var(--muted)">${item.author || 'Source'} • ${pubDate}</div>
                <a href="${item.link}" target="_blank" rel="noopener" style="font-size:18px; font-weight:500; text-decoration:none; color:var(--link)">${item.title}</a>
                <p style="font-size:14px; color:var(--muted); margin:4px 0">${item.description.replace(/<[^>]*>/g, '').substring(0,180)}...</p>
            </div>
            `;
        });
        if(onlyNews) $('#resultsList').innerHTML = html;
        else $('#resultsList').insertAdjacentHTML('afterbegin', html);
    } else if(onlyNews) {
        $('#resultsList').innerHTML = `<p style="padding:20px">${t.noResults} "${query}"</p>`;
    }
  } catch(e) {
    console.log("Erreur News:", e);
    if(onlyNews) $('#resultsList').innerHTML = `<p style="padding:20px">Erreur lors du chargement des actualités.</p>`;
  }
}

function searchMaps(query) { $('#resultsList').innerHTML = `<iframe width="100%" height="600" src="https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed" frameborder="0" style="padding:0 24px"></iframe>`; }

async function search() {
  let q = $('#results').classList.contains('active')? $('#searchInput2').value : $('#searchInput').value;
  q = q.trim(); if(!q) return;
  currentQuery = q; currentOffset = 0; currentFilter = 'all';
  if($('#searchInput')) $('#searchInput').value = q;
  if($('#searchInput2')) $('#searchInput2').value = q;
  saveHistory(q); showPage('results');
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche en cours...</p>`;
  $('#aiBlock').classList.remove('hidden');
  $('#aiText').innerHTML = `Recherche de la réponse...`;

  runAllSearch(q); // lance Actu + Wiki
  getAIAnswer(q);
}

async function getAIAnswer(query) {
  const langCode = currentLang.startsWith('fr')? 'fr' : 'en';
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const results = data.query.search;
    if(results.length === 0) { $('#aiText').innerHTML = `Je n'ai rien trouvé sur "${query}".`; return; }
    let summary = results.map(r => r.snippet.replace(/<[^>]*>/g, '')).join(' ');
    summary = summary.substring(0, 450) + '...';
    $('#aiText').innerHTML = `${summary}<div style="margin-top:8px;font-size:12px;color:var(--muted)">Source: Wikipedia</div>`;
  } catch(e) { $('#aiText').innerHTML = `Impossible de générer un aperçu IA.`; }
}

async function searchWikipedia(query, offset) {
  const t = translations[currentLang] || translations['fr-FR'];
  const langCode = currentLang.startsWith('fr')? 'fr' : 'en';
  const limit = 10;
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&sroffset=${offset}&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const results = data.query.search; const total = data.query.searchinfo.totalhits;
    if(results.length === 0 && offset === 0) { $('#resultsList').innerHTML += `<p style="padding:20px">${t.noResults} "${query}"</p>`; return; }
    const pageIds = results.map(r => r.pageid).join('|');
    const detailsUrl = `https://${langCode}.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=pageimages|info&inprop=url&pithumbsize=150&format=json&origin=*`;
    const detailsRes = await fetch(detailsUrl); const detailsData = await detailsRes.json();
    displayResults(results, detailsData.query.pages, query, total, offset, limit);
  } catch(e) { $('#resultsList').innerHTML += `<p style="padding:20px">Erreur réseau.</p>`; }
}

function displayResults(results, pages, query, total, offset, limit) {
  const t = translations[currentLang] || translations['fr-FR'];
  let html = ``;
  if(offset === 0) {
    html += `<p style="padding:12px 24px;color:var(--muted)">📖 ${t.resultsFor} <b>${query}</b> - ${total} résultats Wikipedia</p>`;
  }
  html += results.map(r => {
    const page = pages[r.pageid];
    const img = page.thumbnail? `<img src="${page.thumbnail.source}" style="width:120px;height:90px;object-fit:cover;border-radius:8px;margin-right:12px">` : '';
    const url = page.fullurl;
    return `<div style="display:flex;gap:12px;padding:12px 24px;border-bottom:1px solid var(--border)">${img}<div style="flex:1"><a href="${url}" target="_blank" rel="noopener" style="font-size:18px;color:var(--link);text-decoration:none">${r.title}</a><div style="color:#006621;font-size:14px">${url}</div><div style="color:var(--text);font-size:14px;line-height:1.5">${r.snippet.replace(/<[^>]*>/g, '')}...</div><a href="${url}" target="_blank" rel="noopener" style="color:var(--link);font-size:13px">${t.readMore} →</a></div></div>`;
  }).join('');
  html += `<div style="display:flex;gap:10px;justify-content:center;padding:20px">`;
  if(offset > 0) html += `<button onclick="changePage(-1)" style="padding:8px 16px;cursor:pointer;border:1px solid var(--border);border-radius:4px;background:var(--card);color:var(--text)">${t.prev}</button>`;
  if(offset + limit < total) html += `<button onclick="changePage(1)" style="padding:8px 16px;cursor:pointer;border:1px solid var(--border);border-radius:4px;background:var(--card);color:var(--text)">${t.next}</button>`;
  html += `</div>`;
  $('#resultsList').insertAdjacentHTML('beforeend', html);
}
function changePage(direction) { const limit = 10; currentOffset += direction * limit; if(currentFilter === 'all') searchWikipedia(currentQuery, currentOffset); window.scrollTo(0,0); }

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
