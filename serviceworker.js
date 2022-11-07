const cacheName = "gie_cache_v12";
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