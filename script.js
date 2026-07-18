const $ = sel => document.querySelector(sel);
function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); }
function goHome() { showPage('home'); }

function search(e) {
  e.preventDefault();
  const q = $('#searchInput').value.trim();
  if(!q) return;
  localStorage.setItem('hist', JSON.stringify([q, ...JSON.parse(localStorage.getItem('hist')||'[]')].slice(0,10)));
  showPage('results');
  renderResults(q);
}

function quickSearch(term) { $('#searchInput').value = term; search(new Event('submit')); }

function renderResults(q) {
  $('#resultsList').innerHTML = `
  <div class="result">
    <a class="title" href="#">Wikipédia - Histoire du Sénégal</a>
    <div class="url">https://wikipedia.org › wiki › Histoire_du_Sénégal</div>
    <div class="desc">L'histoire du Sénégal s'étend sur plusieurs millénaires. Elle est marquée par de grands empires comme le Tekrour, le Djolof, et la colonisation française...</div>
  </div>
  <div class="result">
    <a class="title" href="#">Résultat pour: ${q}</a>
    <div class="url">https://exemple.com › ${q.toLowerCase().replace(/\s/g,'-')}</div>
    <div class="desc">Ceci est une description générée pour votre recherche "${q}". Baobab Search indexe le web pour vous donner les meilleurs résultats.</div>
  </div>`;
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  $('.icon-btn').textContent = theme === 'dark' ? '☀️' : '🌙';
}
function clearHistory() { localStorage.removeItem('hist'); alert('Historique effacé'); }

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'light';
  setTheme(saved);
});
