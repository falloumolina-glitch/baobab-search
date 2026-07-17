const YOUTUBE_KEY = "COLLE_TA_CLE_ICI";
let currentTab = 'all';
let currentQuery = '';
let recognition;

const translations = {
  fr: {dir:"ltr",set_title:"Paramètres",set_lang_title:"1. Langue & Région",set_lang_display:"Langue d'affichage",set_lang_results:"Langue des résultats",set_region:"Région géographique",set_period_title:"2. Filtres de Recherche",set_time:"Période",set_verbatim:"Recherche exacte Verbatim",set_privacy_title:"3. Confidentialité & Historique",set_hist:"Enregistrer l'historique Web",set_pers:"Personnalisation des résultats",set_safe:"Filtrage SafeSearch",set_ui_title:"4. Interface & Affichage",set_bar:"Position de la barre",set_auto:"Saisie semi-automatique",set_tab:"Ouvrir dans un nouvel onglet",set_voice:"Recherche vocale",set_theme:"Thème",set_save_btn:"Enregistrer",saveMsg:"✓ Paramètres enregistrés!",set_back_btn:"← Retour à l'accueil",tab_all:"Tous",tab_images:"Images",tab_videos:"Vidéos",tab_news:"Actualités",ai:"✨ Résumé IA par Baobab",placeholder:"Recher sur Baobab..."},
  en: {dir:"ltr",set_title:"Settings",set_lang_title:"1. Language & Region",set_lang_display:"Display Language",set_lang_results:"Results Language",set_region:"Geographic Region",set_period_title:"2. Search Filters",set_time:"Time Period",set_verbatim:"Exact Verbatim Search",set_privacy_title:"3. Privacy & History",set_hist:"Save Web History",set_pers:"Personalize Results",set_safe:"SafeSearch Filter",set_ui_title:"4. Interface & Display",set_bar:"Bar Position",set_auto:"Autocomplete",set_tab:"Open in new tab",set_voice:"Voice Search",set_theme:"Theme",set_save_btn:"Save",saveMsg:"✓ Settings saved!",set_back_btn:"← Back to Home",tab_all:"All",tab_images:"Images",tab_videos:"Videos",tab_news:"News",ai:"✨ AI Summary by Baobab",placeholder:"Search on Baobab..."},
  es: {dir:"ltr",set_title:"Configuración",set_lang_title:"1. Idioma y Región",set_lang_display:"Idioma de visualización",set_lang_results:"Idioma de resultados",set_region:"Región geográfica",set_period_title:"2. Filtros de Búsqueda",set_time:"Período",set_verbatim:"Búsqueda exacta",set_privacy_title:"3. Privacidad e Historial",set_hist:"Guardar historial web",set_pers:"Personalizar resultados",set_safe:"Filtro SafeSearch",set_ui_title:"4. Interfaz y Pantalla",set_bar:"Posición de la barra",set_auto:"Autocompletar",set_tab:"Abrir en pestaña nueva",set_voice:"Búsqueda por voz",set_theme:"Tema",set_save_btn:"Guardar",saveMsg:"✓ ¡Configuración guardada!",set_back_btn:"← Volver al inicio",tab_all:"Todo",tab_images:"Imágenes",tab_videos:"Vídeos",tab_news:"Noticias",ai:"✨ Resumen IA por Baobab",placeholder:"Buscar en Baobab..."},
  ar: {dir:"rtl",set_title:"الإعدادات",set_lang_title:"1. اللغة والمنطقة",set_lang_display:"لغة العرض",set_lang_results:"لغة النتائج",set_region:"المنطقة الجغرافية",set_period_title:"2. فلاتر البحث",set_time:"الفترة الزمنية",set_verbatim:"بحث حرفي",set_privacy_title:"3. الخصوصية والسجل",set_hist:"حفظ سجل الويب",set_pers:"تخصيص النتائج",set_safe:"فلتر البحث الآمن",set_ui_title:"4. الواجهة والعرض",set_bar:"موضع الشريط",set_auto:"الإكمال التلقائي",set_tab:"فتح في علامة تبويب جديدة",set_voice:"البحث الصوتي",set_theme:"السمة",set_save_btn:"حفظ",saveMsg:"✓ تم حفظ الإعدادات!",set_back_btn:"العودة إلى الصفحة الرئيسية →",tab_all:"الكل",tab_images:"الصور",tab_videos:"الفيديوهات",tab_news:"الأخبار",ai:"✨ ملخص الذكاء الاصطناعي من Baobab",placeholder:"ابحث في Baobab..."},
  ru: {dir:"ltr",set_title:"Настройки",set_lang_title:"1. Язык и Регион",set_lang_display:"Язык интерфейса",set_lang_results:"Язык результатов",set_region:"Географический регион",set_period_title:"2. Фильтры поиска",set_time:"Период времени",set_verbatim:"Точный поиск",set_privacy_title:"3. Конфиденциальность",set_hist:"Сохранить историю",set_pers:"Персонализация",set_safe:"Фильтр SafeSearch",set_ui_title:"4. Интерфейс",set_bar:"Положение панели",set_auto:"Автодополнение",set_tab:"Открыть в новой вкладке",set_voice:"Голосовой поиск",set_theme:"Тема",set_save_btn:"Сохранить",saveMsg:"✓ Настройки сохранены!",set_back_btn:"← На главную",tab_all:"Все",tab_images:"Картинки",tab_videos:"Видео",tab_news:"Новости",ai:"✨ ИИ-сводка от Baobab",placeholder:"Поиск в Baobab..."},
  de: {dir:"ltr",set_title:"Einstellungen",set_lang_title:"1. Sprache & Region",set_lang_display:"Anzeigesprache",set_lang_results:"Ergebnisprache",set_region:"Geografische Region",set_period_title:"2. Suchfilter",set_time:"Zeitraum",set_verbatim:"Exakte Suche",set_privacy_title:"3. Datenschutz",set_hist:"Webverlauf speichern",set_pers:"Ergebnisse personalisieren",set_safe:"SafeSearch Filter",set_ui_title:"4. Oberfläche",set_bar:"Position der Leiste",set_auto:"Autocomplete",set_tab:"In neuem Tab öffnen",set_voice:"Sprachsuche",set_theme:"Thema",set_save_btn:"Speichern",saveMsg:"✓ Einstellungen gespeichert!",set_back_btn:"← Zurück zur Startseite",tab_all:"Alle",tab_images:"Bilder",tab_videos:"Videos",tab_news:"Nachrichten",ai:"✨ KI-Zusammenfassung von Baobab",placeholder:"Auf Baobab suchen..."},
  it: {dir:"ltr",set_title:"Impostazioni",set_lang_title:"1. Lingua e Regione",set_lang_display:"Lingua di visualizzazione",set_lang_results:"Lingua dei risultati",set_region:"Regione geografica",set_period_title:"2. Filtri di ricerca",set_time:"Periodo",set_verbatim:"Ricerca esatta",set_privacy_title:"3. Privacy e Cronologia",set_hist:"Salva cronologia web",set_pers:"Personalizza risultati",set_safe:"Filtro SafeSearch",set_ui_title:"4. Interfaccia",set_bar:"Posizione barra",set_auto:"Completamento automatico",set_tab:"Apri in nuova scheda",set_voice:"Ricerca vocale",set_theme:"Tema",set_save_btn:"Salva",saveMsg:"✓ Impostazioni salvate!",set_back_btn:"← Torna alla home",tab_all:"Tutto",tab_images:"Immagini",tab_videos:"Video",tab_news:"Notizie",ai:"✨ Riepilogo IA di Baobab",placeholder:"Cerca su Baobab..."},
  pt: {dir:"ltr",set_title:"Configurações",set_lang_title:"1. Idioma e Região",set_lang_display:"Idioma de exibição",set_lang_results:"Idioma dos resultados",set_region:"Região geográfica",set_period_title:"2. Filtros de Pesquisa",set_time:"Período",set_verbatim:"Pesquisa exata",set_privacy_title:"3. Privacidade e Histórico",set_hist:"Salvar histórico da web",set_pers:"Personalizar resultados",set_safe:"Filtro SafeSearch",set_ui_title:"4. Interface",set_bar:"Posição da barra",set_auto:"Preenchimento automático",set_tab:"Abrir em nova aba",set_voice:"Pesquisa por voz",set_theme:"Tema",set_save_btn:"Salvar",saveMsg:"✓ Configurações salvas!",set_back_btn:"← Voltar para início",tab_all:"Tudo",tab_images:"Imagens",tab_videos:"Vídeos",tab_news:"Notícias",ai:"✨ Resumo IA da Baobab",placeholder:"Pesquisar no Baobab..."},
  "pt-BR": {dir:"ltr",set_title:"Configurações",set_lang_title:"1. Idioma e Região",set_lang_display:"Idioma de exibição",set_lang_results:"Idioma dos resultados",set_region:"Região geográfica",set_period_title:"2. Filtros de Pesquisa",set_time:"Período",set_verbatim:"Pesquisa exata",set_privacy_title:"3. Privacidade e Histórico",set_hist:"Salvar histórico da web",set_pers:"Personalizar resultados",set_safe:"Filtro SafeSearch",set_ui_title:"4. Interface",set_bar:"Posição da barra",set_auto:"Preenchimento automático",set_tab:"Abrir em nova aba",set_voice:"Pesquisa por voz",set_theme:"Tema",set_save_btn:"Salvar",saveMsg:"✓ Configurações salvas!",set_back_btn:"← Voltar para início",tab_all:"Tudo",tab_images:"Imagens",tab_videos:"Vídeos",tab_news:"Notícias",ai:"✨ Resumo IA da Baobab",placeholder:"Pesquisar no Baobab..."},
  nl: {dir:"ltr",set_title:"Instellingen",set_lang_title:"1. Taal en Regio",set_lang_display:"Weergavetaal",set_lang_results:"Resultaat taal",set_region:"Geografische regio",set_period_title:"2. Zoekfilters",set_time:"Periode",set_verbatim:"Exacte zoekopdracht",set_privacy_title:"3. Privacy en Geschiedenis",set_hist:"Webgeschiedenis opslaan",set_pers:"Resultaten personaliseren",set_safe:"SafeSearch-filter",set_ui_title:"4. Interface",set_bar:"Balkpositie",set_auto:"Automatisch aanvullen",set_tab:"Openen in nieuw tabblad",set_voice:"Spraakzoekopdracht",set_theme:"Thema",set_save_btn:"Opslaan",saveMsg:"✓ Instellingen opgeslagen!",set_back_btn:"← Terug naar start",tab_all:"Alles",tab_images:"Afbeeldingen",tab_videos:"Video's",tab_news:"Nieuws",ai:"✨ AI-samenvatting door Baobab",placeholder:"Zoeken op Baobab..."},
  wo: {dir:"ltr",set_title:"Réglages",set_lang_title:"1. Làkk ak Dëkk",set_lang_display:"Làkk bu feeñ",set_lang_results:"Làkku nataal yi",set_region:"Dëkk",set_period_title:"2. Filtre yu Seet",set_time:"Jamono",set_verbatim:"Seet bu leer",set_privacy_title:"3. Sutura",set_hist:"Denc nataal yi",set_pers:"Nataal yi ci sa bopp",set_safe:"SafeSearch",set_ui_title:"4. Interface",set_bar:"Tof bi",set_auto:"Bindu automatic",set_tab:"Ubbi ci wendu bees",set_voice:"Seet ci kàddu",set_theme:"Dëmm",set_save_btn:"Denc",saveMsg:"✓ Réglages bi denc na!",set_back_btn:"← Dellu fàttaliku",tab_all:"Lépp",tab_images:"Nataal",tab_videos:"Video",tab_news:"Laj",ai:"✨ AI bi Baobab",placeholder:"Seet ci Baobab..."}
};

