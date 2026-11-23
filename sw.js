// Service Worker — Onde está meu Venancinho? 💗
// Permite instalar como aplicativo nativo no celular (Android e iOS)
const CACHE_NAME = "venancinho-app-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/config.js",
  "./js/data.js",
  "./js/character.js",
  "./js/map.js",
  "./js/sync.js",
  "./assets/venancio-face.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Nunca faz cache de dados do Firebase ou tiles de mapa (sempre busca ao vivo)
  if (
    event.request.method !== "GET" ||
    url.includes("firebaseio.com") ||
    url.includes("firebasedatabase.app") ||
    url.includes("openstreetmap.org") ||
    url.includes("arcgisonline.com")
  ) {
    return;
  }

  // Network-first com fallback para cache (garante atualizações rápidas + abre offline)
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
