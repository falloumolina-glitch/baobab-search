const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';

// ===== DICTIONNAIRE DE TRADUCTION 100% =====
const translations = {
  'fr-FR': {
    searchPlaceholder: "Recher sur Baobab...",
    settings: "Paramètres",
    general: "Général",
    langSearch: "Langue de recherche:",
    region: "Région:",
    safeSearch: "SafeSearch",
    privacy: "Vie privée & Historique",
    saveActivity: "Enregistrer l'activité",
    clearHistory: "Effacer l'historique récent",
    appearance: "Apparence",
    theme: "Thème:",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    fontSize: "Taille du texte:",
    small: "Petit",
    medium: "Moyen",
    large: "Grand",
    account: "Confidentialité & Compte",
    personalResults: "Résultats personnels",
    logout: "Se déconnecter",
    back: "Retour",
    recent: "Historique récent",
    suggestions: "Suggestions",
    all: "Tous",
    images: "Images",
    videos: "Vidéos",
    news: "Actualités",
    maps: "Maps",
    speakNow: "Parlez maintenant..."
  },
  'en-US': {
    searchPlaceholder: "Search on Baobab...",
    settings: "Settings",
    general: "General",
    langSearch: "Search language:",
    region: "Region:",
    safeSearch: "SafeSearch",
    privacy: "Privacy & History",
    saveActivity: "Save activity",
    clearHistory: "Clear recent history",
    appearance: "Appearance",
    theme: "Theme:",
    light: "Light",
    dark: "Dark",
    system: "System",
    fontSize: "Text size:",
    small: "Small",
    medium: "Medium",
    large: "Large",
    account: "Privacy & Account",
    personalResults: "Personal results",
    logout: "Sign out",
    back: "Back",
    recent: "Recent history",
    suggestions: "Suggestions",
    all: "All",
    images: "Images",
    videos: "Videos",
    news: "News",
    maps: "Maps",
    speakNow: "Speak now..."
  },
  'es-ES': {
    searchPlaceholder: "Buscar en Baobab...",
    settings: "Configuración",
    general: "General",
    langSearch: "Idioma de búsqueda:",
    region: "Región:",
    safeSearch: "Búsqueda segura",
    privacy: "Privacidad e Historial",
    saveActivity: "Guardar actividad",
    clearHistory: "Borrar historial reciente",
    appearance: "Apariencia",
    theme: "Tema:",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    fontSize: "Tamaño del texto:",
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    account: "Privacidad y Cuenta",
    personalResults: "Resultados personales",
    logout: "Cerrar sesión",
    back: "Atrás",
    recent: "Historial reciente",
    suggestions: "Sugerencias",
    all: "Todo",
    images: "Imágenes",
    videos: "Vídeos",
    news: "Noticias",
    maps: "Mapas",
    speakNow: "Hable ahora..."
  },
  'pt-PT': {
    searchPlaceholder: "Pesquisar no Baobab...",
    settings: "Definições",
    general: "Geral",
    langSearch: "Idioma de pesquisa:",
    region: "Região:",
    safeSearch: "Pesquisa segura",
    privacy: "Privacidade e Histórico",
    saveActivity: "Guardar atividade",
    clearHistory: "Limpar histórico recente",
    appearance: "Aparência",
    theme: "Tema:",
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
    fontSize: "Tamanho do texto:",
    small: "Pequeno",
    medium: "Médio",
    large: "Grande",
    account: "Privacidade e Conta",
    personalResults: "Resultados pessoais",
    logout: "Terminar sessão",
    back: "Voltar",
    recent: "Histórico recente",
    suggestions: "Sugestões",
    all: "Tudo",
    images: "Imagens",
    videos: "Vídeos",
    news: "Notícias",
    maps: "Mapas",
    speakNow: "Fale agora..."
  },
  'it-IT': {
    searchPlaceholder: "Cerca su Baobab...",
    settings: "Impostazioni",
    general: "Generale",
    langSearch: "Lingua di ricerca:",
    region: "Regione:",
    safeSearch: "SafeSearch",
    privacy: "Privacy e Cronologia",
    saveActivity: "Salva attività",
    clearHistory: "Cancella cronologia recente",
    appearance: "Aspetto",
    theme: "Tema:",
    light: "Chiaro",
    dark: "Scuro",
    system: "Sistema",
    fontSize: "Dimensione testo:",
    small: "Piccolo",
    medium: "Medio",
    large: "Grande",
    account: "Privacy e Account",
    personalResults: "Risultati personali",
    logout: "Esci",
    back: "Indietro",
    recent: "Cronologia recente",
    suggestions: "Suggerimenti",
    all: "Tutto",
    images: "Immagini",
    videos: "Video",
    news: "Notizie",
    maps: "Mappe",
    speakNow: "Parla ora..."
  },
  'de-DE': {
    searchPlaceholder: "Suche auf Baobab...",
    settings: "Einstellungen",
    general: "Allgemein",
    langSearch: "Suchsprache:",
    region: "Region:",
    safeSearch: "SafeSearch",
    privacy: "Datenschutz & Verlauf",
    saveActivity: "Aktivität speichern",
    clearHistory: "Letzten Verlauf löschen",
    appearance: "Aussehen",
    theme: "Thema:",
    light: "Hell",
    dark: "Dunkel",
    system: "System",
    fontSize: "Textgröße:",
    small: "Klein",
    medium: "Mittel",
    large: "Groß",
    account: "Datenschutz & Konto",
    personalResults: "Persönliche Ergebnisse",
    logout: "Abmelden",
    back: "Zurück",
    recent: "Letzter Verlauf",
    suggestions: "Vorschläge",
    all: "Alle",
    images: "Bilder",
    videos: "Videos",
    news: "Nachrichten",
    maps: "Karten",
    speakNow: "Jetzt sprechen..."
  },
  'ar-SA': {
    searchPlaceholder: "البحث في باوباب...",
    settings: "الإعدادات",
    general: "عام",
    langSearch: "لغة البحث:",
    region: "المنطقة:",
    safeSearch: "البحث الآمن",
    privacy: "الخصوصية والسجل",
    saveActivity: "حفظ النشاط",
    clearHistory: "مسح السجل الأخير",
    appearance: "المظهر",
    theme: "السمة:",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
    fontSize: "حجم الخط:",
    small: "صغير",
    medium: "متوسط",
    large: "كبير",
    account: "الخصوصية والحساب",
    personalResults: "نتائج شخصية",
    logout: "تسجيل الخروج",
    back: "رجوع",
    recent: "السجل الأخير",
    suggestions: "الاقتراحات",
    all: "الكل",
    images: "الصور",
    videos: "الفيديوهات",
    news: "الأخبار",
    maps: "الخرائط",
    speakNow: "تحدث الآن..."
  }
};

function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];

  // Applique toutes les traductions
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;

  // Parcourt tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(t[key]) el.textContent = t[key];
  });
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(`#${id}`).classList.add('active');
  applyTranslations(); // Re-traduit à chaque changement de page
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
  currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
  const t = translations[currentLang];

  recognition = new SpeechRecognition();
  recognition.lang = currentLang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = function() {
    $('#searchInput').placeholder = t.speakNow;
  };
  recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript;
    $('#searchInput').value = speechResult;
    $('#searchInput').placeholder = t.searchPlaceholder;
    search();
  };
  recognition.onerror = function(event) {
    alert('Erreur micro: ' + event.error);
    $('#searchInput').placeholder = t.searchPlaceholder;
  };
  recognition.onend = function() {
    $('#searchInput').placeholder = t.searchPlaceholder;
  };
  recognition.start();
}

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
    $('#langSelect').value = currentLang;
    applyTranslations(); // Traduit au chargement

    $('#langSelect').addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('baobabLang', currentLang);
      applyTranslations(); // Re-traduit toute la page
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
