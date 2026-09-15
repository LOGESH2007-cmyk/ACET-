/* =====================================================================
   ACET CodeMentor AI - Service Worker (Offline-First PWA)
   Caches all app assets for instant load & full offline use.
   ===================================================================== */

const CACHE_NAME = 'acet-codementor-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/editor.css',
  './css/ai-tutor.css',
  './css/visualizer.css',
  './css/dashboard.css',
  './js/app.js',
  './js/state.js',
  './js/curriculum.js',
  './js/compiler.js',
  './js/ai-error-detector.js',
  './js/ai-tutor.js',
  './js/line-explainer.js',
  './js/hint-system.js',
  './js/mistake-detector.js',
  './js/algorithm-visualizer.js',
  './js/ui.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/hero_banner.jpg',
  './assets/diagnostic_banner.jpg'
];

// ── Install: cache all static assets ─────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing ACET CodeMentor AI Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[SW] All assets cached. Skipping waiting.');
      return self.skipWaiting();
    }).catch((err) => {
      console.warn('[SW] Pre-cache partial failure (some assets may be missing):', err);
    })
  );
});

// ── Activate: clean up old caches ────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => {
      console.log('[SW] Activation complete. Now controlling all clients.');
      return self.clients.claim();
    })
  );
});

// ── Fetch: Cache-First with Network Fallback ─────────────────────────
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (CDN fonts etc. handled by browser)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache, refresh cache in background
        const networkFetch = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return networkResponse;
        }).catch(() => { /* offline – cache is already served */ });

        return cachedResponse;
      }

      // Not in cache – fetch from network and cache it
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const cloned = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return networkResponse;
      }).catch(() => {
        // Offline and not cached – return offline page if HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── Message handler for manual cache clearing from app ───────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});
