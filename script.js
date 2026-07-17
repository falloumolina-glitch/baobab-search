// 1. COLLE TA CLÉ YOUTUBE ICI
const YOUTUBE_KEY = "COLLE_TA_CLE_ICI";

const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", my_photos: "Mes Photos", my_docs: "Mes Documents", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres", lang_region: "Langue & Région", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back: "← Retour", search_placeholder: "Recher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", ai_summary: "Résumé IA", new_tab: "Nouvel onglet", about_title: "À propos de Baobab Search", terms_title: "Conditions d'utilisation", privacy_title: "Politique de confidentialité" },
  en: { all: "All", images: "Images", videos: "Videos", news: "News", my_photos: "My Photos", my_docs: "My Documents", about: "About", terms: "Terms", privacy: "Privacy", settings_title: "Settings", lang_region: "Language & Region", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back: "← Back", search_placeholder: "Search on Baobab...", ai_title: "✨ AI Summary by Baobab", ai_summary: "AI Summary", new_tab: "New tab", about_title: "About Baobab Search", terms_title: "Terms of Service", privacy_title: "Privacy Policy" },
  wo: { all: "Lépp", images: "Nataal", videos: "Video", news: "Lëndëm", my_photos: "Nataal yi ma", my_docs: "Liggeey yi ma", about: "Ci Baobab", terms: "Yoon yi", privacy: "Sutura", settings_title: "Jëfandikoo", lang_region: "Làkk ak Dëkku", appearance: "Nataal", light_theme: "Leer", dark_theme: "Guddi", save: "Denc", saved: "✓ Denc na!", back: "← Dellu", search_placeholder: "Laaj Baobab...", ai_title: "✨ Résumé AI", ai_summary: "Résumé AI", new_tab: "Fenetra bes", about_title: "Ci Baobab Search", terms_title: "Yoon yi", privacy_title: "Sutura" }
};

const trends = [
  {q: "angleterre - argentine", n: "20 000+"},
  {q: "météo demain", n: "20 000+"},
  {q: "messi", n: "500+"}
];

let recognition;
let currentTab = 'all';
let currentQuery = '';

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
  if(currentQuery) search(); // Relance la recherche avec le nouvel onglet
}

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if(translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
    const key = el.getAttribute('data-lang-placeholder');
    if(translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
  });
}

function getSettings() {
  return {
    language: localStorage.getItem('language') || 'fr',
    theme: localStorage.getItem('theme') || 'light',
    aiSummary: localStorage.getItem('aiSummary')!== 'false',
    openNewTab: localStorage.getItem('openNewTab') === 'true'
  }
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
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.add('hidden');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function quickSearch(query) {
  document.getElementById('searchInput').value = query;
  search();
}

async function search(event) {
  if(event) event.preventDefault(); // BLOQUE LE SAUT
  const query = document.getElementById('searchInput').value;
  if(!query) return;

  currentQuery = query;
  showPage('resultsPage'); // Affiche la page résultats avec les onglets

  document.getElementById('resultCount').innerText = `Résultats pour "${query}"`;
  document.getElementById('resultsList').innerHTML = "Chargement...";
  document.getElementById('aiText').innerText = `Voici un résumé pour: ${query}`;

  if(currentTab === 'videos') {
    await searchYouTube(query);
  } else {
    document.getElementById('resultsList').innerHTML = `<p>Résultats "${currentTab}" pour: <b>${query}</b></p>`;
  }
}

async function searchYouTube(query) {
  if(YOUTUBE_KEY === "COLLE_TA_CLE_ICI") {
    document.getElementById('resultsList').innerHTML = "Erreur: Colle ta clé YouTube dans script.js ligne 2";
    return;
  }
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&key=${YOUTUBE_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    let html = '<div class="grid grid-cols-2 gap-4">';
    data.items.forEach(item => {
      if(item.id.videoId){
        html += `
          <div class="cursor-pointer" onclick="window.open('https://youtube.com/watch?v=${item.id.videoId}', '_blank')">
            <img src="${item.snippet.thumbnails.medium.url}" class="rounded-lg w-full">
            <p class="text-sm mt-2 line-clamp-2">${item.snippet.title}</p>
          </div>
        `;
      }
    });
    html += '</div>';
    document.getElementById('resultsList').innerHTML = html;
  } catch(e) {
    document.getElementById('resultsList').innerHTML = "Erreur: " + e;
  }
}

function saveSettings() {
  localStorage.setItem('language', document.getElementById('language').value);
  localStorage.setItem('theme', document.querySelector('input[name="theme"]:checked').value);
  localStorage.setItem('aiSummary', document.getElementById('aiSummaryToggle').checked);
  localStorage.setItem('openNewTab', document.getElementById('openNewTab').checked);
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

// BLOQUE LE RECHARGEMENT DU FORM
document.getElementById('searchForm').addEventListener('submit', function(e){
  e.preventDefault();
  search();
});

// Au chargement
document.addEventListener('DOMContentLoaded', () => {
  loadTrends();
  const settings = getSettings();
  changeLanguage(settings.language);
  document.getElementById('language').value = settings.language;
  document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
  document.getElementById('aiSummaryToggle').checked = settings.aiSummary;
  document.getElementById('openNewTab').checked = settings.openNewTab;
});
