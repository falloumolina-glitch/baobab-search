const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", my_photos: "Mes Photos", my_docs: "Mes Documents", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres", lang_region: "Langue & Région", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back: "← Retour", search_placeholder: "Recher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", ai_summary: "Résumé IA", new_tab: "Nouvel onglet", about_title: "À propos de Baobab Search", terms_title: "Conditions d'utilisation", privacy_title: "Politique de confidentialité" },
  en: { all: "All", images: "Images", videos: "Videos", news: "News", my_photos: "My Photos", my_docs: "My Documents", about: "About", terms: "Terms", privacy: "Privacy", settings_title: "Settings", lang_region: "Language & Region", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back: "← Back", search_placeholder: "Search on Baobab...", ai_title: "✨ AI Summary by Baobab", ai_summary: "AI Summary", new_tab: "New tab", about_title: "About Baobab Search", terms_title: "Terms of Service", privacy_title: "Privacy Policy" },
  wo: { all: "Lépp", images: "Nataal", videos: "Video", news: "Lëndëm", my_photos: "Nataal yi ma", my_docs: "Liggeey yi ma", about: "Ci Baobab", terms: "Yoon yi", privacy: "Sutura", settings_title: "Jëfandikoo", lang_region: "Làkk ak Dëkku", appearance: "Nataal", light_theme: "Leer", dark_theme: "Guddi", save: "Denc", saved: "✓ Denc na!", back: "← Dellu", search_placeholder: "Laaj Baobab...", ai_title: "✨ Résumé AI", ai_summary: "Résumé AI", new_tab: "Fenetra bes", about_title: "Ci Baobab Search", terms_title: "Yoon yi jëfandikoo", privacy_title: "Sutura" }
};

const trends = [
  {q: "angleterre - argentine", n: "20 000+"},
  {q: "météo demain", n: "20 000+"},
  {q: "messi", n: "500+"}
];

let recognition;
let currentTab = 'all';

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
    if(file) alert(`${type === 'image'? 'Photo' : 'Document'} sélectionné: ${file.name}`);
  }
}

function takePhoto() {
  const input = document.getElementById('fileInput');
  input.accept = 'image/*';
  input.capture = 'environment';
  input.click();
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('Voix non supportée');
  recognition = new SpeechRecognition();
  recognition.lang = getSettings().language === 'wo'? 'fr-FR' : getSettings().language + '-FR';
  recognition.onstart = () => document.getElementById('micIcon').classList.add('text-red-500', 'animate-pulse');
  recognition.onresult = (event) => {
    document.getElementById('searchInput').value = event.results[0][0].transcript;
    search();
  };
  recognition.onend = () => document.getElementById('micIcon').classList.remove('text-red-500', 'animate-pulse');
  recognition.start();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-blue-600', 'text-blue-600', 'font-semibold');
    btn.classList.add('border-transparent', 'text-gray-500');
  });
  const activeBtn = document.getElementById(`tab-${tab}`);
  activeBtn.classList.add('border-blue-600', 'text-blue-600', 'font-semibold');
  activeBtn.classList.remove('border-transparent', 'text-gray-500');
  search(); // Relance la recherche avec le nouvel onglet
}

function search(e) {
  if(e) e.preventDefault();
  const query = document.getElementById('searchInput').value;
  if(!query) return;
  showPage('resultsPage');
  document.getElementById('aiText').innerText = `Voici un résumé IA pour: ${query} - Onglet: ${currentTab}`;
  document.getElementById('resultCount').innerText = `Environ 1 230 000 résultats pour ${query}`;
  document.getElementById('resultsList').innerHTML = `<div class="p-4">Résultats pour "${query}" dans l'onglet ${currentTab}</div>`;
}

function quickSearch(q) {
  document.getElementById('searchInput').value = q;
  search();
}

function showPage(pageId) {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.add('hidden');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function getSettings() {
  return {
    language: localStorage.getItem('language') || 'fr',
    aiSummary: localStorage.getItem('aiSummary')!== 'false',
    openNewTab: localStorage.getItem('openNewTab') === 'true',
    theme: localStorage.getItem('theme') || 'light'
  }
}

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  applyTranslations();
}

function applyTranslations() {
  const lang = getSettings().language;
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if(translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
    const key = el.getAttribute('data-lang-placeholder');
    if(translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
  });
  document.getElementById('language').value = lang;
}

function saveSettings() {
  const lang = document.getElementById('language').value;
  const ai = document.getElementById('aiSummaryToggle').checked;
  const tab = document.getElementById('openNewTab').checked;
  const theme = document.querySelector('input[name="theme"]:checked').value;
  localStorage.setItem('language', lang);
  localStorage.setItem('aiSummary', ai);
  localStorage.setItem('openNewTab', tab);
  localStorage.setItem('theme', theme);
  if(theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
  applyTranslations();
}

document.addEventListener('DOMContentLoaded', () => {
  loadTrends();
  applyTranslations();
  const settings = getSettings();
  document.getElementById('aiSummaryToggle').checked = settings.aiSummary;
  document.getElementById('openNewTab').checked = settings.openNewTab;
  document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
  if(settings.theme === 'dark') document.documentElement.classList.add('dark');
});

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
