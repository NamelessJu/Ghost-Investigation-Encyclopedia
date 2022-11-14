const cacheName = "gie_cache_v25";
const cachedFiles = [
  "manifest.json",
  "favicon.ico",
  "icon.png",
  "icon-maskable.png",
  "index.html",
  "style.css",
  "script.js"
];

// Cache files
self.addEventListener("install", 
  e => e.waitUntil(
    caches.open(cacheName).then(
      cache => cache.addAll(cachedFiles)
    )
  )
);

// Delete old caches
self.addEventListener("activate", 
  e => e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key === cacheName) return;
        return caches.delete(key);
      }));
    })
  )
);

// Load page ("cache first")
self.addEventListener("fetch", e => {
  e.respondWith((async () => {
    const cacheResult = await caches.match(e.request);
    if (cacheResult) return cacheResult;

    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    cache.put(e.request, response.clone());
    return response;
  })());
});