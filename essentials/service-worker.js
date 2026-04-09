const CACHE = "echo-offline-cache-v2"; // <-- bumped version
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

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE)
                    .map(key => caches.delete(key))
            )
        )
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
