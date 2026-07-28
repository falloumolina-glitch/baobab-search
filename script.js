const $ = s => document.querySelector(s);
let currentLang = localStorage.getItem('baobabLang') || 'fr-FR';
let currentSecurity = localStorage.getItem('baobabSecurity') || 'standard';
let currentTheme = localStorage.getItem('baobabTheme') || 'light';
let safeSearch = localStorage.getItem('baobabSafe') || 'on';
let suggestionsOn = localStorage.getItem('baobabSuggestions') || 'on';
let currentQuery = ""; let currentOffset = 0; let currentFilter = 'all';

const translations = {
  'fr-FR': { searchPlaceholder: "Recher sur Baobab...", settings: "Paramètres", general: "Général", langSearch: "Langue de recherche:", security: "Sécurité", protectionMode: "Mode de protection:", saveActivity: "Enregistrer l'activité", clearHistory: "Effacer l'historique récent", back: "Retour", recent: "Historique récent", speakNow: "Parlez maintenant...", noResults: "Aucun résultat trouvé pour", resultsFor: "Résultats pour", next: "Suivant", prev: "Précédent", readMore: "Lire l'article complet", all: "Tous", images: "Images", videos: "Vidéos", news: "Actualités", maps: "Maps" },
  'en-US': { searchPlaceholder: "Search on Baobab...", settings: "Settings", general: "General", langSearch: "Search language:", security: "Security", protectionMode: "Protection mode:", saveActivity: "Save activity", clearHistory: "Clear recent history", back: "Back", recent: "Recent", speakNow: "Speak now...", noResults: "No results found for", resultsFor: "Results for", next: "Next", prev: "Previous", readMore: "Read full article", all: "All", images: "Images", videos: "Videos", news: "News", maps: "Maps" },
  'es-ES': { searchPlaceholder: "Buscar en Baobab...", settings: "Ajustes", general: "General", langSearch: "Idioma de búsqueda:", security: "Seguridad", protectionMode: "Modo de protección:", saveActivity: "Guardar actividad", clearHistory: "Borrar historial", back: "Atrás", recent: "Reciente", speakNow: "Habla ahora...", noResults: "No se encontraron resultados para", resultsFor: "Resultados para", next: "Siguiente", prev: "Anterior", readMore: "Leer artículo completo", all: "Todo", images: "Imágenes", videos: "Vídeos", news: "Noticias", maps: "Mapas" },
  'pt-BR': { searchPlaceholder: "Pesquisar no Baobab...", settings: "Configurações", general: "Geral", langSearch: "Idioma de pesquisa:", security: "Segurança", protectionMode: "Modo de proteção:", saveActivity: "Salvar atividade", clearHistory: "Limpar histórico", back: "Voltar", recent: "Recente", speakNow: "Fale agora...", noResults: "Nenhum resultado para", resultsFor: "Resultados para", next: "Próximo", prev: "Anterior", readMore: "Ler artigo completo", all: "Tudo", images: "Imagens", videos: "Vídeos", news: "Notícias", maps: "Mapas" },
  'ar-SA': { searchPlaceholder: "ابحث في باوباب...", settings: "الإعدادات", general: "عام", langSearch: "لغة البحث:", security: "الأمان", protectionMode: "وضع الحماية:", saveActivity: "حفظ النشاط", clearHistory: "مسح السجل", back: "رجوع", recent: "الأخيرة", speakNow: "تحدث الآن...", noResults: "لا توجد نتائج لـ", resultsFor: "النتائج لـ", next: "التالي", prev: "السابق", readMore: "اقرأ المقال كاملا", all: "الكل", images: "صور", videos: "فيديوهات", news: "أخبار", maps: "خرائط" },
  'zh-CN': { searchPlaceholder: "在 Baobab 上搜索...", settings: "设置", general: "常规", langSearch: "搜索语言:", security: "安全", protectionMode: "保护模式:", saveActivity: "保存活动", clearHistory: "清除历史记录", back: "返回", recent: "最近", speakNow: "现在说话...", noResults: "未找到结果", resultsFor: "结果", next: "下一个", prev: "上一个", readMore: "阅读全文", all: "全部", images: "图片", videos: "视频", news: "新闻", maps: "地图" },
  'hi-IN': { searchPlaceholder: "Baobab पर खोजें...", settings: "सेटिंग्स", general: "सामान्य", langSearch: "खोज भाषा:", security: "सुरक्षा", protectionMode: "सुरक्षा मोड:", saveActivity: "गतिविधि सहेजें", clearHistory: "इतिहास साफ़ करें", back: "वापस", recent: "हालिया", speakNow: "अब बोलें...", noResults: "कोई परिणाम नहीं मिला", resultsFor: "के लिए परिणाम", next: "अगला", prev: "पिछला", readMore: "पूरा लेख पढ़ें", all: "सभी", images: "चित्र", videos: "वीडियो", news: "समाचार", maps: "मानचित्र" },
  'de-DE': { searchPlaceholder: "Auf Baobab suchen...", settings: "Einstellungen", general: "Allgemein", langSearch: "Suchsprache:", security: "Sicherheit", protectionMode: "Schutzmodus:", saveActivity: "Aktivität speichern", clearHistory: "Verlauf löschen", back: "Zurück", recent: "Kürzlich", speakNow: "Jetzt sprechen...", noResults: "Keine Ergebnisse für", resultsFor: "Ergebnisse für", next: "Weiter", prev: "Zurück", readMore: "Vollständigen Artikel lesen", all: "Alle", images: "Bilder", videos: "Videos", news: "Nachrichten", maps: "Karten" },
  'it-IT': { searchPlaceholder: "Cerca su Baobab...", settings: "Impostazioni", general: "Generale", langSearch: "Lingua di ricerca:", security: "Sicurezza", protectionMode: "Modalità di protezione:", saveActivity: "Salva attività", clearHistory: "Cancella cronologia", back: "Indietro", recent: "Recenti", speakNow: "Parla ora...", noResults: "Nessun risultato per", resultsFor: "Risultati per", next: "Avanti", prev: "Indietro", readMore: "Leggi articolo completo", all: "Tutto", images: "Immagini", videos: "Video", news: "Notizie", maps: "Mappe" },
  'ru-RU': { searchPlaceholder: "Поиск на Baobab...", settings: "Настройки", general: "Общие", langSearch: "Язык поиска:", security: "Безопасность", protectionMode: "Режим защиты:", saveActivity: "Сохранить активность", clearHistory: "Очистить историю", back: "Назад", recent: "Недавние", speakNow: "Говорите сейчас...", noResults: "Результатов не найдено", resultsFor: "Результаты для", next: "Далее", prev: "Назад", readMore: "Читать статью полностью", all: "Все", images: "Картинки", videos: "Видео", news: "Новости", maps: "Карты" },
  'ja-JP': { searchPlaceholder: "Baobabで検索...", settings: "設定", general: "一般", langSearch: "検索言語:", security: "セキュリティ", protectionMode: "保護モード:", saveActivity: "アクティビティを保存", clearHistory: "履歴を消去", back: "戻る", recent: "最近", speakNow: "今すぐ話してください...", noResults: "結果が見つかりません", resultsFor: "の検索結果", next: "次へ", prev: "前へ", readMore: "記事全文を読む", all: "すべて", images: "画像", videos: "動画", news: "ニュース", maps: "地図" },
  'ko-KR': { searchPlaceholder: "Baobab에서 검색...", settings: "설정", general: "일반", langSearch: "검색 언어:", security: "보안", protectionMode: "보호 모드:", saveActivity: "활동 저장", clearHistory: "기록 삭제", back: "뒤로", recent: "최근", speakNow: "지금 말하세요...", noResults: "결과 없음", resultsFor: "검색 결과", next: "다음", prev: "이전", readMore: "전체 기사 읽기", all: "전체", images: "이미지", videos: "동영상", news: "뉴스", maps: "지도" },
  'tr-TR': { searchPlaceholder: "Baobab'da Ara...", settings: "Ayarlar", general: "Genel", langSearch: "Arama dili:", security: "Güvenlik", protectionMode: "Koruma modu:", saveActivity: "Etkinliği kaydet", clearHistory: "Geçmişi temizle", back: "Geri", recent: "Son", speakNow: "Şimdi konuşun...", noResults: "Sonuç bulunamadı", resultsFor: "için sonuçlar", next: "İleri", prev: "Geri", readMore: "Tam makaleyi oku", all: "Tümü", images: "Görseller", videos: "Videolar", news: "Haberler", maps: "Haritalar" },
  'wo-SN': { searchPlaceholder: "Seet ci Baobab...", settings: "Paramèt", general: "Général", langSearch: "Làkk bu jëfandikoo:", security: "Dégg-loo", protectionMode: "Fital bu dégloo:", saveActivity: "Dencoo jëfandikoo", clearHistory: "Faj riw", back: "Dellu", recent: "Bi ñu jëfandikoo", speakNow: "Wax nala...", noResults: "Dara amu ci", resultsFor: "Résultats ci", next: "Suivant", prev: "Précédent", readMore: "Jàng leral", all: "Lépp", images: "Nataal", videos: "Vidéo", news: "Léebu", maps: "Carte" },
  'sw-KE': { searchPlaceholder: "Tafuta kwenye Baobab...", settings: "Mipangilio", general: "Kwa ujumla", langSearch: "Lugha ya utafutaji:", security: "Usalama", protectionMode: "Hali ya ulinzi:", saveActivity: "Hifadhi shughuli", clearHistory: "Futa historia", back: "Rudi", recent: "Ya hivi karibuni", speakNow: "Zungumza sasa...", noResults: "Hakuna matokeo kwa", resultsFor: "Matokeo ya", next: "Inayofuata", prev: "Iliyopita", readMore: "Soma makala kamili", all: "Zote", images: "Picha", videos: "Video", news: "Habari", maps: "Ramani" }
};

