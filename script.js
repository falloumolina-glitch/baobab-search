const YOUTUBE_KEY = "COLLE_TA_CLE_ICI";
let currentTab = 'all';
let currentQuery = '';

const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", search_btn: "Rechercher", lucky_btn: "J'ai de la chance", search_placeholder: "Recher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres" },
  en: { all: "All", images: "Images", videos: "Videos", news: "News", search_btn: "Search", lucky_btn: "I'm Feeling Lucky", search_placeholder: "Search on Baobab...", ai_title: "✨ AI Summary by Baobab", about: "About", terms: "Terms", privacy: "Privacy", settings_title: "Settings" }
};

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0,0);
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('border-blue-600', 'text-blue-600', 'font-semibold'));
  document.getElementById(`tab-${tab}`).classList.add('border-blue-600', 'text-blue-600', 'font-semibold');
  if(currentQuery) search();
}

async function search(event) {
  if(event) event.preventDefault();
  const query = document.getElementById('searchInput')?.value || document.getElementById('searchInputResults').value;
  if(!query) return;
  
  currentQuery = query;
  document.getElementById('searchInputResults').value = query;
  showPage('resultsPage');
  document.getElementById('resultCount').innerText = `Environ 1 200 000 résultats pour "${query}"`;
  document.getElementById('aiText').innerText = `Voici un résumé IA pour: ${query}`;

  if(currentTab === 'videos') await searchYouTube(query);
  else document.getElementById('resultsList').innerHTML = `<div><a href="#" class="text-xl text-blue-700 hover:underline">${query} - Baobab</a><p class="text-sm text-green-700">baobab.com/search?q=${query}</p><p>Résultat exemple pour la recherche "${query}" dans l'onglet ${currentTab}.</p></div>`;
}

async function searchYouTube(query) { /* même code que avant */ }

function startVoice() { /* même code que avant */ }
function takePhoto() { document.getElementById('fileInput').click(); }
function randomSearch() { const arr = ["messi", "baobab", "dakar"]; document.getElementById('searchInput').value = arr[Math.floor(Math.random()*arr.length)]; search(); }
