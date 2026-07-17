// 1. COLLE TA CLÉ ICI
const YOUTUBE_KEY = "AIzaSyD6aTPeBpKTBFNNT6LOaXbfmpMG7XWl2V4";
const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=`;

const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres", lang_region: "Langue & Région", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back: "← Retour", search_placeholder: "Recher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", ai_summary: "Résumé IA", new_tab: "Nouvel onglet", about_title: "À propos de Baobab Search", terms_title: "Conditions d'utilisation", privacy_title: "Politique de confidentialité" },
  en: { all: "All", images: "Images", videos: "Videos", news: "News", about: "About", terms: "Terms", privacy: "Privacy", settings_title: "Settings", lang_region: "Language & Region", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back: "← Back", search_placeholder: "Search on Baobab...", ai_title: "✨ AI Summary by Baobab", ai_summary: "AI Summary", new_tab: "New tab", about_title: "About Baobab Search", terms_title: "Terms of Service", privacy_title: "Privacy Policy" }
  //... garde le reste de tes langues ici
};

const trends = [{q: "angleterre - argentine", n: "20 000+"},{q: "météo demain", n: "20 000+"},{q: "messi", n: "500+"}];
let recognition;
let currentTab = 'all';

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.toggle('hidden');
}
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('Voix non supportée');
  recognition = new SpeechRecognition();
  recognition.lang = getSettings().language === 'wo'? 'fr-FR' : getSettings().language + '-FR';
  recognition.onstart = () => document.getElementById('micIcon').classList.add('text-red-500', 'animate-pulse');
  recognition.onresult = (event) => {
    document.getElementById('searchInput').value = event.results[0][0].transcript;
    search(event);
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
  document.getElementById(`tab-${tab}`).classList.add('border-blue-600', 'text-blue-600', 'font-semibold');
  search();
}

async function search(event) {
  if(event) event.preventDefault(); // <-- C'EST ÇA QUI EMPÊCHE DE SAUTER
  const query = document.getElementById('searchInput').value;
  if(!query) return;

  document.getElementById('results').innerHTML = "Chargement...";

  if(currentTab === 'videos') {
    await searchYouTube(query);
  } else {
    document.getElementById('results').innerHTML = "Résultats pour: " + query;
  }
}

async function searchYouTube(query) {
  if(YOUTUBE_KEY === "COLLE_TA_CLE_ICI") {
    document.getElementById('results').innerHTML = "Erreur: Colle ta clé YouTube dans script.js ligne 2";
    return;
  }
  try {
    const url = `${YOUTUBE_URL}${encodeURIComponent(query)}&key=${YOUTUBE_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    let html = '<div class="grid grid-cols-2 gap-4">';
    data.items.forEach(item => {
      html += `
        <div class="cursor-pointer" onclick="window.open('https://youtube.com/watch?v=${item.id.videoId}')">
          <img src="${item.snippet.thumbnails.medium.url}" class="rounded-lg w-full">
          <p class="text-sm mt-2">${item.snippet.title}</p>
        </div>
      `;
    });
    html += '</div>';
    document.getElementById('results').innerHTML = html;
  } catch(e) {
    document.getElementById('results').innerHTML = "Erreur YouTube: " + e;
  }
}
function quickSearch(query) {
  document.getElementById('searchInput').value = query;
  search();
}
function loadTrends() {
  const list = document.getElementById('trendsList');
  if(list) list.innerHTML = trends.map(t => `<div onclick="quickSearch('${t.q}')" class="p-3 hover:bg-gray-100 cursor-pointer">${t.q} <span class="text-sm text-gray-500">${t.n}</span></div>`).join('');
       }
