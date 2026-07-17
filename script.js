const YOUTUBE_KEY = "COLLE_TA_CLE_ICI";
let currentTab = 'all';
let currentQuery = '';

// 1. TOUTES LES TRADUCTIONS ICI
const translations = {
  fr: { dir:"ltr", title:"Paramètres", langLabel:"Langue d'affichage", resultsLabel:"Langue des résultats", regionLabel:"Région géographique", save:"Enregistrer", saved:"✓ Paramètres enregistrés!", back:"← Retour à l'accueil", all:"Tous", images:"Images", videos:"Vidéos", news:"Actualités", ai:"✨ Résumé IA par Baobab", searchPlaceholder:"Rechercher sur Baobab..." },
  en: { dir:"ltr", title:"Settings", langLabel:"Display Language", resultsLabel:"Results Language", regionLabel:"Region", save:"Save", saved:"✓ Settings saved!", back:"← Back to Home", all:"All", images:"Images", videos:"Videos", news:"News", ai:"✨ AI Summary by Baobab", searchPlaceholder:"Search on Baobab..." },
  es: { dir:"ltr", title:"Configuración", langLabel:"Idioma de visualización", resultsLabel:"Idioma de resultados", regionLabel:"Región", save:"Guardar", saved:"✓ ¡Configuración guardada!", back:"← Volver al inicio", all:"Todo", images:"Imágenes", videos:"Vídeos", news:"Noticias", ai:"✨ Resumen IA por Baobab", searchPlaceholder:"Buscar en Baobab..." },
  ru: { dir:"ltr", title:"Настройки", langLabel:"Язык интерфейса", resultsLabel:"Язык результатов", regionLabel:"Регион", save:"Сохранить", saved:"✓ Настройки сохранены!", back:"← На главную", all:"Все", images:"Картинки", videos:"Видео", news:"Новости", ai:"✨ ИИ-сводка от Baobab", searchPlaceholder:"Поиск в Baobab..." },
  de: { dir:"ltr", title:"Einstellungen", langLabel:"Anzeigesprache", resultsLabel:"Ergebnisprache", regionLabel:"Region", save:"Speichern", saved:"✓ Einstellungen gespeichert!", back:"← Zurück zur Startseite", all:"Alle", images:"Bilder", videos:"Videos", news:"Nachrichten", ai:"✨ KI-Zusammenfassung von Baobab", searchPlaceholder:"Auf Baobab suchen..." },
  it: { dir:"ltr", title:"Impostazioni", langLabel:"Lingua di visualizzazione", resultsLabel:"Lingua dei risultati", regionLabel:"Regione", save:"Salva", saved:"✓ Impostazioni salvate!", back:"← Torna alla home", all:"Tutto", images:"Immagini", videos:"Video", news:"Notizie", ai:"✨ Riepilogo IA di Baobab", searchPlaceholder:"Cerca su Baobab..." },
  pt: { dir:"ltr", title:"Configurações", langLabel:"Idioma de exibição", resultsLabel:"Idioma dos resultados", regionLabel:"Região", save:"Salvar", saved:"✓ Configurações salvas!", back:"← Voltar para início", all:"Tudo", images:"Imagens", videos:"Vídeos", news:"Notícias", ai:"✨ Resumo IA da Baobab", searchPlaceholder:"Pesquisar no Baobab..." },
  "pt-BR": { dir:"ltr", title:"Configurações", langLabel:"Idioma de exibição", resultsLabel:"Idioma dos resultados", regionLabel:"Região", save:"Salvar", saved:"✓ Configurações salvas!", back:"← Voltar para início", all:"Tudo", images:"Imagens", videos:"Vídeos", news:"Notícias", ai:"✨ Resumo IA da Baobab", searchPlaceholder:"Pesquisar no Baobab..." },
  nl: { dir:"ltr", title:"Instellingen", langLabel:"Weergavetaal", resultsLabel:"Resultaat taal", regionLabel:"Regio", save:"Opslaan", saved:"✓ Instellingen opgeslagen!", back:"← Terug naar start", all:"Alles", images:"Afbeeldingen", videos:"Video's", news:"Nieuws", ai:"✨ AI-samenvatting door Baobab", searchPlaceholder:"Zoeken op Baobab..." },
  ar: { dir:"rtl", title:"الإعدادات", langLabel:"لغة العرض", resultsLabel:"لغة النتائج", regionLabel:"المنطقة الجغرافية", save:"حفظ", saved:"✓ تم حفظ الإعدادات!", back:"العودة إلى الصفحة الرئيسية →", all:"الكل", images:"الصور", videos:"الفيديوهات", news:"الأخبار", ai:"✨ ملخص الذكاء الاصطناعي من Baobab", searchPlaceholder:"ابحث في Baobab..." },
  wo: { dir:"ltr", title:"Réglages", langLabel:"Làkk bu feeñ", resultsLabel:"Làkku nataal yi", regionLabel:"Dëkk", save:"Denc", saved:"✓ Réglages bi denc na!", back:"← Dellu fàttaliku", all:"Lépp", images:"Nataal", videos:"Video", news:"Laj", ai:"✨ AI bi Baobab", searchPlaceholder:"Seet ci Baobab..." }
};

function t(key) {
  const lang = getSettings().uiLanguage;
  return translations[lang]?.[key] || translations['fr'][key];
}

