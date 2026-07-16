const API_KEY = "COLLE_TA_CLE_ICI";
const CX = "COLLE_TON_CX_ICI";
let currentTab = 'all';

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.getElementById('homeHeader').style.display = pageId === 'homePage' ? 'flex' : 'none';
}

function searchQuick(q) {
  document.getElementById('searchInput').value = q;
  search();
}

function search(e) {
  if(e) e.preventDefault();
  const q = document.getElementById('searchInput').value;
  if(!q.trim()) return;
  showPage('resultsPage');
  document.getElementById('loading').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('aiText').innerText = `Résumé IA pour: ${q}`;
    document.getElementById('resultCount').innerText = `Environ 1,240,000 résultats`;
  }, 1000);
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('border-blue-600', 'text-blue-600', 'font-semibold'));
  document.getElementById(`tab-${tab}`).classList.add('border-blue-600', 'text-blue-600', 'font-semibold');
}

function startVoice() { alert('Micro activé'); }
function openCameraSearch() { document.getElementById('fileInput').click(); }
function toggleIncognito() { alert('Mode navigation privée'); }
function likeVideo() { alert('Vidéo likée'); }
function shareVideo() { alert('Partager vidéo'); }
function showHistory() { alert('Historique ouvert'); }
function clearCookies() { localStorage.clear(); alert('Cookies supprimés'); }
