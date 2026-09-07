// sw.js - Service Worker para habilitar la instalación de la PWA
const CACHE_NAME = 'trail-portal-v3.9';
const ASSETS = [
    './index.html',
    './index.css',
    './app.js',
    './config.js',
    './manifest.json',
    './IMAGENES/LOGO.jpg'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch((err) => {
                console.warn('Fallo al precargar recursos en caché del SW:', err);
            });
        })
    );
});

self.addEventListener('activate', (e) => {
    self.clients.claim();
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Solo cachear peticiones GET de nuestro propio origen
    if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
        return;
    }
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // Devolver del caché si existe, si no hacer fetch normal
            return cachedResponse || fetch(e.request);
        })
    );
});
