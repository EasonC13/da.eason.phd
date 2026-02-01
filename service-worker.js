const CACHE_VERSION = 'v2';
const CACHE_NAME = `text-editor-${CACHE_VERSION}`;

// Install: skip waiting to activate immediately
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// Activate: delete all old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return cacheName !== CACHE_NAME;
          })
          .map(function(cacheName) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Cache the new response
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});
