const $ = s => document.querySelector(s);
function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); }
function goHome() { showPage('home'); }
function showSuggestions() { $('#suggestions').classList.remove('hidden'); }
function liveSuggest() {}

function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;
  $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  $('#resultsList').innerHTML = `
  <div class="result-card">
    <div class="url">wikipedia.org › wiki › Histoire_du_Sénégal</div>
    <a class="title">Histoire du <b>Sénégal</b> - Wikipédia</a>
    <div class="desc">L'histoire du <b>Sénégal</b> s'étend sur plusieurs millénaires. Elle est marquée par de grands empires...</div>
  </div>`;
}

function startVoice() { alert('Recherche vocale bientôt disponible'); }
function startImageSearch() { alert('Recherche par image bientôt disponible'); }

function saveHistory(q) { 
  let h = JSON.parse(localStorage.getItem('hist') || '[]');
  localStorage.setItem('hist', JSON.stringify([q, ...h.filter(x => x !== q)].slice(0,5)));
}
function clearHistory() { localStorage.removeItem('hist'); alert('Historique effacé'); }
function setTheme(t) { document.documentElement.setAttribute('data-theme', t); }
function setFontSize(s) { document.body.style.fontSize = s; }

// Fermer suggestions en cliquant dehors
document.addEventListener('click', (e) => {
  if(!e.target.closest('.search-bar') && !e.target.closest('.suggestions')) {
    $('#suggestions').classList.add('hidden');
  }
})
