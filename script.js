const suggestions = ["météo louga", "messi", "actualités sénégal", "traduction", "calculatrice"];
let currentTab = 'all';

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('translate-x-full'); document.getElementById('sidebarOverlay').classList.toggle('hidden'); }
function goHome() { showPage('homePage'); document.getElementById('mainHeader').classList.add('hidden'); }
function showPage(pageId) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); document.getElementById(pageId).classList.add('active'); }

function clearInput(id) { document.getElementById(id).value = ''; document.getElementById(id==='searchInput'?'clearBtn':'clearBtnHeader').classList.add('hidden'); }
document.getElementById('searchInput').oninput = (e) => { document.getElementById('clearBtn').classList.toggle('hidden', !e.target.value); }
document.getElementById('searchInputHeader').oninput = (e) => { document.getElementById('clearBtnHeader').classList.toggle('hidden', !e.target.value); }

function showAutocomplete(val, inputId='searchInputHeader') {
  const list = inputId==='searchInput'? 'autocompleteListHome' : 'autocompleteList';
  const el = document.getElementById(list);
  if(val.length < 3) { el.classList.add('hidden'); return; }
  const filtered = suggestions.filter(s => s.includes(val.toLowerCase()));
  el.innerHTML = filtered.map(s => `<div onclick="selectSuggestion('${s}', '${inputId}')" class="p-3 hover:bg-[#F1F5F9] cursor-pointer">${s}</div>`).join('');
  el.classList.toggle('hidden', filtered.length===0);
}
function selectSuggestion(s, inputId) { document.getElementById(inputId).value = s; search(); }

function search(e) {
  if(e) e.preventDefault();
  const query = document.getElementById('searchInput').value || document.getElementById('searchInputHeader').value;
  if(!query) return;
  
  showProgress(true);
  if(!navigator.onLine) { document.getElementById('offlineMsg').classList.remove('hidden'); showProgress(false); return; }
  
  showPage('resultsPage');
  document.getElementById('mainHeader').classList.remove('hidden');
  document.getElementById('searchInputHeader').value = query;
  document.getElementById('offlineMsg').classList.add('hidden');
  
  // PANNEAU INSTANTANE
  const panel = document.getElementById('instantPanel');
  if(query.includes('météo')) { panel.classList.remove('hidden'); document.getElementById('instantText').innerText = "Météo à Louga: 32°C, Ensoleillé"; }
  else { panel.classList.add('hidden'); }

  // RESULTATS FAKE
  setTimeout(() => {
    document.getElementById('resultsList').innerHTML = `
      <div class="result-card">
        <p class="result-url">https://exemple.com › page</p>
        <h3 class="result-title cursor-pointer" onclick="window.open('https://exemple.com')">Titre du résultat pour <b>${query}</b></h3>
        <p class="result-snippet">Ceci est un extrait avec le mot-clé <b>${query}</b> en gras pour la pertinence. <button onclick="shareLink('https://exemple.com')" class="text-[#2563EB] ml-2">Partager</button></p>
      </div>
      <div class="result-card">
        <p class="result-url">https://test.com › info</p>
        <h3 class="result-title">Deuxième résultat concernant <b>${query}</b></h3>
        <p class="result-snippet">Un autre snippet pertinent pour votre recherche. <button onclick="shareLink('https://test.com')" class="text-[#2563EB] ml-2">Partager</button></p>
      </div>
    `;
    if(document.getElementById('saveHistory').checked) saveToHistory(query);
    showProgress(false);
  }, 600);
}

function imFeelingLucky() { document.getElementById('searchInput').value = "messi"; search(); }
function switchTab(tab) { currentTab = tab; document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active')); document.getElementById(`tab-${tab}`).classList.add('active'); search(); }
function shareLink(url) { if(navigator.share) navigator.share({title: 'Baobab', url: url}); else navigator.clipboard.writeText(url); alert('Lien copié'); }
function saveToHistory(q) { let hist = JSON.parse(localStorage.getItem('history')||'[]'); hist.unshift(q); localStorage.setItem('history', JSON.stringify(hist.slice(0,10))); }
function clearHistory() { localStorage.removeItem('history'); alert('Historique effacé'); }
function showProgress(show) { document.getElementById('progressBar').style.width = show ? '100%' : '0%'; }
function startVoice() { alert('Recherche vocale'); }
function takePhoto() { document.getElementById('fileInput').click(); }
function changeLanguage(lang) { localStorage.setItem('language', lang); }

window.addEventListener('online', () => document.getElementById('offlineMsg').classList.add('hidden'));
window.addEventListener('offline', () => document.getElementById('offlineMsg').classList.remove('hidden'));
