function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); document.getElementById(id).classList.add('active'); }
function goHome() { showPage('home'); }

function search(e) {
  e.preventDefault();
  let q = document.getElementById('searchInput')?.value || document.getElementById('searchInput2')?.value;
  document.getElementById('searchInput2').value = q;
  showPage('results');
  document.getElementById('resultsList').innerHTML = `
    <div class="result">
      <a class="title">Titre du résultat</a>
      <div class="url">www.site.com</div>
      <div class="desc">Petite description du contenu trouvé...</div>
    </div>
    <div class="result">
      <a class="title">Résultat pour: ${q}</a>
      <div class="url">www.exemple.com</div>
      <div class="desc">Ceci est une description de test pour Baobab Search v0.1</div>
    </div>
  `;
}
function quickSearch(type) { document.getElementById('searchInput').value = type; search(new Event('submit')); }
function setTheme(t) { document.documentElement.setAttribute('data-theme', t); }
