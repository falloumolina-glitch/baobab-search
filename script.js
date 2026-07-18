const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';

// RÈGLE D'OR : METS TA VRAIE CLÉ ICI ENTRE LES ""
const GEMINI_API_KEY = "AIzaSyD6aTPeBpKTBFNNT6LOaXbfmpMG7XWl2V4";

const translations = {
  'fr-FR': {searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", langSearch: "Langue de recherche:", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", security: "Sécurité", back: "Retour", speakNow: "Parlez maintenant..."},
  'en-US': {searchPlaceholder: "Search on Baobab...", settings: "Settings", langSearch: "Search language:", saveActivity: "Save activity", clearHistory: "Clear recent history", security: "Security", back: "Back", speakNow: "Speak now..."},
  'es-ES': {searchPlaceholder: "Buscar en Baobab...", settings: "Configuración", langSearch: "Idioma de búsqueda:", saveActivity: "Guardar actividad", clearHistory: "Borrar historial reciente", security: "Seguridad", back: "Atrás", speakNow: "Hable ahora..."}
};

function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;
  document.querySelectorAll('[data-i18n]').forEach(el => {const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent = t[key];});
}

function showPage(id) {document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); applyTranslations();}
function goHome() {showPage('home'); loadHistory(); if($('#langSelect')) $('#langSelect').value = currentLang; if($('#securityMode')) $('#securityMode').value = currentSecurity;}
function loadHistory() {let h = JSON.parse(localStorage.getItem('hist') || '[]'); if($('#historyList')) $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i}')">${i}</div>`).join('');}
function selectSuggest(text) {$('#searchInput').value = text; search();}
function saveHistory(q) {if(!$('#saveActivity')?.checked) return; let h = JSON.parse(localStorage.getItem('hist') || '[]'); localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5))); loadHistory();}
function clearHistory() {localStorage.removeItem('hist'); loadHistory();}

async function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;
  $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  runBaobabAI(q);
  $('#resultsList').innerHTML = `<div class="result-card"><div class="url">baobabsearch.com/search?q=${q}</div><a class="title">Résultats pour <b>${q}</b></a><div class="desc">Ici viendront les vrais résultats des sites web.</div></div>`;
}

async function runBaobabAI(query) {
  const aiBlock = $('#aiBlock');
  if(currentSecurity === 'strong') { aiBlock.classList.add('hidden'); return; }
  aiBlock.classList.remove('hidden');
  $('#aiText').innerText = `Réflexion de Baobab IA...`;
  $('#aiBtn').classList.add('hidden');

  if(GEMINI_API_KEY === "AIzaSyTA_CLE_QUE_TU_AS_COPIE" || GEMINI_API_KEY.length < 20){
    $('#aiText').innerText = "ERREUR: Colle ta VRAIE clé API dans script.js ligne 5";
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({contents: [{parts: [{ text: `Tu es Baobab IA. Réponds en ${currentLang} à: ${query}` }]}]})
    });
    const data = await response.json();
    $('#aiText').innerText = data.candidates[0].content.parts[0].text;
    $('#aiSources').innerHTML = `<span>Source: Gemini 1.5 Flash</span>`;
    $('#aiBtn').classList.remove('hidden');
  } catch (error) { $('#aiText').innerText = "Erreur API. Vérifie ta clé."; }
}

function expandAI(){ $('#aiBtn').classList.add('hidden');}
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { alert("Micro non supporté"); return; }
  const t = translations[currentLang]; recognition = new SpeechRecognition();
  recognition.lang = currentLang; recognition.onstart = () => { $('#searchInput').placeholder = t.speakNow; };
  recognition.onresult = (e) => {$('#searchInput').value = e.results[0][0].transcript; $('#searchInput').placeholder = t.searchPlaceholder; search();};
  recognition.onend = () => { $('#searchInput').placeholder = t.searchPlaceholder; }; recognition.start();
}
function startImageSearch() {let input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = e => {let file = e.target.files[0]; if (!file) return; $('#searchInput').value = "recherche par image: " + file.name; search();}; input.click();}

document.addEventListener('DOMContentLoaded', () => {
  if($('#langSelect')){ $('#langSelect').value = currentLang; applyTranslations(); $('#langSelect').addEventListener('change', (e) => {currentLang = e.target.value; localStorage.setItem('baobabLang', currentLang); applyTranslations();});}
  if($('#securityMode')) {$('#securityMode').value = currentSecurity; $('#securityMode').addEventListener('change', (e) => {currentSecurity = e.target.value; localStorage.setItem('baobabSecurity', currentSecurity);});}
});
goHome();
