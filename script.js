// 1. COLLE TA CLÉ ICI
const YOUTUBE_KEY = "AIzaSyD6aTPeBpKTBFNNT6LOaXbfmpMG7XWl2V4";
const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=`;

const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", settings_title: "Paramètres", search_placeholder: "Recher sur Baobab..." },
  en: { all: "All", images: "Images", videos: "Videos", news: "News", settings_title: "Settings", search_placeholder: "Search on Baobab..." }
};

const trends = [{q: "messi", n: "500+"},{q: "météo demain", n: "20 000+"}];
let recognition;
let currentTab = 'all';

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.toggle('hidden');
}
function takePhoto() {
  document.getElementById('fileInput').click();
}
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('Voix non supportée');
  recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
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

async function search() {
  const query = document.getElementById('searchInput').value;
  if(!query) return;
  document.getElementById('results').innerHTML = "Chargement...";

  if(currentTab === 'videos') {
    await searchYouTube(query);
  } else {
    document.getElementById('results').innerHTML = `Résultats pour: <b>${query}</b>`;
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
      if(item.id.videoId){
        html += `
          <div class="cursor-pointer" onclick="window.open('https://youtube.com/watch?v=${item.id.videoId}')">
            <img src="${item.snippet.thumbnails.medium.url}" class="rounded-lg w-full">
            <p class="text-sm mt-2">${item.snippet.title}</p>
          </div>
        `;
      }
    });
    html += '</div>';
    document.getElementById('results').innerHTML = html;
  } catch(e) {
    document.getElementById('results').innerHTML = "Erreur: " + e;
  }
}
function loadTrends() {
  const list = document.getElementById('trendsList');
  if(list) list.innerHTML = trends.map(t => `<div onclick="quickSearch('${t.q}')" class="p-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">${t.q}</div>`).join('');
}
function quickSearch(query) {
  document.getElementById('searchInput').value = query;
  search();
}

// BLOQUE LE RECHARGEMENT DU FORM DEFINITIVEMENT
document.getElementById('searchForm').addEventListener('submit', function(e){
  e.preventDefault();
  search();
});
