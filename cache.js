const cacheName = "gie_cache_v8";
const cachedFiles = [
  "manifest.json",
  "assets/",
  "favicon.ico",
  "icon.png",
  "index.html",
  "style.css",
  "script.js"
];

// Cache files
self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(cachedFiles);
  })());
});

// Delete old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) return;
      return caches.delete(key);
    }));
  }));
});