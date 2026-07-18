const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';

// ⚠️ COLLE TA CLÉ GEMINI ICI ENTRE LES ""
const GEMINI_API_KEY = "COLLE_TA_CLE_ICI";

const translations = {
  'fr-FR': {searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", region: "Région:", safeSearch: "SafeSearch", privacy: "Vie privée & Historique", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", appearance: "Apparence", theme: "Thème:", light: "Clair", dark: "Sombre", system: "Système", fontSize: "Taille du texte:", small: "Petit", medium: "Moyen", large: "Grand", back: "Retour", recent: "Historique récent", suggestions: "Suggestions", all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", maps: "Maps", speakNow: "Parlez maintenant...", legal: "Légal", privacyPolicy: "Politique de confidentialité", termsOfService: "Conditions d'utilisation", about: "À propos", aboutBaobab: "À propos de Baobab Search", security: "Sécurité et Confidentialité", protectionMode: "Mode de protection:", standard: "Standard", strong: "Renforcé", strongHelp: "Mode Renforcé : Aucune donnée n'est enregistrée. SafeSearch activé."},
  'en-US': {searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", region: "Region:", safeSearch: "SafeSearch", privacy: "Privacy & History", saveActivity: "Save activity", clearHistory: "Clear recent history", appearance: "Appearance", theme: "Theme:", light: "Light", dark: "Dark", system: "System", fontSize: "Text size:", small: "Small", medium: "Medium", large: "Large", back: "Back", recent: "Recent history", suggestions: "Suggestions", all: "All", images: "Images", videos: "Videos", news: "News", maps: "Maps", speakNow: "Speak now...", legal: "Legal", privacyPolicy: "Privacy Policy", termsOfService: "Terms of Service", about: "About", aboutBaobab: "About Baobab Search", security: "Security & Privacy", protectionMode: "Protection Mode:", standard: "Standard", strong: "Strong", strongHelp: "Strong Mode: No data is saved. SafeSearch enabled."},
  'es-ES': {searchPlaceholder: "Buscar en Baobab...", settings: "Configuración", general: "General", langSearch: "Idioma de búsqueda:", region: "Región:", safeSearch: "Búsqueda segura", privacy: "Privacidad e Historial", saveActivity: "Guardar actividad", clearHistory: "Borrar historial reciente", appearance: "Apariencia", theme: "Tema:", light: "Claro", dark: "Oscuro", system: "Sistema", fontSize: "Tamaño del texto:", small: "Pequeño", medium: "Mediano", large: "Grande", back: "Atrás", recent: "Historial reciente", suggestions: "Sugerencias", all: "Todo", images: "Imágenes", videos: "Vídeos", news: "Noticias", maps: "Mapas", speakNow: "Hable ahora...", legal: "Legal", privacyPolicy: "Política de privacidad", termsOfService: "Términos de uso", about: "Acerca de", aboutBaobab: "Acerca de Baobab Search", security: "Seguridad y Privacidad", protectionMode: "Modo de protección:", standard: "Estándar", strong: "Reforzado", strongHelp: "Modo Reforzado: No se guardan datos. Búsqueda segura activada."}
};

function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];
  document.documentElement.dir = currentLang === 'ar-SA'? 'rtl' : 'ltr';
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;
  document.querySelectorAll('[data-i18n]').forEach(el => {const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent = t[key];});
}

function showPage(id) {document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); applyTranslations();}
function goHome() {showPage('home'); loadHistory(); if($('#langSelect')) $('#langSelect').value = currentLang; if($('#securityMode')) $('#securityMode').value = currentSecurity;}
function showSuggestions() {$('#suggestions').classList.remove('hidden'); loadHistory();}
function selectSuggest(text) {$('#searchInput').value = text; search();}

function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;
  $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  runBaobabAI(q);
  $('#resultsList').innerHTML = `<div class="result-card"><div class="url">baobabsearch.com/search?q=${q}</div><a class="title">Résultats pour <b>${q}</b></a><div class="desc">Ici viendront les vrais résultats des sites web.</div></div>`;
}

