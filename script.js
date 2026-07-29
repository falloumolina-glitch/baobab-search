// ===== BAOBAB SEARCH v1.1 PRO =====
const CONFIG = {
    appName: "Baobab Search",
    version: "1.1 Pro",
    source: "DuckGo"
};

// ÉLÉMENTS DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('results');
const aiOverview = document.getElementById('ai-overview');
const loader = document.getElementById('loader');

// ÉVÉNEMENTS
searchBtn.addEventListener('click', () => handleSearch());
searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSearch() });

function handleSearch() {
    const query = searchInput.value.trim();
    if(!query) return;
    search(query);
}

// FONCTION PRINCIPALE
async function search(query) {
    showLoading(true);
    resultsContainer.innerHTML = '';
    aiOverview.innerHTML = '';
    
    try {
        const [duckData, aiSummary] = await Promise.all([
            fetchDuckGo(query),
            generateAISummary(query)
        ]);
        
        displayAIO verview(aiSummary, query);
        displayWebResults(duckData, query);
        
    } catch(error) {
        resultsContainer.innerHTML = `<p style="color:red; text-align:center; padding:20px;">Erreur de connexion. Vérifie internet.</p>`;
        console.error(error);
    }
    
    showLoading(false);
}

// APPEL API DUCKDUCKGO
async function fetchDuckGo(query) {
    const url = `https://api.duckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('API Error');
    return await res.json();
}

// APERÇU IA - VERSION SIMPLE POUR L'INSTANT
async function generateAISummary(query) {
    // Plus tard on branche Gemini. Là on fait un résumé de base transparent
    return `La <b>${query}</b> désigne l'ensemble des œuvres écrites et orales. 
    Elle inclut roman, poésie, théâtre. Au Sénégal, on retrouve la littérature orale Wolof/Peul 
    et des auteurs comme Senghor, Sembène Ousmane.`;
}

// AFFICHAGE APERÇU IA
function displayAIO verview(summary, query) {
    aiOverview.innerHTML = `
        <div style="background:#F0F4FF; border-left:4px solid #4285F4; padding:16px; border-radius:12px; margin-bottom:24px;">
            <p style="font-size:12px; color:#5F6368; margin:0 0 8px 0;">
                ✨ Aperçu Baobab IA · Source: ${CONFIG.source}, Wikipedia
            </p>
            <h3 style="margin:0 0 8px 0; font-size:20px;">À propos de "${query}"</h3>
            <p style="margin:0; line-height:1.6; color:#3c4043;">${summary}</p>
        </div>
    `;
}

// AFFICHAGE RÉSULTATS
function displayWebResults(data, query) {
    let html = `<h3 style="font-size:16px; color:#70757a; font-weight:400; margin-bottom:16px;">
        Résultats pour "${query}" <span style="font-size:12px;">· Source: ${CONFIG.source}</span>
    </h3>`;
    
    // Résultat principal Wiki/Definition
    if(data.AbstractText) {
        html += `
        <div style="border:1px solid #dadce0; padding:16px; border-radius:12px; margin-bottom:20px;">
            <span style="font-size:12px; color:#70757a;">${data.AbstractURL ? new URL(data.AbstractURL).hostname : CONFIG.source}</span>
            <a href="${data.AbstractURL}" target="_blank" style="font-size:20px; color:#1a0dab; text-decoration:none; display:block; margin:4px 0;">${data.Heading}</a>
            <p style="color:#4d5156; margin:0; line-height:1.5;">${data.AbstractText}</p>
        </div>
        `;
    }
    
    // Autres résultats
    if(data.RelatedTopics && data.RelatedTopics.length > 0) {
        data.RelatedTopics.forEach(item => {
            if(item.FirstURL && item.Text) {
                const url = new URL(item.FirstURL);
                html += `
                <div style="margin-bottom:24px;">
                    <span style="font-size:12px; color:#70757a;">${url.hostname}</span>
                    <a href="${item.FirstURL}" target="_blank" style="font-size:18px; color:#1a0dab; text-decoration:none; display:block; line-height:1.3;">${item.Text.split(' - ')[0]}</a>
                    <p style="color:#4d5156; margin:4px 0; font-size:14px; line-height:1.5;">${item.Text}</p>
                </div>
                `;
            }
        });
    }
    
    // Questions liées
    html += `
    <div style="margin-top:32px; padding-top:16px; border-top:1px solid #dadce0;">
        <h4 style="font-size:16px; margin-bottom:12px;">Questions connexes</h4>
        <div style="cursor:pointer;" onclick="search('Qu\'est-ce que la littérature')"><p>→ Qu'est-ce que la littérature ?</p></div>
        <div style="cursor:pointer;" onclick="search('Genres littéraires')"><p>→ Quels sont les genres littéraires ?</p></div>
        <div style="cursor:pointer;" onclick="search('Auteurs sénégalais')"><p>→ Auteurs sénégalais célèbres</p></div>
    </div>
    `;
    
    resultsContainer.innerHTML = html;
}

// LOADER
function showLoading(isLoading) {
    if(loader) loader.style.display = isLoading ? 'block' : 'none';
    searchBtn.innerText = isLoading ? "Recherche..." : "Rechercher";
    searchBtn.disabled = isLoading;
}
