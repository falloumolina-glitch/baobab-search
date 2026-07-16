// ========== BAOBAB IA-TECH SCRIPT.JS v2.0 ==========
// Moteur de recherche avec IA + Paramètres + Dark Mode

// 1. NAVIGATION ENTRE PAGES
function showPage(pageId) {
  // Cache toutes les pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Affiche la page demandée
  const targetPage = document.getElementById(pageId);
  if(targetPage){
    targetPage.classList.add('active');
  }
  
  // Scroll en haut
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. BASE DE DONNEES FAKE - A REMPLACER PAR VRAIE API APRES
const fakeDB = {
  "messi": { 
    ai: "Lionel Messi est un footballeur argentin considéré comme l'un des meilleurs joueurs de l'histoire. Il a remporté 8 Ballons d'Or et la Coupe du Monde 2022 avec l'Argentine.", 
    results: [
      {url: "wikipedia.org › wiki › Lionel_Messi", title: "Lionel Messi - Wikipédia", desc: "Lionel Andrés Messi est un footballeur international argentin évoluant au poste d'attaquant à l'Inter Miami."},
      {url: "mls.com › inter-miami › messi", title: "Leo Messi | Inter Miami CF", desc: "Retrouvez toutes les statistiques, buts et actualités de Lionel Messi en MLS."},
      {url: "lequipe.fr › Football › Messi", title: "L'Équipe - Actualités Lionel Messi", desc: "Toute l'actualité de Lionel Messi : transferts, buts, palmarès et interviews exclusives."}
    ] 
  },
  "baobab": { 
    ai: "Le baobab est un arbre emblématique d'Afrique, symbole de sagesse et de longévité. Il peut vivre plus de 1000 ans et stocker jusqu'à 120 000 litres d'eau dans son tronc.", 
    results: [
      {url: "baobab.sn", title: "Baobab Search - L'IA de la connaissance", desc: "Le premier moteur de recherche intelligent d'Afrique. Rapide, privé et propulsé par l'IA."},
      {url: "wikipedia.org › wiki › Baobab", title: "Baobab - Wikipédia", desc: "Les baobabs sont un genre d'arbres de la famille des Malvacées, originaires d'Afrique, d'Australie et d'Asie."}
    ] 
  },
  "senegal": {
    ai: "Le Sénégal est un pays d'Afrique de l'Ouest. Sa capitale est Dakar. Il est connu pour sa culture, sa musique et sa stabilité démocratique.",
    results: [
      {url: "wikipedia.org › wiki › Senegal", title: "Sénégal - Wikipédia", desc: "Le Sénégal, en forme longue la République du Sénégal, est un pays d'Afrique de l'Ouest."}
    ]
  },
  "default": { 
    ai: `Je suis Baobab IA. Je n'ai pas trouvé de résumé pour cette requête. Essayez "messi", "baobab" ou "senegal".`, 
    results: [] 
  }
};

// 3. FONCTION DE RECHERCHE PRINCIPALE
function search(e) {
  e.preventDefault(); // Empêche de recharger la page
  
  const input1 = document.getElementById('searchInput');
  const input2 = document.getElementById('searchInput2');
  const query = (input1 && input1.value) || (input2 && input2.value);
  
  if(!query || query.trim() === '') return;

  // Passe à la page résultats
  showPage('resultsPage');
  
  // Copie la requête dans la barre du haut
  if(input2) input2.value = query;

  // Récupère les paramètres
  const aiOn = localStorage.getItem('aiSummary') !== 'false';
  const data = fakeDB[query.toLowerCase()] || fakeDB['default'];

  // Affiche ou cache le résumé IA
  const aiSummaryDiv = document.getElementById('aiSummary');
  if(aiSummaryDiv) aiSummaryDiv.style.display = aiOn ? 'block' : 'none';
  
  // Injecte les données
  document.getElementById('aiText').innerText = data.ai;
  document.getElementById('resultCount').innerText = `Environ ${data.results.length} résultats (0.28 s)`;

  // Affiche la liste des résultats
  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  
  if(data.results.length === 0){
    list.innerHTML = `<p class="text-gray-500 dark:text-gray-400 mt-4">Aucun résultat trouvé pour "<b>${query}</b>"</p>`;
  } else {
    data.results.forEach(r => {
      list.innerHTML += `
        <div class="mb-6">
          <div class="text-sm text-green-700 dark:text-green-400 truncate">${r.url}</div>
          <a href="#" class="text-xl text-blue-700 dark:text-blue-400 hover:underline">${r.title}</a>
          <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">${r.desc}</p>
        </div>
      `;
    });
  }
}

// 4. BOUTON "J'AI DE LA CHANCE"
function luckySearch(e) {
  if(e) e.preventDefault();
  const input = document.getElementById('searchInput');
  if(input) input.value = 'baobab';
  search(e);
}

// 5. GESTION DES PARAMETRES
function saveSettings() {
  const safeSearchEl = document.getElementById('safeSearch');
  const aiToggleEl = document.getElementById('aiSummaryToggle');
  const themeEl = document.querySelector('input[name="theme"]:checked');

  if(safeSearchEl) localStorage.setItem('safeSearch', safeSearchEl.checked);
  if(aiToggleEl) localStorage.setItem('aiSummary', aiToggleEl.checked);
  if(themeEl) {
    localStorage.setItem('theme', themeEl.value);
    applyTheme(themeEl.value);
  }

  // Message de confirmation
  const msg = document.getElementById('saveMsg');
  if(msg){
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
  }
}

function clearHistory(){
  if(confirm("Voulez-vous vraiment effacer tout l'historique et les paramètres ?")){
    localStorage.clear();
    alert('Historique et paramètres effacés');
    location.reload();
  }
}

function applyTheme(theme) {
  if(theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 6. CHARGEMENT AU DEMARRAGE
document.addEventListener('DOMContentLoaded', () => {
  // Charge SafeSearch
  const safeSearchEl = document.getElementById('safeSearch');
  if(safeSearchEl && localStorage.getItem('safeSearch') === 'true') {
    safeSearchEl.checked = true;
  }
  
  // Charge Résumé IA
  const aiToggleEl = document.getElementById('aiSummaryToggle');
  if(aiToggleEl && localStorage.getItem('aiSummary') === 'false') {
    aiToggleEl.checked = false;
  }
  
  // Charge le Thème
  const savedTheme = localStorage.getItem('theme') || 'light';
  const themeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
  if(themeRadio) themeRadio.checked = true;
  applyTheme(savedTheme);
});
