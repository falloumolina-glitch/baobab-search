// 1. COLLE TA CLÉ ICI
const YOUTUBE_KEY = "COLLE_TA_CLE_ICI";
const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=`;

const translations = {
  fr: { all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", about: "À propos", terms: "Conditions", privacy: "Confidentialité", settings_title: "Paramètres", lang_region: "Langue & Région", appearance: "Apparence", light_theme: "Thème Clair", dark_theme: "Thème Sombre", save: "Enregistrer", saved: "✓ Paramètres enregistrés!", back: "← Retour", search_placeholder: "Rechercher sur Baobab...", ai_title: "✨ Résumé IA par Baobab", ai_summary: "Résumé IA", new_tab: "Nouvel onglet", about_title: "À propos de Baobab Search", terms_title: "Conditions d'utilisation", privacy_title: "Politique de confidentialité" },
  en: { all: "All", images: "Images", videos: "Videos", news: "News", about: "About", terms: "Terms", privacy: "Privacy", settings_title: "Settings", lang_region: "Language & Region", appearance: "Appearance", light_theme: "Light Theme", dark_theme: "Dark Theme", save: "Save", saved: "✓ Settings saved!", back: "← Back", search_placeholder: "Search on Baobab...", ai_title: "✨ AI Summary by Baobab", ai_summary: "AI Summary", new_tab: "New tab", about_title: "About Baobab Search", terms_title: "Terms of Service", privacy_title: "Privacy Policy" },
  pt: { all: "Tudo", images: "Imagens", videos: "Vídeos", news: "Notícias", about: "Sobre", terms: "Termos", privacy: "Privacidade", settings_title: "Definições", lang_region: "Idioma e Região", appearance: "Aparência", light_theme: "Tema Claro", dark_theme: "Tema Escuro", save: "Guardar", saved: "✓ Definições guardadas!", back: "← Voltar", search_placeholder: "Pesquisar no Baobab...", ai_title: "✨ Resumo IA por Baobab", ai_summary: "Resumo IA", new_tab: "Nova aba", about_title: "Sobre o Baobab Search", terms_title: "Termos de Uso", privacy_title: "Política de Privacidade" },
  it: { all: "Tutti", images: "Immagini", videos: "Video", news: "Notizie", about: "Informazioni", terms: "Termini", privacy: "Privacy", settings_title: "Impostazioni", lang_region: "Lingua e Regione", appearance: "Aspetto", light_theme: "Tema Chiaro", dark_theme: "Tema Scuro", save: "Salva", saved: "✓ Impostazioni salvate!", back: "← Indietro", search_placeholder: "Cerca su Baobab...", ai_title: "✨ Riepilogo IA di Baobab", ai_summary: "Riepilogo IA", new_tab: "Nuova scheda", about_title: "Informazioni su Baobab Search", terms_title: "Termini di Servizio", privacy_title: "Informativa sulla Privacy" },
  de: { all: "Alle", images: "Bilder", videos: "Videos", news: "Nachrichten", about: "Über", terms: "Bedingungen", privacy: "Datenschutz", settings_title: "Einstellungen", lang_region: "Sprache & Region", appearance: "Aussehen", light_theme: "Helles Thema", dark_theme: "Dunkles Thema", save: "Speichern", saved: "✓ Einstellungen gespeichert!", back: "← Zurück", search_placeholder: "Auf Baobab suchen...", ai_title: "✨ KI-Zusammenfassung von Baobab", ai_summary: "KI-Zusammenfassung", new_tab: "Neuer Tab", about_title: "Über Baobab Search", terms_title: "Nutzungsbedingungen", privacy_title: "Datenschutzrichtlinie" },
  ru: { all: "Все", images: "Картинки", videos: "Видео", news: "Новости", about: "О нас", terms: "Условия", privacy: "Конфиденциальность", settings_title: "Настройки", lang_region: "Язык и регион", appearance: "Внешний вид", light_theme: "Светлая тема", dark_theme: "Темная тема", save: "Сохранить", saved: "✓ Настройки сохранены!", back: "← Назад", search_placeholder: "Поиск в Baobab...", ai_title: "✨ ИИ-резюме от Baobab", ai_summary: "И-резюме", new_tab: "Новая вкладка", about_title: "О Baobab Search", terms_title: "Условия использования", privacy_title: "Политика конфиденциальности" },
  nl: { all: "Alles", images: "Afbeeldingen", videos: "Video's", news: "Nieuws", about: "Over", terms: "Voorwaarden", privacy: "Privacy", settings_title: "Instellingen", lang_region: "Taal & Regio", appearance: "Weergave", light_theme: "Licht thema", dark_theme: "Donker thema", save: "Opslaan", saved: "✓ Instellingen opgeslagen!", back: "← Terug", search_placeholder: "Zoeken op Baobab...", ai_title: "✨ AI-samenvatting door Baobab", ai_summary: "AI-samenvatting", new_tab: "Nieuw tabblad", about_title: "Over Baobab Search", terms_title: "Gebruiksvoorwaarden", privacy_title: "Privacybeleid" },
  wo: { all: "Lépp", images: "Nataal", videos: "Video", news: "Lëndëm", about: "Ci Baobab", terms: "Yoon yi", privacy: "Sutura", settings_title: "Jëfandikoo", lang_region: "Làkk ak Dëkku", appearance: "Nataal", light_theme: "Leer", dark_theme: "Guddi", save: "Denc", saved: "✓ Denc na!", back: "← Dellu", search_placeholder: "Laaj Baobab...", ai_title: "✨ Résumé AI", ai_summary: "Résumé AI", new_tab: "Fenetra bes", about_title: "Ci Baobab Search", terms_title: "Yoon yi", privacy_title: "Sutura" }
};

const trends = [{q: "angleterre - argentine", n: "20 000+"},{q: "météo demain", n: "20 000+"},{q: "messi", n: "500+"}];
let recognition;
let currentTab = 'all';

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.toggle('hidden');
}
function takePhoto() {
  const input = document.getElementById('fileInput');
  input.accept = 'image/*';
  input.capture = 'environment';
  input.click();
}
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('Voix non supportée');
  recognition = new SpeechRecognition();
  recognition.lang = getSettings().language === 'wo'? 'fr-FR' : getSettings().language + '-FR';
  recognition.onstart = () => document.getElementById('micIcon').classList.add('text-red-500', 'animate-pulse');
  recognition.onresult = (event) => {
    document.getElementById('searchInput').value = event.results[0][0].transcript;
    search();
  };
  recognition.onend = () => document.getElementById('micIcon').classList.remove('text-red-500', 'animate-pulse');
  recognition.start();
}
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-blue-600', 'text-blue-600', 'font-semibold');
    btn.classList.add('border-transparent', 'text-gray-500');
  });
  const activeBtn = document.getElementById(`tab-${tab}`);
  activeBtn.classList.add('border-blue-600', 'text-blue-600', 'font-semibold');
  activeBtn.classList.remove('border-transparent', 'text-gray-500');
  search();
}

async function search() {
  const query = document.getElementById('searchInput').value;
  if(!query) return;

  document.getElementById('results').innerHTML = "Chargement...";

  if(currentTab === 'videos') {
    await searchYouTube(query);
  } else {
    document.getElementById('results').innerHTML = "Résultats pour: " + query;
  }
}

async function searchYouTube(query) {
  if(YOUTUBE_KEY === "COLLE_TA_CLE_ICI") {
    document.getElementById('results').innerHTML = "Erreur: Colle ta clé YouTube dans script.js";
    return;
  }

  const url = `${YOUTUBE_URL}${encodeURIComponent(query)}&key=${YOUTUBE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  let html = '<div class="grid grid-cols-2 gap-4">';
  data.items.forEach(item => {
    html += `
      <div class="cursor-pointer" onclick="window.open('https://youtube.com/watch?v=${item.id.videoId}')">
        <img src="${item.snippet.thumbnails.medium.url}" class="rounded-lg">
        <p class="text-sm mt-2">${item.snippet.title}</p>
      </div>
    `;
  });
  html += '</div>';
  document.getElementById('results').innerHTML = html;
}

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  const t = translations[lang];
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if(t[key]) el.innerText = t[key];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
    const key = el.getAttribute('data-lang-placeholder');
    if(t[key]) el.placeholder = t[key];
  });
}
function loadTrends() {
  const list = document.getElementById('trendsList');
  list.innerHTML = trends.map(t => `
    <div onclick="quickSearch('${t.q}')" class="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
      <div class="flex items-center gap-4">
        <svg class="w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        <span>${t.q}</span>
      </div>
      <span class="text-sm text-gray-500">${t.n}</span>
    </div>
  `).join('');
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
    aiSummary: localStorage.getItem('aiSummary')!== 'false',
    openNewTab: localStorage.getItem('openNewTab')!== 'false',
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'fr'
  };
}
function loadSettingsUI() {
  const s = getSettings();
  document.getElementById('aiSummaryToggle').checked = s.aiSummary;
  document.getElementById('openNewTab').checked = s.openNewTab;
  document.getElementById('language').value = s.language;
  document.querySelector(`input[name="theme"][value="${s.theme}"]`).checked = true;
}
function quickSearch(query) {
  document.getElementById('searchInput').value = query;
  search();
    }
