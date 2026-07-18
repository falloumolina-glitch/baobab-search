const $ = s => document.querySelector(s);

// 1. NAVIGATION
function showPage(id) { 
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); 
  $(`#${id}`).classList.add('active'); 
}
function goHome() { showPage('home'); }

// 2. RECHERCHE + HISTORIQUE
function showSuggestions() { 
  $('#suggestions').classList.remove('hidden'); 
  loadHistory(); // Affiche l'historique
}
function hideSuggestions() {
  $('#suggestions').classList.add('hidden');
}

document.addEventListener('click', (e) => {
  if(!e.target.closest('.search-bar') && !e.target.closest('.suggestions')) {
    hideSuggestions();
  }
});

function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q.trim()) return;
  
  saveHistory(q);
  $('#searchInput2').value = q;
  hideSuggestions();
  showPage('results');
  renderFakeResults(q); // Affiche des faux résultats
}

function saveHistory(q) { 
  let h = JSON.parse(localStorage.getItem('baobab_hist') || '[]');
  h = [q, ...h.filter(x => x !== q)].slice(0, 5); // 5 max, sans doublon
  localStorage.setItem('baobab_hist', JSON.stringify(h));
}

function loadHistory() {
  let h = JSON.parse(localStorage.getItem('baobab_hist') || '[]');
  let histHTML = h.map(item => `<div class="item" onclick="quickSearch('${item}')">${item}</div>`).join('');
  $('#suggestions').innerHTML = `
    <div class="section-title">Historique récent</div>
    ${histHTML || '<div class="item">Aucun historique</div>'}
    <div class="section-title">Suggestions</div>
    <div class="item" onclick="quickSearch('baobab arbre')">baobab arbre</div>
    <div class="item" onclick="quickSearch('météo dakar')">météo dakar</div>
  `;
}

function quickSearch(term) {
  $('#searchInput').value = term;
  search();
}

// 3. FAUX RESULTATS
function renderFakeResults(q) {
  let results = '';
  for(let i=1; i<=5; i++) {
    results += `
    <div class="result-card">
      <div class="url">www.site${i}.com › page</div>
      <a class="title">Titre du résultat ${i} pour: <b>${q}</b></a>
      <div class="desc">Ceci est une description de test pour Baobab Search. Le mot <b>${q}</b> est en gras.</div>
    </div>`;
  }
  $('#resultsList').innerHTML = results;
}

// 4. PARAMETRES
function setTheme(t) { 
  document.documentElement.setAttribute('data-theme', t); 
  localStorage.setItem('baobab_theme', t);
}
function clearHistory() { 
  localStorage.removeItem('baobab_hist'); 
  alert('Historique effacé'); 
  loadHistory();
}

// 5. AU CHARGEMENT
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('baobab_theme') || 'light';
  setTheme(savedTheme);
});
