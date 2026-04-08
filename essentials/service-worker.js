const CACHE = "echo-offline-cache-v1";
const OFFLINE_URL = "/essentials/offline-page.html";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll([
                OFFLINE_URL
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(cached => {
                if (cached) return cached;
                return caches.match(OFFLINE_URL);
            });
        })
    );
});