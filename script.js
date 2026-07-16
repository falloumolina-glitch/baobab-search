// ========== BAOBAB IA-TECH SCRIPT.JS v1.0 ==========

// NAVIGATION
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0,0);
}

// BASE DE DONNEES FAKE
const fakeDB = {
  "messi": {
    ai: "Lionel Messi est un footballeur argentin considéré comme l'un des meilleurs joueurs de l'histoire. 8 Ballons d'Or et vainqueur de la Coupe du Monde 2022.",
    knowledge: "Lionel Andrés Messi. Footballeur argentin. Né 24/06/1987 à Rosario.",
    results: [
      {url: "wikipedia.org > Lionel_Messi", title: "Lionel Messi - Wikipédia", desc: "Lionel Andrés Messi est un footballeur international argentin évoluant au poste d'attaquant."},
      {url: "mls.com > inter-miami", title: "Leo Messi | Inter Miami CF", desc: "Retrouvez toutes les statistiques et actualités de Lionel Messi en MLS."}
    ]
  },
  "baobab": {
    ai: "Le baobab est un arbre emblématique d'Afrique, symbole de sagesse. Il peut vivre 1000 ans et stocker 120 000L d'eau dans son tronc.",
    knowledge: "Baobab. Arbre. Famille des Malvacées. Origine: Afrique. Surnom: Arbre à l'envers.",
    results: [
      {url: "baobab.sn", title: "Baobab Search - L'IA de la connaissance", desc: "Le premier moteur de recherche intelligent d'Afrique. Rapide, privé et propulsé par l'IA."}
    ]
  },
  "default": {
    ai: "Je suis Baobab IA. Je n'ai pas trouvé d'informations spécifiques pour cette requête.",
    knowledge: "Aucune donnée disponible.",
    results: []
  }
};

// RECHERCHE
function search(e) {
  e.preventDefault();
  const query = document.getElementById('searchInput').value || document.getElementById('searchInput2').value;
  if(!query) return;

  showPage('resultsPage');
  document.getElementById('searchInput2').value = query;

  const aiOn = localStorage.getItem('aiSummary')!== 'false';
  const data = fakeDB[query.toLowerCase()] || fakeDB['default'];

  document.getElementById('aiSummary').style.display = aiOn? 'block' : 'none';
  document.getElementById('aiText').innerText = data.ai;
  document.getElementById('knowledgeText').innerText = data.knowledge;
  document.getElementById('resultCount').innerText = `Environ ${data.results.length} résultats (0.32 s)`;

  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  data.results.forEach(r => {
    list.innerHTML += `<div class="mb-6"><div class="text-sm text-green-700 dark:text-green-400">${r.url}</div><a href="#" class="text-xl text-blue-700 hover:underline">${r.title}</a><p class="text-sm text-gray-700 dark:text-gray-300 mt-1">${r.desc}</p></div>`;
  });
}

function luckySearch() {
  document.getElementById('searchInput').value = 'baobab';
  search(event);
}

// PARAMETRES
function saveSettings() {
  localStorage.setItem('safeSearch', document.getElementById('safeSearch').checked);
  localStorage.setItem('aiSummary', document.getElementById('aiSummaryToggle').checked);
  const theme = document.querySelector('input[name="theme"]:checked').value;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
  document.getElementById('saveMsg').classList.remove('hidden');
  setTimeout(() => document.getElementById('saveMsg').classList.add('hidden'), 2000);
}

function applyTheme(theme) {
  if(theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

// CHARGEMENT
document.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('safeSearch') === 'true') document.getElementById('safeSearch').checked = true;
  if(localStorage.getItem('aiSummary') === 'false') document.getElementById('aiSummaryToggle').checked = false;
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.querySelector(`input[name="theme"][value="${savedTheme}"]`).checked = true;
  applyTheme(savedTheme);
});
