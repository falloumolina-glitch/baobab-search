function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function quickSearch(query) {
  document.getElementById('searchInput').value = query;
  search();
}

function search(e) {
  if(e) e.preventDefault();
  const q = document.getElementById('searchInput').value;
  if(!q.trim()) return;
  showPage('resultsPage');
  document.getElementById('aiText').innerText = `Résumé IA pour: ${q}`;
  document.getElementById('resultsList').innerHTML = `
    <div><p class="text-xs text-green-600">exemple.com</p><a href="#" class="text-blue-600 font-medium text-lg">Résultat pour ${q}</a><p class="text-sm text-gray-600 dark:text-gray-400">Description du résultat...</p></div>
  `;
      }