function getSettings() {
  return {
    uiLanguage: localStorage.getItem('uiLanguage') || 'fr',
    resultsLanguage: localStorage.getItem('resultsLanguage') || 'any',
    region: localStorage.getItem('region') || 'sn',
    timeFilter: localStorage.getItem('timeFilter') || 'any',
    verbatim: localStorage.getItem('verbatim') === 'true',
    saveHistory: localStorage.getItem('saveHistory')!== 'false',
    personalization: localStorage.getItem('personalization') === 'true',
    safeSearch: localStorage.getItem('safeSearch') || 'off',
    barPosition: localStorage.getItem('barPosition') || 'top',
    autocomplete: localStorage.getItem('autocomplete')!== 'false',
    openNewTab: localStorage.getItem('openNewTab') === 'true',
    voiceSearch: localStorage.getItem('voiceSearch')!== 'false',
    theme: localStorage.getItem('theme') || 'system'
  }
}

function saveSettings() {
  localStorage.setItem('uiLanguage', document.getElementById('uiLanguage').value);
  localStorage.setItem('resultsLanguage', document.getElementById('resultsLanguage').value);
  localStorage.setItem('region', document.getElementById('region').value);
  localStorage.setItem('timeFilter', document.getElementById('timeFilter').value);
  localStorage.setItem('verbatim', document.getElementById('verbatim').checked);
  localStorage.setItem('saveHistory', document.getElementById('saveHistory').checked);
  localStorage.setItem('personalization', document.getElementById('personalization').checked);
  localStorage.setItem('safeSearch', document.getElementById('safeSearch').value);
  localStorage.setItem('barPosition', document.getElementById('barPosition').value);
  localStorage.setItem('autocomplete', document.getElementById('autocomplete').checked);
  localStorage.setItem('openNewTab', document.getElementById('openNewTab').checked);
  localStorage.setItem('voiceSearch', document.getElementById('voiceSearch').checked);
  localStorage.setItem('theme', document.getElementById('theme').value);

  applyTranslations(); // 2. APPLIQUER LA LANGUE DIRECT
  applyTheme();
  applyBarPosition();

  document.getElementById('saveMsg').innerText = t('saved');
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

// 3. FONCTION QUI CHANGE TOUTE L'ECRITURE
function applyTranslations() {
  const lang = getSettings().uiLanguage;
  document.documentElement.lang = lang;
  document.documentElement.dir = translations[lang].dir; // POUR ARABE RTL

  // On change seulement les textes principaux
  if(document.querySelector('#settingsPage h2')) document.querySelector('#settingsPage h2').innerText = t('title');
  if(document.getElementById('searchInput')) document.getElementById('searchInput').placeholder = t('searchPlaceholder');
  if(document.getElementById('tab-all')) document.getElementById('tab-all').innerText = t('all');
  if(document.getElementById('tab-images')) document.getElementById('tab-images').innerText = t('images');
  if(document.getElementById('tab-videos')) document.getElementById('tab-videos').innerText = t('videos');
  if(document.getElementById('tab-news')) document.getElementById('tab-news').innerText = t('news');
  if(document.querySelector('#aiSummary p.font-semibold')) document.querySelector('#aiSummary p.font-semibold').innerText = t('ai');
  if(document.querySelector('#settingsPage button.bg-gradient-to-r')) document.querySelector('#settingsPage button.bg-gradient-to-r').innerText = t('save');
  if(document.querySelector('#settingsPage button.text-blue-600')) document.querySelector('#settingsPage button.text-blue-600').innerText = t('back');
}

function applyTheme() {
  const theme = getSettings().theme;
  if(theme === 'system') {
    document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}

function applyBarPosition() {
  const pos = getSettings().barPosition;
  if(pos === 'bottom') {
    document.getElementById('topBar').classList.add('hidden');
    document.getElementById('bottomBar').classList.remove('hidden');
  } else {
    document.getElementById('topBar').classList.remove('hidden');
    document.getElementById('bottomBar').classList.add('hidden');
  }
}

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

function startVoice(iconId) {
  if(!getSettings().voiceSearch) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  let recognition = new SpeechRecognition();
  recognition.lang = getSettings().uiLanguage;
  document.getElementById(iconId).classList.add('text-red-500', 'animate-pulse');
  recognition.onresult = (event) => {
    document.getElementById('searchInput').value = event.results[0][0].transcript;
    search();
  };
  recognition.onend = () => document.getElementById(iconId).classList.remove('text-red-500', 'animate-pulse');
  recognition.start();
}

function buildSearchUrl(query) {
  const s = getSettings();
  let url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  if(s.resultsLanguage!== 'any') url += `&lr=lang_${s.resultsLanguage}`;
  if(s.region!== 'world') url += `&gl=${s.region}`;
  if(currentTab === 'images') url += `&tbm=isch`;
  if(currentTab === 'videos') url += `&tbm=vid`;
  if(currentTab === 'news') url += `&tbm=nws`;
  return url;
}

function search(event) {
  if(event) event.preventDefault();
  let query = document.getElementById('searchInput')?.value || document.getElementById('searchInputResults').value;
  if(!query) return;
  const s = getSettings();
  currentQuery = query;
  document.getElementById('searchInputResults').value = query;
  showPage('resultsPage');
  document.getElementById('resultCount').innerText = `${t('all')}: "${query}"`;
  document.getElementById('aiText').innerText = `${t('ai')}: ${query}`;
  const searchUrl = buildSearchUrl(query);
  const target = s.openNewTab? '_blank' : '_self';
  let html = '';
  for(let i=1; i<=5; i++) {
    html += `<div><a href="${searchUrl}" target="${target}" class="text-xl text-blue-700 hover:underline">${query} - ${t('all')} ${i}</a><p class="text-sm text-green-700">baobab.com/resultat-${i}</p></div>`;
  }
  document.getElementById('resultsList').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  const s = getSettings();
  document.getElementById('uiLanguage').value = s.uiLanguage;
  document.getElementById('resultsLanguage').value = s.resultsLanguage;
  document.getElementById('region').value = s.region;

  applyTranslations(); // 4. CHARGER LA LANGUE AU DEMARRAGE
  applyTheme();
  applyBarPosition();
});