function applyTranslations() {
  const t = translations[currentLang] || translations['fr-FR'];
  document.documentElement.lang = currentLang.split('-')[0];
  if($('#searchInput')) $('#searchInput').placeholder = t.searchPlaceholder;
  if($('#searchInput2')) $('#searchInput2').placeholder = t.searchPlaceholder;
  document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent = t[key]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const key = el.getAttribute('data-i18n-placeholder'); if(t[key]) el.placeholder = t[key]; });
}

function applyTheme() {
  if(currentTheme === 'system') {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', sysDark? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }
}

function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); $(`#${id}`).classList.add('active'); applyTranslations(); }
function goHome() { showPage('home'); loadHistory(); if($('#langSelect')) $('#langSelect').value = currentLang; if($('#securityMode')) $('#securityMode').value = currentSecurity; if($('#themeSelect')) $('#themeSelect').value = currentTheme; if($('#safeSearch')) $('#safeSearch').value = safeSearch; if($('#suggestionsToggle')) $('#suggestionsToggle').value = suggestionsOn; }
function showSuggestions() { if(suggestionsOn === 'off') return; $('#suggestions').classList.remove('hidden'); loadHistory(); }
function selectSuggest(text) { $('#searchInput').value = text; search(); }

function toggleImageMenu() { $('#imageMenu').classList.toggle('hidden'); }
function startImageSearch(type) {
  $('#imageMenu').classList.add('hidden');
  let input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
  if(type === 'camera') input.capture = 'environment';
  input.onchange = e => { let file = e.target.files[0]; if (!file) return; $('#searchInput').value = file.name.replace(/\.[^/.]+$/, ""); search(); };
  input.click();
}

