const translations = {
  fr: { history: "🕒 Historique", settings: "⚙️ Paramètres", subtitle: "L'IA de la connaissance", search_placeholder: "Demande à Baobab IA...", search_btn: "Baobab Search", lucky_btn: "J'ai de la chance", about: "À propos", privacy: "Confidentialité", terms: "Conditions", all: "Tous", images: "Images", news: "Actualités", ai_title: "✨ Résumé IA par Baobab", settings_title: "Paramètres", search_settings: "Recherche", ai_summary: "Afficher le résumé IA", new_tab: "Ouvrir dans un nouvel onglet", results_per_page: "Nombre de résultats", region_lang: "Région et Langue", language: "Langue de l'interface", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back_home: "← Retour", history_title: "Historique de recherche", clear_history: "Effacer l'historique", about_title: "À propos de Baobab", about_text: "Baobab est le premier moteur de recherche intelligent d'Afrique." },
  en: { history: "🕒 History", settings: "⚙️ Settings", subtitle: "The AI of Knowledge", search_placeholder: "Ask Baobab AI...", search_btn: "Baobab Search", lucky_btn: "I'm Feeling Lucky", about: "About", privacy: "Privacy", terms: "Terms", all: "All", images: "Images", news: "News", ai_title: "✨ AI Summary by Baobab", settings_title: "Settings", search_settings: "Search", ai_summary: "Show AI Summary", new_tab: "Open results in new tab", results_per_page: "Results per page", region_lang: "Region and Language", language: "Interface Language", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back_home: "← Back", history_title: "Search History", clear_history: "Clear History", about_title: "About Baobab", about_text: "Baobab is Africa's first intelligent search engine." },
  wo: { history: "🕒 Dencitaay", settings: "⚙️ Jëfandikoo", subtitle: "AI bi ci xam-xam", search_placeholder: "Laaj Baobab AI...", search_btn: "Baobab Search", lucky_btn: "Ma nekk na ci wàllu ma", about: "Ci Baobab", privacy: "Sutura", terms: "Ndigaalu", all: "Lépp", images: "Nataal", news: "Lumiy jëf", ai_title: "✨ Résumé AI bu Baobab", settings_title: "Jëfandikoo", search_settings: "Laaj", ai_summary: "Wone Résumé AI", new_tab: "Ubi ci fereet bu bees", results_per_page: "Limuy natte", region_lang: "Reew ak Làkk", language: "Làkk bu jëfandikoo", appearance: "Nataal", light_theme: "Leer", dark_theme: "Guddi", save: "Denc", saved: "✓ Jëfandikoo denc na!", back_home: "← Dellu", history_title: "Dencitaay bi", clear_history: "Faj dencitaay bi", about_title: "Ci Baobab", about_text: "Baobab mooy moteur bu ñaari bi ci Afrig." }
};

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(el => { const key = el.getAttribute('data-lang'); if(translations && translations[key]) el.innerText = translations[key]; });
  document.querySelectorAll('[data-lang-placeholder]').forEach(el => { const key = el.getAttribute('data-lang-placeholder'); if(translations && translations[key]) el.placeholder = translations[key]; });
}

