const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';

const translations = {
  'fr-FR': {searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", region: "Région:", safeSearch: "SafeSearch", privacy: "Vie privée & Historique", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", appearance: "Apparence", theme: "Thème:", light: "Clair", dark: "Sombre", system: "Système", fontSize: "Taille du texte:", small: "Petit", medium: "Moyen", large: "Grand", back: "Retour", recent: "Historique récent", suggestions: "Suggestions", all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", maps: "Maps", speakNow: "Parlez maintenant...", legal: "Légal", privacyPolicy: "Politique de confidentialité", termsOfService: "Conditions d'utilisation", about: "À propos", aboutBaobab: "À propos de Baobab Search", security: "Sécurité et Confidentialité", protectionMode: "Mode de protection:", standard: "Standard", strong: "Renforcé", strongHelp: "Mode Renforcé : Aucune donnée n'est enregistrée. SafeSearch activé."},
  'en-US': {searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", region: "Region:", safeSearch: "SafeSearch", privacy: "Privacy & History", saveActivity: "Save activity", clearHistory: "Clear recent history", appearance: "Appearance", theme: "Theme:", light: "Light", dark: "Dark", system: "System", fontSize: "Text size:", small: "Small", medium: "Medium", large: "Large", back: "Back", recent: "Recent history", suggestions: "Suggestions", all: "All", images: "Images", videos: "Videos", news: "News", maps: "Maps", speakNow: "Speak now...", legal: "Legal", privacyPolicy: "Privacy Policy", termsOfService: "Terms of Service", about: "About", aboutBaobab: "About Baobab Search", security: "Security & Privacy", protectionMode: "Protection Mode:", standard: "Standard", strong: "Strong", strongHelp: "Strong Mode: No data is saved. SafeSearch enabled."},
  'es-ES': {searchPlaceholder: "Buscar en Baobab...", settings: "Configuración", general: "General", langSearch: "Idioma de búsqueda:", region: "Región:", safeSearch: "Búsqueda segura", privacy: "Privacidad e Historial", saveActivity: "Guardar actividad", clearHistory: "Borrar historial reciente", appearance: "Apariencia", theme: "Tema:", light: "Claro", dark: "Oscuro", system: "Sistema", fontSize: "Tamaño del texto:", small: "Pequeño", medium: "Mediano", large: "Grande", back: "Atrás", recent: "Historial reciente", suggestions: "Sugerencias", all: "Todo", images: "Imágenes", videos: "Vídeos", news: "Noticias", maps: "Mapas", speakNow: "Hable ahora...", legal: "Legal", privacyPolicy: "Política de privacidad", termsOfService: "Términos de uso", about: "Acerca de", aboutBaobab: "Acerca de Baobab Search", security: "Seguridad y Privacidad", protectionMode: "Modo de protección:", standard: "Estándar", strong: "Reforzado", strongHelp: "Modo Reforzado: No se guardan datos. Búsqueda segura activada."},
  'pt-PT': {searchPlaceholder: "Pesquisar no Baobab...", settings: "Definições", general: "Geral", langSearch: "Idioma de pesquisa:", region: "Região:", safeSearch: "Pesquisa segura", privacy: "Privacidade e Histórico", saveActivity: "Guardar atividade", clearHistory: "Limpar histórico recente", appearance: "Aparência", theme: "Tema:", light: "Claro", dark: "Escuro", system: "Sistema", fontSize: "Tamanho do texto:", small: "Pequeno", medium: "Médio", large: "Grande", back: "Voltar", recent: "Histórico recente", suggestions: "Sugestões", all: "Tudo", images: "Imagens", videos: "Vídeos", news: "Notícias", maps: "Mapas", speakNow: "Fale agora...", legal: "Legal", privacyPolicy: "Política de Privacidade", termsOfService: "Termos de Serviço", about: "Sobre", aboutBaobab: "Sobre o Baobab Search", security: "Segurança e Privacidade", protectionMode: "Modo de proteção:", standard: "Padrão", strong: "Reforçado", strongHelp: "Modo Reforçado: Nenhum dado é guardado. Pesquisa segura ativada."},
  'it-IT': {searchPlaceholder: "Cerca su Baobab...", settings: "Impostazioni", general: "Generale", langSearch: "Lingua di ricerca:", region: "Regione:", safeSearch: "SafeSearch", privacy: "Privacy e Cronologia", saveActivity: "Salva attività", clearHistory: "Cancella cronologia recente", appearance: "Aspetto", theme: "Tema:", light: "Chiaro", dark: "Scuro", system: "Sistema", fontSize: "Dimensione testo:", small: "Piccolo", medium: "Medio", large: "Grande", back: "Indietro", recent: "Cronologia recente", suggestions: "Suggerimenti", all: "Tutto", images: "Immagini", videos: "Video", news: "Notizie", maps: "Mappe", speakNow: "Parla ora...", legal: "Legale", privacyPolicy: "Informativa sulla privacy", termsOfService: "Termini di servizio", about: "Informazioni", aboutBaobab: "Informazioni su Baobab Search", security: "Sicurezza e Privacy", protectionMode: "Modalità di protezione:", standard: "Standard", strong: "Rafforzato", strongHelp: "Modalità Rafforzata: Nessun dato viene salvato. SafeSearch attivato."},
  'de-DE': {searchPlaceholder: "Suche auf Baobab...", settings: "Einstellungen", general: "Allgemein", langSearch: "Suchsprache:", region: "Region:", safeSearch: "SafeSearch", privacy: "Datenschutz & Verlauf", saveActivity: "Aktivität speichern", clearHistory: "Letzten Verlauf löschen", appearance: "Aussehen", theme: "Thema:", light: "Hell", dark: "Dunkel", system: "System", fontSize: "Textgröße:", small: "Klein", medium: "Mittel", large: "Groß", back: "Zurück", recent: "Letzter Verlauf", suggestions: "Vorschläge", all: "Alle", images: "Bilder", videos: "Videos", news: "Nachrichten", maps: "Karten", speakNow: "Jetzt sprechen...", legal: "Rechtliches", privacyPolicy: "Datenschutzrichtlinie", termsOfService: "Nutzungsbedingungen", about: "Über", aboutBaobab: "Über Baobab Search", security: "Sicherheit & Datenschutz", protectionMode: "Schutzmodus:", standard: "Standard", strong: "Verstärkt", strongHelp: "Verstärkter Modus: Keine Daten werden gespeichert. SafeSearch aktiviert."},
  'ar-SA': {searchPlaceholder: "البحث في باوباب...", settings: "الإعدادات", general: "عام", langSearch: "لغة البحث:", region: "المنطقة:", safeSearch: "البحث الآمن", privacy: "الخصوصية والسجل", saveActivity: "حفظ النشاط", clearHistory: "مسح السجل الأخير", appearance: "المظهر", theme: "السمة:", light: "فاتح", dark: "داكن", system: "النظام", fontSize: "حجم الخط:", small: "صغير", medium: "متوسط", large: "كبير", back: "رجوع", recent: "السجل الأخير", suggestions: "الاقتراحات", all: "الكل", images: "الصور", videos: "الفيديوهات", news: "الأخبار", maps: "الخرائط", speakNow: "تحدث الآن...", legal: "قانوني", privacyPolicy: "سياسة الخصوصية", termsOfService: "شروط الاستخدام", about: "حول", aboutBaobab: "حول باوباب سيرش", security: "الأمان والخصوصية", protectionMode: "وضع الحماية:", standard: "عادي", strong: "معزز", strongHelp: "الوضع المعزز: لا يتم حفظ أي بيانات. البحث الآمن مفعل."}
};

function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];
  document.documentElement.dir = currentLang === 'ar-SA'? 'rtl' : 'ltr';
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;
  document.querySelectorAll('[data-i18n]').forEach(el => {const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent = t[key];});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {const key = el.getAttribute('data-i18n-placeholder'); if(t[key]) el.placeholder = t[key];});
}