function setFilter(e, filter) {
  e.preventDefault(); currentFilter = filter; currentOffset = 0;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  if(!currentQuery) return;
  if(filter === 'all') searchWikipedia(currentQuery, 0);
  if(filter === 'images') searchWikimediaImages(currentQuery);
  if(filter === 'videos') searchVideos(currentQuery);
  if(filter === 'news') searchNews(currentQuery);
  if(filter === 'maps') searchMaps(currentQuery);
}

async function searchWikimediaImages(query) {
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche d'images...</p>`;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=20&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const pages = data.query?.pages || {};
    if(Object.keys(pages).length === 0) { $('#resultsList').innerHTML = `<p style="padding:20px">Aucune image trouvée</p>`; return; }
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:20px">`;
    Object.values(pages).forEach(p => { if(p.imageinfo) { const imgUrl = p.imageinfo[0].thumburl; html += `<a href="${p.imageinfo[0].url}" target="_blank"><img src="${imgUrl}" style="width:100%;height:150px;object-fit:cover;border-radius:8px"></a>`; } });
    html += `</div>`; $('#resultsList').innerHTML = html;
  } catch(e) { $('#resultsList').innerHTML = `<p style="padding:20px">Erreur images</p>`; }
}
function searchVideos(query) { $('#resultsList').innerHTML = `<iframe width="100%" height="600" src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}" frameborder="0" allowfullscreen style="padding:0 24px"></iframe>`; }
function searchNews(query) { const hl = currentLang.startsWith('fr')? 'fr' : 'en'; $('#resultsList').innerHTML = `<div style="padding:20px"><h3>Actualités pour "${query}"</h3><iframe src="https://news.google.com/search?q=${encodeURIComponent(query)}&hl=${hl}" width="100%" height="600" frameborder="0"></iframe></div>`; }
function searchMaps(query) { $('#resultsList').innerHTML = `<iframe width="100%" height="600" src="https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed" frameborder="0" style="padding:0 24px"></iframe>`; }

