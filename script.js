const trends = [
  {q: "angleterre - argentine", n: "20 000+"},
  {q: "météo demain", n: "20 000+"},
  {q: "météo", n: "10 000+"},
  {q: "dette", n: "2 000+"},
  {q: "messi", n: "500+"},
  {q: "final coupe du monde 2026", n: "1 000+"}
];

const fakeDB = {
  "messi": { ai: "Lionel Messi est un footballeur argentin. 8 Ballons d'Or. Joue à l'Inter Miami.", results: [{url: "wikipedia.org › Lionel_Messi", title: "Lionel Messi - Wikipédia", desc: "Lionel Andrés Messi est un footballeur international argentin."}] },
  "météo": { ai: "A Dakar il fait 32°C et ensoleillé aujourd'hui.", results: [{url: "meteo.sn", title: "Météo Dakar", desc: "Prévisions météo pour les 7 prochains jours."}] },
  "default": { ai: `Voici les résultats pour "${q}"`, results: [{url: "baobab.sn", title: "Baobab IA", desc: "Le moteur de recherche intelligent d'Afrique."}] }
};

function loadTrends() {
  const list = document.getElementById('trendsList');
  list.innerHTML = trends.map(t => `
    <div onclick="quickSearch('${t.q}')" class="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
      <div class="flex items-center gap-4">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        <span>${t.q}</span>
      </div>
      <span class="text-sm text-gray-500">${t.n}</span>
    </div>
  `).join('');
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if(pageId === 'settingsPage') loadSettingsUI();
}

function getSettings() {
  return {
    aiSummary: localStorage.getItem('aiSummary')!== 'false',
    openNewTab: localStorage.getItem('openNewTab')!== 'false',
    safeSearch: localStorage.getItem('safeSearch') === 'true',
    resultsPerPage: localStorage.getItem('resultsPerPage') || '10',
    language: localStorage.getItem('language') || 'fr',
    theme: localStorage.getItem('theme') || 'light'
  };
}

function loadSettingsUI() {
  const s = getSettings();
  document.getElementById('aiSummaryToggle').checked = s.aiSummary;
  document.getElementById('openNewTab').checked = s.openNewTab;
  document.getElementById('safeSearch').checked = s.safeSearch;
  document.getElementById('resultsPerPage').value = s.resultsPerPage;
  document.getElementById('language').value = s.language;
  document.querySelector(`input[name="theme"][value="${s.theme}"]`).checked = true;
}

function quickSearch(query) {
  document.getElementById('searchInput').value = query;
  search();
}

function search(e) {
  if(e) e.preventDefault();
  const s = getSettings();
  const q = document.getElementById('searchInput').value;
  if(!q.trim()) return;
  showPage('resultsPage');
  const data = fakeDB[q.toLowerCase()] || {ai: `Résumé IA pour: ${q}`, results: []};
  document.getElementById('aiSummary').style.display = s.aiSummary? 'block' : 'none';
  document.getElementById('aiText').innerText = data.ai;
  document.getElementById('resultCount').innerText = `${data.results.length} résultats`;
  const list = document.getElementById('resultsList');
  list.innerHTML = data.results.slice(0, s.resultsPerPage).map(r => `
    <div><p class="text-xs text-green-700 dark:text-green-400">${r.url}</p><a href="#" ${s.openNewTab?'target="_blank"':''} class="text-lg text-blue-700 dark:text-blue-400 hover:underline font-medium">${r.title}</a><p class="text-sm text-gray-600 dark:text-gray-400">${r.desc}</p></div>
  `).join('') || "<p>Aucun résultat</p>";
  let h = JSON.parse(localStorage.getItem('searchHistory')) || [];
  h.unshift({query: q, date: new Date().toLocaleString()});
  localStorage.setItem('searchHistory', JSON.stringify(h.slice(0, 20)));
}

function saveSettings() {
  localStorage.setItem('aiSummary', document.getElementById('aiSummaryToggle').checked);
  localStorage.setItem('openNewTab', document.getElementById('openNewTab').checked);
  localStorage.setItem('safeSearch', document.getElementById('safeSearch').checked);
  localStorage.setItem('resultsPerPage', document.getElementById('resultsPerPage').value);
  localStorage.setItem('language', document.getElementById('language').value);
  localStorage.setItem('theme', document.querySelector('input[name="theme"]:checked').value);
  applyTheme(document.querySelector('input[name="theme"]:checked').value);
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

function clearHistory() {
  if(confirm("Effacer tout l'historique?")) localStorage.removeItem('searchHistory');
}

function applyTheme(t) {
  if(t === 'dark') document.documentElement.classList.add('dark');
  else if(t === 'light') document.documentElement.classList.remove('dark');
  else { // auto
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTrends();
  const s = getSettings();
  applyTheme(s.theme);
});