function showPage(id) {document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); applyTranslations();}
function goHome() {showPage('home'); loadHistory(); if($('#langSelect')) $('#langSelect').value = currentLang; if($('#securityMode')) $('#securityMode').value = currentSecurity;}
function showSuggestions() {$('#suggestions').classList.remove('hidden'); loadHistory();}
function liveSuggest() {}
function selectSuggest(text) {$('#searchInput').value = text; search();}
function search() {
  let q = $('#searchInput')?.value || $('#searchInput2')?.value;
  if(!q) return;
  $('#searchInput2').value = q;
  saveHistory(q);
  showPage('results');
  runBaobabAI(q); // LANCE BAOBAB IA
  $('#resultsList').innerHTML = `<div class="result-card"><div class="url">baobabsearch.com/search?q=${q}</div><a class="title">Résultats pour <b>${q}</b></a><div class="desc">Ici viendront les vrais résultats des sites web.</div></div>`;
}

function runBaobabAI(query) {
  const aiBlock = $('#aiBlock');
  if(currentSecurity === 'strong') { aiBlock.classList.add('hidden'); return; } // Si Renforcé = pas d'IA
  aiBlock.classList.remove('hidden');
  $('#aiText').innerText = `Recherche de la réponse pour : "${query}"...`;
  $('#aiBtn').classList.add('hidden');
  $('#aiSources').innerHTML = '';
  setTimeout(() => {
    $('#aiText').innerText = "Structure de Baobab IA prête. En attente de connexion à l'API pour donner la réponse complète.";
    $('#aiBtn').classList.remove('hidden');
    $('#aiSources').innerHTML = `<span>Source: En attente</span>`;
  }, 800);
}
function expandAI(){ $('#aiText').innerText += "\n\n[Contenu complet de la réponse IA s'affichera ici une fois connecté à l'API]"; $('#aiBtn').classList.add('hidden');}

let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { alert("Micro non supporté. Utilise Chrome."); return; }
  currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
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
function loadHistory() {let h = JSON.parse(localStorage.getItem('hist') || '[]'); $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i}')">${i}</div>`).join('');}
function clearHistory() {localStorage.removeItem('hist'); loadHistory(); alert('Historique effacé');}
function setTheme(t) {if(t === 'system') t = window.matchMedia('(prefers-color-scheme: dark)').matches? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', t);}
function setFontSize(s) {document.body.style.fontSize = s;}
function setSecurityMode(mode) {
  currentSecurity = mode;
  const saveCheckbox = $('#saveActivity'); const banner = $('#strongBanner');
  if(mode === 'strong') {saveCheckbox.checked = false; saveCheckbox.disabled = true; localStorage.removeItem('hist'); document.referrerPolicy = "no-referrer"; banner.classList.remove('hidden');}
  else {saveCheckbox.disabled = false; document.referrerPolicy = "no-referrer-when-downgrade"; banner.classList.add('hidden');}
  localStorage.setItem('baobabSecurity', mode);
}
document.addEventListener('click', (e) => {if(!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) {$('#suggestions').classList.add('hidden');}})
goHome();
