self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open("your-cache-name")
      .then(function (cache) {
        return cache.addAll([
          "/index.html",
          "/",
          // Add other resources you want to cache
        ]);
      })
      .catch(function (error) {
        console.log("Cache installation failed:", error);
      })
  );
  // Delete old caches
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Filter out the old cache(s) by name
            // E.g., if you previously used 'your-cache-name', change it here
            return cacheName !== "your-cache-name";
          })
          .map(function (cacheName) {
            // Delete the old cache(s)
            return caches.delete(cacheName);
          })
      );
    })
  );
});
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (response) {
        // Return the cached version if available, or fetch it from the network
        return response || fetch(event.request);
      })
      .catch(function (error) {
        console.log("Cache retrieval failed:", error);
      })
  );
});
