const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(`#${id}`).classList.add('active');
}

function goHome() {
  showPage('home');
  loadHistory();
  if($('#langSelect')) $('#langSelect').value = currentLang;
}

function showSuggestions() {
  $('#suggestions').classList.remove('hidden');
  loadHistory();
}

function liveSuggest() {}

function selectSuggest(text) {
  $('#searchInput').value = text;
  search();
}

function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;
  $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  $('#resultsList').innerHTML = `
  <div class="result-card">
    <div class="url">Langue: ${currentLang}</div>
    <a class="title">Résultat pour <b>${q}</b> - Baobab Search</a>
    <div class="desc">Résultats affichés en ${currentLang}</div>
  </div>`;
}

// ===== MICRO MULTILINGUE 100% =====
let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("La reconnaissance vocale n'est pas supportée. Utilise Chrome sur Android.");
    return;
  }

  // Recharge la langue au cas où elle a changé
  currentLang = localStorage.getItem('baobabLang') || 'fr-FR';

  recognition = new SpeechRecognition();
  recognition.lang = currentLang; // Utilise la langue choisie
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = function() {
    $('#searchInput').placeholder = "Parlez maintenant... " + currentLang;
  };
  recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript;
    $('#searchInput').value = speechResult;
    $('#searchInput').placeholder = "Recher sur Baobab...";
    search();
  };
  recognition.onerror = function(event) {
    alert('Erreur micro: ' + event.error + ' Langue: ' + currentLang);
    $('#searchInput').placeholder = "Recher sur Baobab...";
  };
  recognition.onend = function() {
    $('#searchInput').placeholder = "Recher sur Baobab...";
  };
  recognition.start();
}

// ===== RECHERCHE PAR IMAGE =====
function startImageSearch() {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.onchange = e => {
    let file = e.target.files[0];
    if (!file) return;
    $('#searchInput').value = "recherche par image: " + file.name;
    search();
  };
  input.click();
}

// ===== SAUVEGARDE LANGUE =====
document.addEventListener('DOMContentLoaded', () => {
  if($('#langSelect')){
    // Met la bonne langue au chargement
    $('#langSelect').value = currentLang;

    $('#langSelect').addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('baobabLang', currentLang);
      alert("Langue changée: " + e.target.options[e.target.selectedIndex].text);
    });
  }
});

function saveHistory(q) {
  if(!$('#saveActivity')?.checked) return;
  let h = JSON.parse(localStorage.getItem('hist') || '[]');
  localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5)));
  loadHistory();
}

function loadHistory() {
  let h = JSON.parse(localStorage.getItem('hist') || '[]');
  $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i}')">${i}</div>`).join('');
}

function clearHistory() {
  localStorage.removeItem('hist');
  loadHistory();
  alert('Historique effacé');
}

function setTheme(t) {
  if(t === 'system') t = window.matchMedia('(prefers-color-scheme: dark)').matches? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
}

function setFontSize(s) {
  document.body.style.fontSize = s;
}

function handleKeyPress(event) {
  if (event.key === 'Enter') { search(); }
}

document.addEventListener('click', (e) => {
  if(!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) {
    $('#suggestions').classList.add('hidden');
  }
})

goHome();
