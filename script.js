const translations = {
  fr: { my_photos: "Mes Photos", my_docs: "Mes Documents", take_photo: "Prendre une photo", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres", lang_region: "Langue & Région", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back: "← Retour", search_placeholder: "Rechercher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", about_title: "À propos de Baobab Search", about_p1: "Bienvenue sur Baobab Search, un moteur de recherche inspiré du baobab.", terms_title: "Conditions d'utilisation", terms_p1: "1. Baobab Search est destiné à un usage légal.", privacy_title: "Politique de confidentialité", privacy_p1: "Votre vie privée est importante pour nous." },
  en: { my_photos: "My Photos", my_docs: "My Documents", take_photo: "Take a photo", about: "About", terms: "Terms", privacy: "Privacy", settings_title: "Settings", lang_region: "Language & Region", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back: "← Back", search_placeholder: "Search on Baobab...", ai_title: "✨ AI Summary by Baobab", about_title: "About Baobab Search", about_p1: "Welcome to Baobab Search, a search engine inspired by the baobab.", terms_title: "Terms of Use", terms_p1: "1. Baobab Search is for legal use only.", privacy_title: "Privacy Policy", privacy_p1: "Your privacy is important to us." },
  wo: { my_photos: "Nataal yi ma", my_docs: "Liggeey yi ma", take_photo: "Fotoo", about: "Ci Baobab", terms: "Yoon yi", privacy: "Sutura", settings_title: "Jëfandikoo", lang_region: "Làkk ak Dëkku", appearance: "Nataal", light_theme: "Leer", dark_theme: "Guddi", save: "Denc", saved: "✓ Denc na!", back: "← Dellu", search_placeholder: "Laaj Baobab...", ai_title: "✨ Résumé AI", about_title: "Ci Baobab Search", about_p1: "Dalal ak jàmm ci Baobab Search.", terms_title: "Yoonu Jëfandikoo", terms_p1: "1. Baobab Search wara jëf ci wàllu yoon.", privacy_title: "Sutura", privacy_p1: "Sutura la nu daj." }
};

const trends = [
  {q: "angleterre - argentine", n: "20 000+"},
  {q: "météo demain", n: "20 000+"},
  {q: "messi", n: "500+"}
];

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.toggle('hidden');
}

function uploadFile(type) {
  const input = document.getElementById('fileInput');
  input.accept = type === 'image'? 'image/*' : '*/*';
  input.click();
  input.onchange = (e) => {
    const file = e.target.files[0];
    if(file) alert(`${type === 'image'? 'Photo' : 'Document'}: ${file.name}`);
  }
}

function takePhoto() {
  const input = document.getElementById('fileInput');
  input.accept = 'image/*';
  input.capture = 'environment';
  input.click();
}

function startVoice() {
  document.getElementById('micIcon').classList.add('text-red-500');
  alert('Micro activé - Bientôt');
  setTimeout(() => document.getElementById('micIcon').classList.remove('text-red-500'), 1000);
}

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if(translations[lang][key]) el.innerText = translations[lang][key];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
    const key = el.getAttribute('data-lang-placeholder');
    if(translations[lang][key]) el.placeholder = translations[lang][key];
  });
}

function loadTrends() {
  const list = document.getElementById('trendsList');
  list.innerHTML = trends.map(t => `
    <div onclick="quickSearch('${t.q}')" class="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
      <div class="flex items-center gap-4">
        <svg class="w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        <span>${t.q}</span>
      </div>
      <span class="text-sm text-gray-500">${t.n}</span>
    </div>
  `).join('');
}

function showPage(pageId) {
  toggleSidebar();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if(pageId === 'settingsPage') loadSettingsUI();
}

function getSettings() {
  return { theme: localStorage.getItem('theme') || 'light', language: localStorage.getItem('language') || 'fr' };
}

function loadSettingsUI() {
  const s = getSettings();
  document.getElementById('language').value = s.language;
  document.querySelector(`input[name="theme"][value="${s.theme}"]`).checked = true;
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
  document.getElementById('aiText').innerText = `Résumé pour: ${q}`;
  document.getElementById('resultCount').innerText = `1 résultat`;
}

function saveSettings() {
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
  loadTrends();
  const s = getSettings();
  changeLanguage(s.language);
  applyTheme(s.theme);
});
