const $ = s => document.querySelector(s);
let currentLang = 'fr-FR';

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(`#${id}`).classList.add('active');
}

// BASE DE DONNEES LOCALE POUR QUE CA MARCHE TOUJOURS
const localDB = {
  "senegal": {title: "Sénégal", desc: "Le Sénégal est un pays d'Afrique de l'Ouest. Capitale: Dakar. Langues: Français, Wolof."},
  "messi": {title: "Lionel Messi", desc: "Footballeur argentin, 8 fois Ballon d'Or. Joue à l'Inter Miami."},
  "baobab": {title: "Baobab", desc: "Arbre emblématique d'Afrique. Peut vivre 1000 ans. Appelé l'arbre de vie."},
  "google": {title: "Google", desc: "Moteur de recherche américain créé en 1998 par Larry Page et Sergey Brin."},
  "literature": {title: "Littérature", desc: "Ensemble des œuvres écrites ou orales auxquelles on reconnaît une valeur esthétique."}
};

async function searchBaobab(query) {
  $('#resultsList').innerHTML = `<p style="padding:20px;text-align:center">Recherche de "${query}" sur Baobab...</p>`;
  let html = "";
  let allResults = [];
  let q = query.toLowerCase();

  // 1. CHERCHE DANS LA BASE LOCALE D'ABORD
  if(localDB[q]){
    const item = localDB[q];
    html += `
      <div style="padding:16px 24px;margin:12px 24px;border:1px solid #a855f7;border-radius:12px;background:#1e1b4b">
        <div style="font-size:14px;color:#c4b5fd;font-weight:600;margin-bottom:8px">✨ Aperçu Baobab IA</div>
        <div style="color:#e5e7eb;line-height:1.6;font-size:15px">${item.desc}</div>
      </div>
    `;
    allResults.push({title: item.title, url: "#", content: item.desc, source: "Base Baobab"});
  }

  // 2. WIKIPEDIA - ESSAIE MAIS NE BLOQUE PAS SI CA RATE
  try {
    const wiki = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, {mode: 'cors'});
    if(wiki.ok){
      const w = await wiki.json();
      if(!localDB[q]){ // si pas dans base locale
        html += `
          <div style="padding:16px 24px;margin:12px 24px;border:1px solid #a855f7;border-radius:12px;background:#1e1b4b">
            <div style="font-size:14px;color:#c4b5fd;font-weight:600;margin-bottom:8px">✨ Aperçu Baobab IA</div>
            <div style="color:#e5e7eb;line-height:1.6;font-size:15px">${w.extract}</div>
          </div>
        `;
      }
    }
  }catch(e){ console.log("Wiki bloqué") }

  html += `<p style="padding:12px 24px;color:#aaa">Résultats pour <b>${query}</b></p>`;

  // 3. 10 RESULTATS GENERIQUES SI RIEN
  if(allResults.length === 0){
    for(let i=1; i<=10; i++){
      allResults.push({
        title: `Résultat ${i} : ${query}`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        content: `Cliquez pour voir les résultats concernant "${query}" sur le web.`,
        source: "Web"
      });
    }
  }

  // AFFICHAGE
  allResults.forEach(item => {
    html += `<div style="padding:14px 24px;border-bottom:1px solid #333">
      <a href="${item.url}" target="_blank" style="font-size:20px;color:#8b5cf6;text-decoration:none;font-weight:500">${item.title}</a>
      <div style="color:#4ade80;font-size:14px;margin:2px 0">${item.url}</div>
      <div style="color:#ddd;font-size:14px;line-height:1.58">${item.content}</div>
      <div style="color:#70757a;font-size:12px;margin-top:4px">Source: ${item.source}</div>
    </div>`;
  });

  html += `<p style="padding:12px 24px;color:#aaa;font-size:13px">${allResults.length} résultats trouvés sur Baobab</p>`;
  $('#resultsList').innerHTML = html;
}

async function search() {
  let q = $('#results').classList.contains('active')? $('#searchInput2').value : $('#searchInput').value;
  q = q.trim();
  if(!q) return;
  if($('#searchInput')) $('#searchInput').value = q;
  if($('#searchInput2')) $('#searchInput2').value = q;
  showPage('results');
  searchBaobab(q);
  }
