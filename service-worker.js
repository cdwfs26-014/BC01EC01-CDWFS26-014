const CACHE_NAME = 'devis-reno-cache-v1';
const URLS_TO_CACHE = [
    'index.html',
    'prestation.html',
    'style.css',
    'main.js',
    'img/marbres.jpg',
    'img/globe.png',
    'img/smiley.png',
    'img/star.png',
    'img/thunder.png',
    'img/flavicon.jpg',
    'img/flavicon512.jpg',
    'img/travaux1.webp',
    'img/travaux2.webp',
    'img/travaux3.webp',
    'img/travaux4.webp',
    'img/banniere.webp'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
              .then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return cached || fetchPromise;
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});
