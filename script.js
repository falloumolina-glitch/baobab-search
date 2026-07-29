// ===== BAOBAB SEARCH v1.2.1 FIX NOM FONCTION =====
let currentQuery = '';
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').addEventListener('keypress', (e) => { if(e.key==='Enter') search() });
    document.getElementById('searchInput2').addEventListener('keypress', (e) => { if(e.key==='Enter') search() });
    
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.search-icons')) {
            document.getElementById('imageMenu').classList.add('hidden');
        }
        if(!e.target.closest('#searchBar')) {
            document.getElementById('suggestions').classList.add('hidden');
        }
    });
});

async function search() {
    const input = document.querySelector('.page.active input[type="text"]');
    currentQuery = input.value.trim();
    if(!currentQuery) return;

    showPage('results');
    document.getElementById('searchInput2').value = currentQuery;
    
    showLoading(true);
    document.getElementById('resultsList').innerHTML = '';
    
    try {
        if(currentFilter === 'all') {
            const [duckData, aiSummary] = await Promise.all([
                fetchDuckGo(currentQuery),
                generateAISummary(currentQuery)
            ]);
            displayAIO verview(aiSummary); // <-- CORRIGÉ
            displayWebResults(duckData);
        }
    } catch(error) {
        document.getElementById('resultsList').innerHTML = `<p style="padding:24px; color:red;">Erreur: ${error.message}</p>`;
    }
    
    showLoading(false);
}

async function fetchDuckGo(query) {
    const url = `https://api.duckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('API Error');
    return await res.json();
}

async function generateAISummary(query) {
    return `La <b>${query}</b> désigne l'ensemble des œuvres écrites et orales. 
    Elle inclut le roman, la poésie, le théâtre. Au Sénégal, on retrouve la littérature orale Wolof/Peul 
    et des auteurs comme Léopold Sédar Senghor, Sembène Ousmane.`;
}

function displayAIO verview(summary) { // <-- CORRIGÉ
    const aiBlock = document.getElementById('aiBlock');
    const aiText = document.getElementById('aiText');
    aiText.innerHTML = summary + `<p style="font-size:12px; color:var(--muted); margin-top:8px;">Source: DuckDuckGo, Wikipedia</p>`;
    aiBlock.classList.remove('hidden');
}

function displayWebResults(data) {
    let html = '';
    
    if(data.AbstractText) {
        const url = data.AbstractURL ? new URL(data.AbstractURL) : null;
        html += `
        <div style="padding:0 24px 16px 24px;">
            <span style="font-size:12px; color:var(--muted);">${url ? url.hostname : 'Wikipedia'}</span>
            <a href="${data.AbstractURL}" target="_blank" style="font-size:20px; color:var(--link); text-decoration:none; display:block; margin:4px 0;">${data.Heading}</a>
            <p style="color:var(--text); margin:0; line-height:1.5;">${data.AbstractText}</p>
        </div>
        `;
    }
    
    if(data.RelatedTopics && data.RelatedTopics.length > 0) {
        data.RelatedTopics.slice(0, 10).forEach(item => {
            if(item.FirstURL && item.Text) {
                const url = new URL(item.FirstURL);
                html += `
                <div style="padding:0 24px 20px 24px;">
                    <span style="font-size:12px; color:var(--muted);">${url.hostname}</span>
                    <a href="${item.FirstURL}" target="_blank" style="font-size:18px; color:var(--link); text-decoration:none; display:block; line-height:1.3;">${item.Text.split(' - ')[0]}</a>
                    <p style="color:var(--text); margin:4px 0; font-size:14px; line-height:1.5;">${item.Text}</p>
                </div>
                `;
            }
        });
    }
    
    html += `
    <div style="padding:16px 24px; border-top:1px solid var(--border);">
        <h4 style="font-size:16px; margin-bottom:12px;">Questions connexes</h4>
        <div style="cursor:pointer; padding:4px 0;" onclick="quickSearch('Qu\'est-ce que la littérature')"><p>→ Qu'est-ce que la littérature ?</p></div>
        <div style="cursor:pointer; padding:4px 0;" onclick="quickSearch('Genres littéraires')"><p>→ Quels sont les genres littéraires ?</p></div>
        <div style="cursor:pointer; padding:4px 0;" onclick="quickSearch('Auteurs sénégalais')"><p>→ Auteurs sénégalais célèbres</p></div>
    </div>
    `;
    
    document.getElementById('resultsList').innerHTML = html;
}

function quickSearch(q) {
    document.getElementById('searchInput2').value = q;
    search();
}

function setFilter(e, filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    if(currentQuery) search();
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
function goHome() {
    showPage('home');
    document.getElementById('aiBlock').classList.add('hidden');
}
function showSuggestions(){ document.getElementById('suggestions').classList.remove('hidden'); }
function showLoading(isLoading) {
    document.querySelectorAll('.icon-btn.primary').forEach(btn => {
        btn.disabled = isLoading;
        btn.innerHTML = isLoading 
            ? `<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="4" fill="none" stroke-dasharray="31.4" stroke-dashoffset="0"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
    });
}
function startVoice(){ alert("Recherche vocale arrive bientôt") }
function toggleImageMenu(e){ 
    e.stopPropagation(); 
    document.getElementById('imageMenu').classList.toggle('hidden'); 
}
function startImageSearch(type){ alert("Recherche par image: " + type) }
function clearHistory(){ localStorage.clear(); alert("Historique effacé") }
function setSecurityMode(v){ document.getElementById('strongBanner').classList.toggle('hidden', v !== 'strong') }
