// ========== BAOBAB IA-TECH SCRIPT.JS v1.1 CORRIGE ==========

// 1. NAVIGATION SANS BUG
function showPage(pageId) {
  // On cache toutes les pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  
  // On affiche la bonne page
  const targetPage = document.getElementById(pageId);
  if(targetPage){
    targetPage.classList.add('active');
  }
  
  // On scroll en haut
  window.scrollTo(0,0);
}

// 2. BASE DE DONNEES FAKE
const fakeDB = {
  "messi": {
    ai: "Lionel Messi est un footballeur argentin considéré comme l'un des meilleurs joueurs de l'histoire. 8 Ballons d'Or et vainqueur de la Coupe du Monde 2022.",
    knowledge: "Lionel Andrés Messi. Footballeur argentin. Né 24/06/1987 à Rosario. Club: Inter Miami.",
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
    ai: "Je suis Baobab IA. Je n'ai pas trouvé d'informations spécifiques pour cette requête. Essayez 'messi' ou 'baobab'.",
    knowledge: "Aucune donnée disponible.",
    results: []
  }
};

// 3. RECHERCHE
function search(e) {
  e.preventDefault(); // Important pour ne pas recharger la page
  
  const input1 = document.getElementById('searchInput');
  const input2 = document.getElementById('searchInput2');
  const query = (input1 && input1.value) || (input2 && input2.value);
  
  if(!query || query.trim() === '') return;

  showPage('resultsPage');
  
  if(input2) input2.value = query; // Copie la requête en haut

  // Récupère les paramètres AVANT d'afficher
  const aiOn = localStorage.getItem('aiSummary') !== 'false';
  const data = fakeDB[query.toLowerCase()] || fakeDB['default'];

  // Affiche le résumé IA si activé
  const aiSummaryDiv = document.getElementById('aiSummary');
  if(aiSummaryDiv) aiSummaryDiv.style.display = aiOn ? 'block' : 'none';
  
  document.getElementById('aiText').innerText = data.ai;
  document.getElementById('knowledgeText').innerText = data.knowledge;
  document.getElementById('resultCount').innerText = `Environ ${data.results.length} résultats (0.32 s)`;

  // Affiche la liste des résultats
  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  if(data.results.length === 0){
    list.innerHTML = `<p class="text-gray-500">Aucun résultat trouvé pour "${query}"</p>`;
  } else {
    data.results.forEach(r => {
      list.innerHTML += `<div class="mb-6"><div class="text-sm text-green-700 dark:text-green-400">${r.url}</div><a href="#" class="text-xl text-blue-700 hover:underline">${r.title}</a><p class="text-sm text-gray-700 dark:text-gray-300 mt-1">${r.desc}</p></div>`;
    });
  }
}

function luckySearch() {
  const input = document.getElementById('searchInput');
  if(input) input.value = 'baobab';
  search(event);
}

// 4. PARAMETRES 100% FONCTIONNELS
function saveSettings() {
  const safeSearchEl = document.getElementById('safeSearch');
  const aiToggleEl = document.getElementById('aiSummaryToggle');
  const themeEl = document.querySelector('input[name="theme"]:checked');

  if(safeSearchEl) localStorage.setItem('safeSearch', safeSearchEl.checked);
  if(aiToggleEl) localStorage.setItem('aiSummary', aiToggleEl.checked);
  if(themeEl) localStorage.setItem('theme', themeEl.value);
  
  applyTheme(themeEl ? themeEl.value : 'light');

  // Message de confirmation
  const msg = document.getElementById('saveMsg');
  if(msg){
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
  }
}

function applyTheme(theme) {
  if(theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 5. CHARGEMENT AU DEMARRAGE - CORRIGE
document.addEventListener('DOMContentLoaded', () => {
  // On charge les paramètres seulement si les éléments existent
  const safeSearchEl = document.getElementById('safeSearch');
  const aiToggleEl = document.getElementById('aiSummaryToggle');
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  if(safeSearchEl && localStorage.getItem('safeSearch') === 'true') {
    safeSearchEl.checked = true;
  }
  
  if(aiToggleEl && localStorage.getItem('aiSummary') === 'false') {
    aiToggleEl.checked = false;
  }
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  const themeToCheck = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
  if(themeToCheck) themeToCheck.checked = true;
  
  applyTheme(savedTheme);
});