// RECHERCHE PRINCIPALE AVEC IA
async function search() {
  let q = $('#results').classList.contains('active')? $('#searchInput2').value : $('#searchInput').value;
  q = q.trim(); if(!q) return;
  currentQuery = q; currentOffset = 0; currentFilter = 'all';
  if($('#searchInput')) $('#searchInput').value = q;
  if($('#searchInput2')) $('#searchInput2').value = q;
  saveHistory(q); showPage('results');
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');
  $('#resultsList').innerHTML = `<p style="padding:20px">Recherche en cours...</p>`;

  $('#aiBlock').classList.remove('hidden');
  $('#aiText').innerHTML = `Recherche de la réponse...`;
  getAIAnswer(q);
  await searchWikipedia(q, 0);
}

// IA QUI RESUME WIKIPEDIA
async function getAIAnswer(query) {
  const langCode = currentLang.startsWith('fr')? 'fr' : currentLang.startsWith('en')? 'en' : 'en';
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const results = data.query.search;
    if(results.length === 0) { $('#aiText').innerHTML = `Je n'ai rien trouvé sur "${query}".`; return; }
    let summary = results.map(r => r.snippet.replace(/<[^>]*>/g, '')).join(' ');
    summary = summary.substring(0, 450) + '...';
    $('#aiText').innerHTML = `${summary}<div style="margin-top:8px;font-size:12px;color:#5f6368">Source: Wikipedia</div>`;
  } catch(e) { $('#aiText').innerHTML = `Impossible de générer un aperçu IA.`; }
}

async function searchWikipedia(query, offset) {
  const t = translations[currentLang] || translations['fr-FR'];
  const langCode = currentLang.startsWith('fr')? 'fr' : currentLang.startsWith('en')? 'en' : 'en';
  const limit = 10;
  const url = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&sroffset=${offset}&format=json&origin=*`;
  try {
    const res = await fetch(url); const data = await res.json(); const results = data.query.search; const total = data.query.searchinfo.totalhits;
    if(results.length === 0) { $('#resultsList').innerHTML = `<p style="padding:20px">${t.noResults} "${query}"</p>`; return; }
    const pageIds = results.map(r => r.pageid).join('|');
    const detailsUrl = `https://${langCode}.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=pageimages|info&inprop=url&pithumbsize=150&format=json&origin=*`;
    const detailsRes = await fetch(detailsUrl); const detailsData = await detailsRes.json();
    displayResults(results, detailsData.query.pages, query, total, offset, limit);
  } catch(e) { $('#resultsList').innerHTML = `<p style="padding:20px">Erreur réseau.</p>`; }
}