function t(k){ const lang=getSettings().uiLanguage; return translations[lang][k] || translations['fr'][k]; }

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
  ['uiLanguage','resultsLanguage','region','timeFilter','safeSearch','barPosition','theme'].forEach(id=>localStorage.setItem(id, document.getElementById(id).value));
  ['verbatim','saveHistory','personalization','autocomplete','openNewTab','voiceSearch'].forEach(id=>localStorage.setItem(id, document.getElementById(id).checked));
  applyTranslations(); applyTheme(); applyBarPosition();
  document.getElementById('saveMsg').innerText = t('saveMsg');
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

function applyTranslations() {
  const tr = translations[getSettings().uiLanguage];
  document.documentElement.lang = getSettings().uiLanguage;
  document.documentElement.dir = tr.dir;
  for(let key in tr) { if(document.getElementById(key)) document.getElementById(key).innerText = tr[key]; }
  document.getElementById('searchInput').placeholder = tr.placeholder;
  document.getElementById('ai').innerText = tr.ai;
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
  const s = getSettings();
  if(s.barPosition === 'bottom') {
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
  document.getElementById(`tab-${tab}`).innerText = t(`tab_${tab}`);
  if(currentQuery) search();
}

function takePhoto() {
  document.getElementById('fileInput').click();
}

function startVoice(iconId) {
  if(!getSettings().voiceSearch) return alert("Recherche vocale désactivée");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('Voix non supportée');
  recognition = new SpeechRecognition();
  recognition.lang = getSettings().uiLanguage + '-FR';
  document.getElementById(iconId).classList.add('text-red-500', 'animate-pulse');
  recognition.onresult = (event) => {
    const input = document.getElementById('searchInput') || document.getElementById('searchInputResults');
    input.value = event.results[0][0].transcript;
    search();
  };
  recognition.onend = () => document.getElementById(iconId).classList.remove('text-red-500', 'animate-pulse');
  recognition.start();
}

function buildSearchUrl(query) {
  const s = getSettings();
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}`;
  if(s.resultsLanguage!== 'any') url += `&relevanceLanguage=${s.resultsLanguage}`;
  if(s.region) url += `&regionCode=${s.region}`;
  if(s.timeFilter === 'day') url += `&publishedAfter=${new Date(Date.now()-86400000).toISOString()}`;
  if(s.safeSearch === 'on') url += `&safeSearch=strict`;
  if(s.safeSearch === 'blur') url += `&safeSearch=moderate`;
  return url + `&key=${YOUTUBE_KEY}`;
}

async function search(event) {
  if(event) event.preventDefault();
  let query = document.getElementById('searchInput')?.value || document.getElementById('searchInputResults').value;
  if(!query) return;

  const s = getSettings();
  if(s.verbatim) query = `"${query}"`;

  if(s.saveHistory) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift(query);
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0,10)));
  }

  currentQuery = query;
  document.getElementById('searchInputResults').value = query;
  showPage('resultsPage');
  document.getElementById('resultCount').innerText = `Résultats pour "${query}"`;

  if(currentTab === 'videos') await searchYouTube(query);
  else {
    let html = '';
    for(let i=1; i<=5; i++) {
      const target = s.openNewTab? '_blank' : '_self';
      html += `<div><a href="https://google.com/search?q=${query}" target="${target}" class="text-xl text-blue-700 hover:underline">${query} - Résultat ${i}</a><p class="text-sm text-green-700">baobab.com/resultat-${i}</p><p>Description pour "${query}".</p></div>`;
    }
    document.getElementById('resultsList').innerHTML = html;
  }
}

async function searchYouTube(query) {
  if(YOUTUBE_KEY === "COLLE_TA_CLE_ICI") {
    document.getElementById('resultsList').innerHTML = "⚠️ Colle ta clé YouTube dans script.js ligne 1";
    return;
  }
  try {
    const url = buildSearchUrl(query);
    const res = await fetch(url);
    const data = await res.json();
    let html = '<div class="grid grid-cols-2 gap-4">';
    data.items.forEach(item => {
      if(item.id.videoId){
        const target = getSettings().openNewTab? '_blank' : '_self';
        html += `<div class="cursor-pointer" onclick="window.open('https://youtube.com/watch?v=${item.id.videoId}', '${target}')"><img src="${item.snippet.thumbnails.medium.url}" class="rounded-lg"><p class="text-sm mt-1">${item.snippet.title}</p></div>`;
      }
    });
    html += '</div>';
    document.getElementById('resultsList').innerHTML = html;
  } catch(e) {
    document.getElementById('resultsList').innerHTML = "Erreur YouTube API";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const s = getSettings();
  document.getElementById('uiLanguage').value = s.uiLanguage;
  document.getElementById('resultsLanguage').value = s.resultsLanguage;
  document.getElementById('region').value = s.region;
  document.getElementById('timeFilter').value = s.timeFilter;
  document.getElementById('verbatim').checked = s.verbatim;
  document.getElementById('saveHistory').checked = s.saveHistory;
  document.getElementById('personalization').checked = s.personalization;
  document.getElementById('safeSearch').value = s.safeSearch;
  document.getElementById('barPosition').value = s.barPosition;
  document.getElementById('autocomplete').checked = s.autocomplete;
  document.getElementById('openNewTab').checked = s.openNewTab;
  document.getElementById('voiceSearch').checked = s.voiceSearch;
  document.getElementById('theme').value = s.theme;
  applyTranslations();
  applyTheme();
  applyBarPosition();
});
