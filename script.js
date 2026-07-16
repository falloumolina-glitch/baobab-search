// MET TES CLES ICI - ELLES SONT CACHEES AUX UTILISATEURS
const API_KEY = "COLLE_TA_CLE_ICI";
const CX = "COLLE_TON_CX_ICI";

const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", my_photos: "Mes Photos", my_docs: "Mes Documents", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres", lang_region: "Langue & Région", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back: "← Retour", search_placeholder: "Recher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", about_title: "À propos de Baobab Search", safe_off: "Désactivé", safe_medium: "Standard", safe_high: "Renforcé" }
};

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
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  recognition = new SpeechRecognition();
  recognition.lang = getSettings().language + '-FR';
  recognition.onstart = () => document.getElementById('micIcon').classList.add('text-red-500');
  recognition.onresult = (event) => {
    document.getElementById('searchInput').value = event.results[0][0].transcript;
    search();
  };
  recognition.onend = () => document.getElementById('micIcon').classList.remove('text-red-500');
  recognition.start();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-blue-600', 'text-blue-600', 'font-semibold');
    btn.classList.add('border-transparent', 'text-gray-500');
  });
  document.getElementById(`tab-${tab}`).classList.add('border-blue-600', 'text-blue-600', 'font-semibold');
  search();
}

function showPage(pageId) {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.add('hidden');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if(pageId === 'settingsPage') loadSettingsUI();
}

function getSettings() {
  return {
    safeSearch: localStorage.getItem('safeSearch') || 'medium',
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'fr'
  };
}

function loadSettingsUI() {
  const s = getSettings();
  document.getElementById('safeSearch').value = s.safeSearch;
  document.getElementById('language').value = s.language;
  document.querySelector(`input[name="theme"][value="${s.theme}"]`).checked = true;
}

function saveSettings() {
  localStorage.setItem('safeSearch', document.getElementById('safeSearch').value);
  localStorage.setItem('theme', document.querySelector('input[name="theme"]:checked').value);
  applyTheme(document.querySelector('input[name="theme"]:checked').value);
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

function applyTheme(t) {
  if(t === 'dark') document.documentElement.classList.add('dark');
  else if(t === 'light') document.documentElement.classList.remove('dark');
  else {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }
}

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

async function search(e) {
  if(e) e.preventDefault();
  const {safeSearch} = getSettings();
  const q = document.getElementById('searchInput').value;
  if(!q.trim()) return;
  if(API_KEY === "COLLE_TA_CLE_ICI") return alert('Le dev doit coller la clé API dans script.js');

  showPage('resultsPage');
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('resultsList').innerHTML = '';

  let searchType = '';
  if(currentTab === 'images') searchType = '&searchType=image';

  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(q)}&safe=${safeSearch}${searchType}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById('loading').classList.add('hidden');
    if(data.items) {
      document.getElementById('resultCount').innerText = `Environ ${data.searchInformation.totalResults} résultats`;
      document.getElementById('aiText').innerText = `Résultats pour: ${q}`;
      displayResults(data.items);
    }
  } catch(err) {
    document.getElementById('loading').classList.add('hidden');
    alert('Erreur de recherche');
  }
}

function displayResults(items) {
  const list = document.getElementById('resultsList');
  if(currentTab === 'images') {
    list.className = 'grid grid-cols-3 gap-2';
    list.innerHTML = items.map(item => `
      <a href="${item.image.contextLink}" target="_blank" class="block">
        <img src="${item.link}" class="w-full h-32 object-cover rounded-lg" loading="lazy">
      </a>
    `).join('');
  } else {
    list.className = 'space-y-5';
    list.innerHTML = items.map(item => `
      <div>
        <a href="${item.link}" target="_blank" class="text-blue-600 hover:underline text-lg font-medium">${item.title}</a>
        <p class="text-green-700 dark:text-green-400 text-sm">${item.displayLink}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">${item.snippet}</p>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const s = getSettings();
  changeLanguage(s.language);
  applyTheme(s.theme);
});
