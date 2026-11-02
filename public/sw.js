const CACHE_VERSION = 5
const CACHE_NAME = `ks-beauty-cache-v${CACHE_VERSION}`
const ASSETS_TO_CACHE = []

// Clean up all existing caches immediately on install
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Pass everything to network - no caching interference
self.addEventListener("fetch", () => {});

