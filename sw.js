const CACHE_NAME = 'platofacil-v3';
const ASSETS_TO_CACHE = [
    './index.html',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación: Guardar archivos en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE).then(() => {
                    // Intentamos guardar los iconos, pero si fallan (no existen), no rompemos la app
                    return cache.addAll(['./icon-192.png', './icon-512.png']).catch(err => console.log('Iconos opcionales no encontrados'));
                });
            })
    );
});

// Activación: Limpiar cachés viejas si actualizas la versión
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Interceptar peticiones: Servir desde caché si existe, sino buscar en red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en caché, devolverlo
                if (response) {
                    return response;
                }
                // Si no, buscar en internet
                return fetch(event.request);
            })
    );
});