// 🔥 LA FONCTION QUI PARLE A GEMINI
async function runBaobabAI(query) {
  const aiBlock = $('#aiBlock');
  if(currentSecurity === 'strong') { aiBlock.classList.add('hidden'); return; }
  aiBlock.classList.remove('hidden');
  $('#aiText').innerText = `Réflexion de Baobab IA...`;
  $('#aiBtn').classList.add('hidden');
  $('#aiSources').innerHTML = '';

  if(GEMINI_API_KEY === "COLLE_TA_CLE_ICI"){
    $('#aiText').innerText = "Erreur: Colle ta clé API dans script.js ligne 5";
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Tu es Baobab IA, l'assistant intelligent de Baobab Search. Sois utile, direct et réponds en ${currentLang}. Question: ${query}` }]
        }]
      })
    });

    const data = await response.json();
    const answer = data.candidates[0].content.parts[0].text;

    $('#aiText').innerText = answer;
    $('#aiSources').innerHTML = `<span>Source: Gemini 1.5 Flash</span>`;
    $('#aiBtn').classList.remove('hidden');

  } catch (error) {
    $('#aiText').innerText = "Erreur de connexion à l'API. Vérifie ta clé.";
    console.error(error);
  }
}

function expandAI(){ $('#aiText').innerText += "\n\n[Fin de la réponse]"; $('#aiBtn').classList.add('hidden');}

let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { alert("Micro non supporté. Utilise Chrome."); return; }
  const t = translations[currentLang];
  recognition = new SpeechRecognition();
  recognition.lang = currentLang; recognition.interimResults = false; recognition.maxAlternatives = 1;
  recognition.onstart = () => { $('#searchInput').placeholder = t.speakNow; };
  recognition.onresult = (event) => {$('#searchInput').value = event.results[0][0].transcript; $('#searchInput').placeholder = t.searchPlaceholder; search();};
  recognition.onerror = () => { $('#searchInput').placeholder = t.searchPlaceholder; };
  recognition.onend = () => { $('#searchInput').placeholder = t.searchPlaceholder; };
  recognition.start();
}
function startImageSearch() {let input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment'; input.onchange = e => {let file = e.target.files[0]; if (!file) return; $('#searchInput').value = "recherche par image: " + file.name; search();}; input.click();}

document.addEventListener('DOMContentLoaded', () => {
  if($('#langSelect')){ $('#langSelect').value = currentLang; applyTranslations(); $('#langSelect').addEventListener('change', (e) => {currentLang = e.target.value; localStorage.setItem('baobabLang', currentLang); applyTranslations();});}
  if($('#securityMode')) {$('#securityMode').value = currentSecurity; setSecurityMode(currentSecurity);}
});

function saveHistory(q) {if(!$('#saveActivity')?.checked) return; let h = JSON.parse(localStorage.getItem('hist') || '[]'); localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5))); loadHistory();}
function loadHistory() {let h = JSON.parse(localStorage.getItem('hist') || '[]'); if($('#historyList')) $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i}')">${i}</div>`).join('');}
function clearHistory() {localStorage.removeItem('hist'); loadHistory(); alert('Historique effacé');}
function setTheme(t) {if(t === 'system') t = window.matchMedia('(prefers-color-scheme: dark)').matches? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', t);}
function setFontSize(s) {document.body.style.fontSize = s;}
function setSecurityMode(mode) {
  currentSecurity = mode;
  const saveCheckbox = $('#saveActivity'); const banner = $('#strongBanner');
  if(mode === 'strong') {if(saveCheckbox){saveCheckbox.checked = false; saveCheckbox.disabled = true;} localStorage.removeItem('hist'); document.referrerPolicy = "no-referrer"; if(banner)banner.classList.remove('hidden');}
  else {if(saveCheckbox)saveCheckbox.disabled = false; document.referrerPolicy = "no-referrer-when-downgrade"; if(banner)banner.classList.add('hidden');}
  localStorage.setItem('baobabSecurity', mode);
}
document.addEventListener('click', (e) => {if(!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) {if($('#suggestions'))$('#suggestions').classList.add('hidden');}})
goHome();
