const $ = s => document.querySelector(s);

let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';
let currentQuery = "";
let currentOffset = 0;
let currentFilter = 'all';

function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); }
function goHome() { showPage('home'); loadHistory(); if($('#langSelect')) $('#langSelect').value = currentLang; if($('#securityMode')) $('#securityMode').value = currentSecurity; }
function showSuggestions() { $('#suggestions').classList.remove('hidden'); loadHistory(); }
function selectSuggest(text) { $('#searchInput').value = text; search(); }

// FIX : ONGLETS QUI LANCENT VRAIMENT LA RECHERCHE
function setFilter(e, filter) {
  e.preventDefault();
  currentFilter = filter;
  currentOffset = 0;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');

  if(!currentQuery) return;

  if(filter === 'all') searchWikipedia(currentQuery, 0);
  if(filter === 'images') searchWikimediaImages(currentQuery);
  if(filter === 'videos') searchVideos(currentQuery);
  if(filter === 'news') searchNews(currentQuery);
  if(filter === 'maps') searchMaps(currentQuery);
}

// RECHERCHE VIDEOS YOUTUBE
function searchVideos(query) {
  $('#resultsList').innerHTML = `<iframe width="100%" height="600" src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}" frameborder="0" allowfullscreen></iframe>`;
}

// RECHERCHE ACTUALITES GOOGLE NEWS
function searchNews(query) {
  $('#resultsList').innerHTML = `
  <div style="padding:20px">
    <h3>Actualités pour "${query}"</h3>
    <p>Voir les dernières actus sur : 
    <a href="https://news.google.com/search?q=${encodeURIComponent(query)}&hl=fr" target="_blank" style="color:#1A73E8">Google News</a></p>
  </div>`;
}

// RECHERCHE MAPS GOOGLE
function searchMaps(query) {
  $('#resultsList').innerHTML = `<iframe width="100%" height="600" src="https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed" frameborder="0"></iframe>`;
}

// RECHERCHE IMAGES WIKIMEDIA
async function searchWikimediaImages(query) {
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche d'images...</p>`;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=20&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const pages = data.query?.pages || {};
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:20px">`;
    Object.values(pages).forEach(p => { if(p.imageinfo) { const imgUrl = p.imageinfo[0].thumburl; html += `<a href="${p.imageinfo[0].url}" target="_blank"><img src="${imgUrl}" style="width:100%;height:150px;object-fit:cover;border-radius:8px"></a>`; } });
    html += `</div>`; $('#resultsList').innerHTML = html;
  } catch(e) { $('#resultsList').innerHTML = `<p style="padding:20px">Aucune image trouvée</p>`; }
}

// RECHERCHE PRINCIPALE
async function search() {
  let q = "";
  if($('#results').classList.contains('active')){ q = $('#searchInput2').value; } else { q = $('#searchInput').value; }
  q = q.trim(); if(!q) return;
  currentQuery = q; currentOffset = 0; currentFilter = 'all';
  if($('#searchInput')) $('#searchInput').value = q;
  if($('#searchInput2')) $('#searchInput2').value = q;
  saveHistory(q); showPage('results');
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche en cours...</p>`;
  await searchWikipedia(q, 0);
}

async function searchWikipedia(query, offset) {
  const langCode = currentLang.startsWith('fr')? 'fr' : 'en';
  const limit = 10;
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&sroffset=${offset}&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const results = data.query.search; const total = data.query.searchinfo.totalhits;
    if(results.length === 0) { $('#resultsList').innerHTML = `<p style="padding:20px">Aucun résultat pour "${query}"</p>`; return; }
    const pageIds = results.map(r => r.pageid).join('|');
    const detailsUrl = `https://${langCode}.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=pageimages|info&inprop=url&pithumbsize=150&format=json&origin=*`;
    const detailsRes = await fetch(detailsUrl); const detailsData = await detailsRes.json();
    displayResults(results, detailsData.query.pages, query, total, offset, limit);
  } catch(e) { $('#resultsList').innerHTML = `<p style="padding:20px">Erreur réseau.</p>`; }
}

function displayResults(results, pages, query, total, offset, limit) {
  let html = `<p style="padding:12px 24px;color:#5f6368">Résultats pour <b>${query}</b> - ${total} résultats</p>`;
  html += results.map(r => {
    const page = pages[r.pageid];
    const img = page.thumbnail? `<img src="${page.thumbnail.source}" style="width:120px;height:90px;object-fit:cover;border-radius:8px;margin-right:12px">` : '';
    const url = page.fullurl;
    return `<div style="display:flex;gap:12px;padding:12px 24px;border-bottom:1px solid #eee">${img}<div style="flex:1"><a href="${url}" target="_blank" style="font-size:18px;color:#1A73E8;text-decoration:none">${r.title}</a><div style="color:#006621;font-size:14px">${url}</div><div style="color:#4d5156;font-size:14px;line-height:1.5">${r.snippet.replace(/<[^>]*>/g, '')}...</div><a href="${url}" target="_blank" style="color:#1A73E8;font-size:13px">Lire l'article complet →</a></div></div>`;
  }).join('');
  html += `<div style="display:flex;gap:10px;justify-content:center;padding:20px">`;
  if(offset > 0) html += `<button onclick="changePage(-1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">Précédent</button>`;
  if(offset + limit < total) html += `<button onclick="changePage(1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">Suivant</button>`;
  html += `</div>`; $('#resultsList').innerHTML = html;
}

function changePage(direction) { const limit = 10; currentOffset += direction * limit; if(currentFilter === 'all') searchWikipedia(currentQuery, currentOffset); window.scrollTo(0,0); }

let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Micro non supporté.");
  recognition = new SpeechRecognition(); recognition.lang = currentLang;
  recognition.onresult = (event) => { $('#searchInput').value = event.results[0][0].transcript; search(); }; recognition.start();
}

function startImageSearch() { let input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment'; input.onchange = e => { let file = e.target.files[0]; if (!file) return; $('#searchInput').value = file.name.replace(/\.[^/.]+$/, ""); search(); }; input.click(); }
function setSecurityMode(val) { currentSecurity = val; localStorage.setItem('baobabSecurity', val); $('#strongBanner').classList.toggle('hidden', val!== 'strong'); }
function saveHistory(q) { if(!$('#saveActivity')?.checked) return; let h = JSON.parse(localStorage.getItem('hist') || '[]'); localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5))); loadHistory(); }
function loadHistory() { let h = JSON.parse(localStorage.getItem('hist') || '[]'); $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i}')">${i}</div>`).join(''); }
function clearHistory() { localStorage.removeItem('hist'); loadHistory(); alert('Historique effacé'); }

document.addEventListener('DOMContentLoaded', () => {
  if($('#langSelect')){ $('#langSelect').value = currentLang; $('#langSelect').addEventListener('change', (e) => { currentLang = e.target.value; localStorage.setItem('baobabLang', currentLang); }); }
  if($('#securityMode')) $('#securityMode').value = currentSecurity;
  document.addEventListener('click', (e) => { if(!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) $('#suggestions').classList.add('hidden'); })
  goHome();
});
