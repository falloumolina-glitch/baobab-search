const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", my_photos: "Mes Photos", my_docs: "Mes Documents", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres", lang_region: "Langue & Région", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back: "← Retour", search_placeholder: "Rechercher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", about_title: "À propos", safe_off: "Désactivé", safe_medium: "Standard", safe_high: "Renforcé" },
  en: { all: "All", images: "Images", videos: "Videos", news: "News", my_photos: "My Photos", my_docs: "My Documents", about: "About", terms: "Terms", privacy: "Privacy", settings_title: "Settings", lang_region: "Language & Region", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back: "← Back", search_placeholder: "Search on Baobab...", ai_title: "✨ AI Summary", about_title: "About", safe_off: "Off", safe_medium: "Standard", safe_high: "Strict" },
  wo: { all: "Lépp", images: "Nataal", videos: "Video", news: "Lëndëm", my_photos: "Nataal yi ma", my_docs: "Liggeey yi ma", about: "Ci Baobab", terms: "Yoon yi", privacy: "Sutura", settings_title: "Jëfandikoo", lang_region: "Làkk ak Dëkku", appearance: "Nataal", light_theme: "Leer", dark_theme: "Guddi", save: "Denc", saved: "✓ Denc na!", back: "← Dellu", search_placeholder: "Laaj Baobab...", ai_title: "✨ Résumé AI", about_title: "Ci Baobab", safe_off: "Tere wu", safe_medium: "Digg", safe_high: "Kaw" },
  pt: { all: "Tudo", images: "Imagens", videos: "Vídeos", news: "Notícias", my_photos: "Minhas Fotos", my_docs: "Meus Documentos", about: "Sobre", terms: "Termos", privacy: "Privacidade", settings_title: "Configurações", lang_region: "Idioma e Região", appearance: "Aparência", light_theme: "Tema Claro", dark_theme: "Tema Escuro", save: "Salvar", saved: "✓ Salvo!", back: "← Voltar", search_placeholder: "Pesquisar no Baobab...", ai_title: "✨ Resumo IA", about_title: "Sobre", safe_off: "Desativado", safe_medium: "Padrão", safe_high: "Rigoroso" },
  es: { all: "Todo", images: "Imágenes", videos: "Vídeos", news: "Noticias", my_photos: "Mis Fotos", my_docs: "Mis Documentos", about: "Acerca de", terms: "Términos", privacy: "Privacidad", settings_title: "Configuración", lang_region: "Idioma y Región", appearance: "Apariencia", light_theme: "Tema Claro", dark_theme: "Tema Oscuro", save: "Guardar", saved: "✓ Guardado!", back: "← Atrás", search_placeholder: "Buscar en Baobab...", ai_title: "✨ Resumen IA", about_title: "Acerca de", safe_off: "Desactivado", safe_medium: "Estándar", safe_high: "Estricto" },
  ru: { all: "Все", images: "Картинки", videos: "Видео", news: "Новости", my_photos: "Мои Фото", my_docs: "Мои Документы", about: "О нас", terms: "Условия", privacy: "Конфиденциальность", settings_title: "Настройки", lang_region: "Язык и Регион", appearance: "Внешний вид", light_theme: "Светлая тема", dark_theme: "Темная тема", save: "Сохранить", saved: "✓ Сохранено!", back: "← Назад", search_placeholder: "Поиск в Baobab...", ai_title: "✨ Сводка ИИ", about_title: "О нас", safe_off: "Выкл", safe_medium: "Стандарт", safe_high: "Строгий" },
  de: { all: "Alle", images: "Bilder", videos: "Videos", news: "Nachrichten", my_photos: "Meine Fotos", my_docs: "Meine Dokumente", about: "Über", terms: "Bedingungen", privacy: "Datenschutz", settings_title: "Einstellungen", lang_region: "Sprache & Region", appearance: "Aussehen", light_theme: "Helles Thema", dark_theme: "Dunkles Thema", save: "Speichern", saved: "✓ Gespeichert!", back: "← Zurück", search_placeholder: "Suche auf Baobab...", ai_title: "✨ KI-Zusammenfassung", about_title: "Über", safe_off: "Aus", safe_medium: "Standard", safe_high: "Streng" },
  it: { all: "Tutti", images: "Immagini", videos: "Video", news: "Notizie", my_photos: "Le mie Foto", my_docs: "I miei Documenti", about: "Chi siamo", terms: "Termini", privacy: "Privacy", settings_title: "Impostazioni", lang_region: "Lingua e Regione", appearance: "Aspetto", light_theme: "Tema Chiaro", dark_theme: "Tema Scuro", save: "Salva", saved: "✓ Salvato!", back: "← Indietro", search_placeholder: "Cerca su Baobab...", ai_title: "✨ Riepilogo AI", about_title: "Chi siamo", safe_off: "Disattivato", safe_medium: "Standard", safe_high: "Rigido" }
};

