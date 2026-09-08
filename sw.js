// sw.js - Service Worker para habilitar la instalación de la PWA
const CACHE_NAME = 'trail-portal-v7.9';
const ASSETS = [
    './index.html',
    './afiche.html',
    './index.css',
    './app.js',
    './config.js',
    './manifest.json',
    './IMAGENES/LOGO CLUB.png'
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

    // Network-First para HTML, JS, CSS y JSON para evitar servir contenido viejo
    const url = e.request.url;
    if (url.endsWith('.html') || url.endsWith('/') || url.endsWith('.json') || url.endsWith('.js') || url.endsWith('.css')) {
        e.respondWith(
            fetch(e.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(e.request))
        );
        return;
    }

    // Cache-First para imágenes y assets estáticos pesados
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});