function displayResults(results, pages, query, total, offset, limit) {
  const t = translations[currentLang] || translations['fr-FR'];
  let html = `<p style="padding:12px 24px;color:#5f6368">${t.resultsFor} <b>${query}</b> - ${total} résultats</p>`;
  html += results.map(r => {
    const page = pages[r.pageid];
    const img = page.thumbnail? `<img src="${page.thumbnail.source}" style="width:120px;height:90px;object-fit:cover;border-radius:8px;margin-right:12px">` : '';
    const url = page.fullurl;
    return `<div style="display:flex;gap:12px;padding:12px 24px;border-bottom:1px solid #eee">${img}<div style="flex:1"><a href="${url}" target="_blank" style="font-size:18px;color:#1A73E8;text-decoration:none">${r.title}</a><div style="color:#006621;font-size:14px">${url}</div><div style="color:#4d5156;font-size:14px;line-height:1.5">${r.snippet.replace(/<[^>]*>/g, '')}...</div><a href="${url}" target="_blank" style="color:#1A73E8;font-size:13px">${t.readMore} →</a></div></div>`;
  }).join('');
  html += `<div style="display:flex;gap:10px;justify-content:center;padding:20px">`;
  if(offset > 0) html += `<button onclick="changePage(-1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">${t.prev}</button>`;
  if(offset + limit < total) html += `<button onclick="changePage(1)" style="padding:8px 16px;cursor:pointer;border:1px solid #dadce0;border-radius:4px;background:white">${t.next}</button>`;
  html += `</div>`; $('#resultsList').innerHTML = html;
}
function changePage(direction) { const limit = 10; currentOffset += direction * limit; if(currentFilter === 'all') searchWikipedia(currentQuery, currentOffset); window.scrollTo(0,0); }

let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Micro non supporté. Utilise Chrome.");
  const t = translations[currentLang] || translations['fr-FR']; recognition = new SpeechRecognition(); recognition.lang = currentLang;
  recognition.onstart = () => { $('#searchInput').placeholder = t.speakNow; };
  recognition.onresult = (event) => { $('#searchInput').value = event.results[0][0].transcript; search(); };
  recognition.onend = () => { $('#searchInput').placeholder = t.searchPlaceholder; }; recognition.start();
}

function setSecurityMode(val) { currentSecurity = val; localStorage.setItem('baobabSecurity', val); $('#strongBanner').classList.toggle('hidden', val!== 'strong'); }
function saveHistory(q) { if($('#saveActivity') &&!$('#saveActivity').checked) return; let h = JSON.parse(localStorage.getItem('hist') || '[]'); localStorage.setItem('hist', JSON.stringify([q,...h.filter(x => x!== q)].slice(0,5))); loadHistory(); }
function loadHistory() { let h = JSON.parse(localStorage.getItem('hist') || '[]'); $('#historyList').innerHTML = h.map(i => `<div class="item" onclick="selectSuggest('${i}')">${i}</div>`).join(''); }
function clearHistory() { localStorage.removeItem('hist'); loadHistory(); alert('Historique effacé'); }

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  if($('#langSelect')){
    $('#langSelect').value = currentLang;
    applyTranslations();
    $('#langSelect').addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('baobabLang', currentLang);
      applyTranslations();
    });
  }
  if($('#themeSelect')){
    $('#themeSelect').value = currentTheme;
    $('#themeSelect').addEventListener('change', (e) => {
      currentTheme = e.target.value;
      localStorage.setItem('baobabTheme', currentTheme);
      applyTheme();
    });
  }
  if($('#safeSearch')){
    $('#safeSearch').value = safeSearch;
    $('#safeSearch').addEventListener('change', (e) => {
      safeSearch = e.target.value;
      localStorage.setItem('baobabSafe', safeSearch);
    });
  }
  if($('#suggestionsToggle')){
    $('#suggestionsToggle').value = suggestionsOn;
    $('#suggestionsToggle').addEventListener('change', (e) => {
      suggestionsOn = e.target.value;
      localStorage.setItem('baobabSuggestions', suggestionsOn);
    });
  }
  if($('#securityMode')) $('#securityMode').value = currentSecurity;

  document.addEventListener('click', (e) => {
    if(!e.target.closest('.search-bar') &&!e.target.closest('.suggestions')) $('#suggestions').classList.add('hidden');
    if(!e.target.closest('#imageMenu') &&!e.target.closest('.icon-btn[title="Recherche par image
