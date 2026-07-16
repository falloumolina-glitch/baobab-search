const translations = {
  fr: { settings: "Paramètres", subtitle: "L'IA de la connaissance", search_placeholder: "Demande à Baobab IA...", search_btn: "Baobab Search", lucky_btn: "J'ai de la chance", privacy: "Confidentialité", terms: "Conditions", ai_title: "✨ Résumé IA", settings_title: "Paramètres", search_settings: "Recherche", ai_summary: "Afficher le résumé IA", new_tab: "Ouvrir dans un nouvel onglet", language: "Langue", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back_home: "← Retour" },
  en: { settings: "Settings", subtitle: "The AI of Knowledge", search_placeholder: "Ask Baobab AI...", search_btn: "Baobab Search", lucky_btn: "I'm Feeling Lucky", privacy: "Privacy", terms: "Terms", ai_title: "✨ AI Summary", settings_title: "Settings", search_settings: "Search", ai_summary: "Show AI Summary", new_tab: "Open results in new tab", language: "Language", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back_home: "← Back" },
  wo: { settings: "Jëfandikoo", subtitle: "AI bi ci xam-xam", search_placeholder: "Laaj Baobab AI...", search_btn: "Baobab Search", lucky_btn: "Ma nekk na ci wàllu ma", privacy: "Sutura", terms: "Ndigaalu", ai_title: "✨ Résumé AI", settings_title: "Jëfandikoo", search_settings: "Laaj", ai_summary: "Wone Résumé AI", new_tab: "Ubi ci fereet bu bees", language: "Làkk", appearance: "Nataal", light_theme: "Leer", dark_theme: "Guddi", save: "Denc", saved: "✓ Denc na!", back_home: "← Dellu" }
};

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if(translations[key]) el.innerText = translations[key];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
    const key = el.getAttribute('data-lang-placeholder');
    if(translations[key]) el.placeholder = translations[key];
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function getSettings() {
  return {
    aiSummary: localStorage.getItem('aiSummary')!== 'false',
    openNewTab: localStorage.getItem('openNewTab')!== 'false',
    language: localStorage.getItem('language') || 'fr',
    theme: localStorage.getItem('theme') || 'light'
  };
}

const fakeDB = {
  "messi": { ai: "Lionel Messi est un footballeur argentin.", results: [{url: "wikipedia.org", title: "Lionel Messi", desc: "Footballeur argentin."}] },
  "default": { ai: "Essayez 'messi'", results: [] }
};

function search(e) {
  e.preventDefault();
  const s = getSettings();
  const q = document.getElementById('searchInput').value || document.getElementById('searchInput2').value;
  if(!q.trim()) return;
  showPage('resultsPage');
  document.getElementById('searchInput2').value = q;
  const data = fakeDB[q.toLowerCase()] || fakeDB['default'];
  document.getElementById('aiSummary').style.display = s.aiSummary? 'block' : 'none';
  document.getElementById('aiText').innerText = data.ai;
  document.getElementById('resultCount').innerText = data.results.length + " résultats";
  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  data.results.forEach(r => {
    const t = s.openNewTab? 'target="_blank"' : '';
    list.innerHTML += `<div><a href="#" ${t} class="text-lg text-blue-700 dark:text-blue-400 hover:underline">${r.title}</a><p class="text-sm">${r.desc}</p></div>`;
  });
}

function luckySearch(e) {
  e.preventDefault();
  document.getElementById('searchInput').value = 'messi';
  search(e);
}

function saveSettings() {
  localStorage.setItem('aiSummary', document.getElementById('aiSummaryToggle').checked);
  localStorage.setItem('openNewTab', document.getElementById('openNewTab').checked);
  localStorage.setItem('language', document.getElementById('language').value);
  localStorage.setItem('theme', document.querySelector('input[name="theme"]:checked').value);
  applyTheme(document.querySelector('input[name="theme"]:checked').value);
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

function applyTheme(t) {
  if(t === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const s = getSettings();
  document.getElementById('aiSummaryToggle').checked = s.aiSummary;
  document.getElementById('openNewTab').checked = s.openNewTab;
  document.getElementById('language').value = s.language;
  document.querySelector(`input[name="theme"][value="${s.theme}"]`).checked = true;
  changeLanguage(s.language);
  applyTheme(s.theme);
});