function showPage(pageId) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); document.getElementById(pageId).classList.add('active'); if(pageId === 'settingsPage') loadSettingsUI(); if(pageId === 'historyPage') loadHistory(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

function getSettings() { return { aiSummary: localStorage.getItem('aiSummary')!== 'false', openNewTab: localStorage.getItem('openNewTab')!== 'false', resultsPerPage: localStorage.getItem('resultsPerPage') || '10', language: localStorage.getItem('language') || 'fr', theme: localStorage.getItem('theme') || 'light' }; }

function loadSettingsUI() {
  const s = getSettings();
  document.getElementById('aiSummaryToggle').checked = s.aiSummary;
  document.getElementById('openNewTab').checked = s.openNewTab;
  document.getElementById('resultsPerPage').value = s.resultsPerPage;
  document.getElementById('language').value = s.language;
  document.querySelector(`input[name="theme"][value="${s.theme}"]`).checked = true;
}

const fakeDB = { "messi": { ai: "Lionel Messi est un footballeur argentin. 8 Ballons d'Or.", results: [{url: "wikipedia.org › Lionel_Messi", title: "Lionel Messi - Wikipédia", desc: "Lionel Andrés Messi est un footballeur international argentin."}] }, "baobab": { ai: "Le baobab est un arbre qui peut vivre plus de 1000 ans.", results: [{url: "baobab.sn", title: "Baobab Search", desc: "Le premier moteur de recherche intelligent d'Afrique."}] }, "default": { ai: "Essayez 'messi' ou 'baobab' pour tester.", results: [] } };

function search(e) {
  if(e) e.preventDefault();
  const s = getSettings();
  const q = document.getElementById('searchInput').value || document.getElementById('searchInput2').value;
  if(!q.trim()) return;
  showPage('resultsPage');
  document.getElementById('searchInput2').value = q;
  const data = fakeDB[q.toLowerCase()] || fakeDB['default'];
  document.getElementById('aiSummary').style.display = s.aiSummary? 'block' : 'none';
  document.getElementById('aiText').innerText = data.ai;
  document.getElementById('resultCount').innerText = `Environ ${data.results.length} résultats pour "${q}"`;
  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  data.results.slice(0, parseInt(s.resultsPerPage)).forEach(r => {
    const t = s.openNewTab? 'target="_blank"' : '';
    list.innerHTML += `<div><div class="text-sm text-green-700 dark:text-green-400">${r.url}</div><a href="#" ${t} class="text-xl text-blue-700 dark:text-blue-400 hover:underline font-medium">${r.title}</a><p class="text-sm text-gray-700 dark:text-gray-300 mt-1">${r.desc}</p></div>`;
  });
  let h = JSON.parse(localStorage.getItem('searchHistory')) || [];
  h = h.filter(i => i.query.toLowerCase()!== q.toLowerCase());
  h.unshift({query: q, date: new Date().toISOString()});
  localStorage.setItem('searchHistory', JSON.stringify(h.slice(0, 50)));
}

function luckySearch(e) { if(e) e.preventDefault(); document.getElementById('searchInput').value = 'baobab'; search(e); }

function saveSettings() {
  localStorage.setItem('aiSummary', document.getElementById('aiSummaryToggle').checked);
  localStorage.setItem('openNewTab', document.getElementById('openNewTab').checked);
  localStorage.setItem('resultsPerPage', document.getElementById('resultsPerPage').value);
  localStorage.setItem('language', document.getElementById('language').value);
  localStorage.setItem('theme', document.querySelector('input[name="theme"]:checked').value);
  applyTheme(document.querySelector('input[name="theme"]:checked').value);
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

function clearHistory(){ if(confirm("Effacer tout?")){ localStorage.removeItem('searchHistory'); alert('Effacé'); loadHistory(); } }

function loadHistory(){ const list = document.getElementById('historyList'); const h = JSON.parse(localStorage.getItem('searchHistory')) || []; if(h.length === 0){ list.innerHTML = "<p class='text-gray-500'>Aucune recherche</p>"; return; } list.innerHTML = ''; h.forEach(i => { const d = new Date(i.date).toLocaleString('fr-FR'); list.innerHTML += `<div onclick="rerunSearch('${i.query}')" class="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"><p class="font-semibold">${i.query}</p><p class="text-xs text-gray-500">${d}</p></div>`; }); }

function rerunSearch(q){ document.getElementById('searchInput').value = q; showPage('homePage'); search(); }

function applyTheme(t) { if(t === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }

document.addEventListener('DOMContentLoaded', () => {
  const s = getSettings();
  changeLanguage(s.language);
  applyTheme(s.theme);
  const formHome = document.getElementById('searchFormHome');
  const formResults = document.getElementById('searchFormResults');
  formHome.addEventListener('focusin', () => formHome.classList.add('form-focus'));
  formHome.addEventListener('focusout', () => formHome.classList.remove('form-focus'));
  formResults.addEventListener('focusin', () => formResults.classList.add('form-focus'));
  formResults.addEventListener('focusout', () => formResults.classList.remove('form-focus'));
});
