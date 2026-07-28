// Service Worker Baobab Search - VERSION SANS CACHE

self.addEventListener('install', (event) => {
  // On installe et on passe direct
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // On active direct
  event.waitUntil(self.clients.claim());
});

// IMPORTANT : On ne met rien en cache
// On laisse toutes les requêtes passer normalement
self.addEventListener('fetch', (event) => {
  // Ne fait rien. Laisse le navigateur gérer
  return;
});