let recognition;
let currentTab = 'all';

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.toggle('hidden');
}

function uploadFile(type) {
  const input = document.getElementById('fileInput');
  input.accept = type === 'image'? 'image/*' : '*/*';
  input.click();
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  recognition = new SpeechRecognition();
  recognition.lang = getSettings().language + '-FR';
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

function showPage(pageId) {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.add('hidden');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if(pageId === 'settingsPage') loadSettingsUI();
}

function getSettings() {
  return {
    apiKey: localStorage.getItem('apiKey') || '',
    cx: localStorage.getItem('cx') || '',
    safeSearch: localStorage.getItem('safeSearch') || 'medium',
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'fr'
  };
}

function loadSettingsUI() {
  const s = getSettings();
  document.getElementById('apiKeyInput').value = s.apiKey;
  document.getElementById('cxInput').value = s.cx;
  document.getElementById('safeSearch').value = s.safeSearch;
  document.getElementById('language').value = s.language;
  document.querySelector(`input[name="theme"][value="${s.theme}"]`).checked = true;
}

// FIX: BOUTON ENREGISTRER 100% CLICABLE
function saveSettings() {
  localStorage.setItem('apiKey', document.getElementById('apiKeyInput').value);
  localStorage.setItem('cx', document.getElementById('cxInput').value);
  localStorage.setItem('safeSearch', document.getElementById('safeSearch').value);
  localStorage.setItem('theme', document.querySelector('input[name="theme"]:checked').value);
  applyTheme(document.querySelector('input[name="theme"]:checked').value);
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

function applyTheme(t) {
  if(t === 'dark') document.documentElement.classList.add('dark');
  else if(t === 'light') document.documentElement.classList.remove('dark');
  else {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }
}

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if(translations[lang][key]) el.innerText = translations[lang][key];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
    const key = el.getAttribute('data-lang-placeholder');
    if(translations[lang][key]) el.placeholder = translations[lang][key];
  });
}

async function search(e) {
  if(e) e.preventDefault();
  const {apiKey, cx, safeSearch} = getSettings();
  const q = document.getElementById('searchInput').value;
  if(!q.trim()) return;
  if(!apiKey ||!cx) return alert('Va dans Paramètres et colle ton API Key et CX');

  showPage('resultsPage');
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('resultsList').innerHTML = '';

  let searchType = '';
  if(currentTab === 'images') searchType = '&searchType=image';

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(q)}&safe=${safeSearch}${searchType}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById('loading').classList.add('hidden');
    if(data.items) {
      document.getElementById('resultCount').innerText = `Environ ${data.searchInformation.totalResults} résultats`;
      displayResults(data.items);
    }
  } catch(err) {
    document.getElementById('loading').classList.add('hidden');
    alert('Erreur API');
  }
}

function displayResults(items) {
  const list = document.getElementById('resultsList');
  if(currentTab === 'images') {
    list.className = 'grid grid-cols-3 gap-2';
    list.innerHTML = items.map(item => `
      <a href="${item.image.contextLink}" target="_blank" class="block">
        <img src="${item.link}" class="w-full h-32 object-cover rounded-lg" loading="lazy">
      </a>
    `).join('');
  } else {
    list.className = 'space-y-5';
    list.innerHTML = items.map(item => `
      <div>
        <a href="${item.link}" target="_blank" class="text-blue-600 hover:underline text-lg font-medium">${item.title}</a>
        <p class="text-green-700 dark:text-green-400 text-sm">${item.displayLink}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">${item.snippet}</p>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const s = getSettings();
  changeLanguage(s.language);
  applyTheme(s.theme);
});
