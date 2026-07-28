// Service Worker Baobab Search - VERSION SANS CACHE

self.addEventListener('install', (event) => {
  // Installation immédiate
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Activation immédiate
  event.waitUntil(self.clients.claim());
});

// Aucun cache : toutes les requêtes passent normalement
self.addEventListener('fetch', (event) => {
  return;
});
