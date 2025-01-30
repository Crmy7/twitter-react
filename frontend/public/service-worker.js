// 📌 Importation de Workbox pour une gestion avancée du cache
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";

// 🏗️ Nettoie les anciens caches obsolètes
cleanupOutdatedCaches();

// 📦 Cache des fichiers statiques (App Shell)
const APP_SHELL_CACHE = "app-shell-v1";
const API_CACHE = "api-cache-v1";

// 📌 Liste des fichiers statiques à pré-cacher
const SHELL_FILES = [
  "/",
  "/manifest.json",
  "assets/index-BcEt2f7G.js",
  "/vite.svg",
];

// 🏗️ Pré-cache des fichiers statiques
precacheAndRoute(self.__WB_MANIFEST || []);

// 📌 Route de mise en cache des fichiers statiques avec `CacheFirst`
registerRoute(
  ({ request }) => SHELL_FILES.includes(new URL(request.url).pathname),
  new CacheFirst()
);

// 📌 Route pour mettre en cache les appels API (Stale-While-Revalidate)
registerRoute(
  ({ url }) => url.origin.includes("localhost:2000/api/"), // Adapte à ton API
  new StaleWhileRevalidate({
    cacheName: API_CACHE,
  })
);

/**
 * 📌 Installation et Activation du Service Worker
 */
self.addEventListener("install", (event) => {
  console.log("📢 Service Worker installé !");
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_FILES);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activé !");
});

/**
 * 📌 Gestion des requêtes réseau avec mise en cache
 */
self.addEventListener("fetch", (event) => {
  const requestUrl = event.request.url;

  // 🎯 Gestion du cache des fichiers statiques
  if (SHELL_FILES.includes(requestUrl.replace(self.location.origin, ""))) {
    event.respondWith(
      caches.open(APP_SHELL_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResult) => {
          if (cachedResult) {
            console.log(
              "📂 Fichier statique servi depuis le cache :",
              requestUrl
            );
            return cachedResult;
          }
          return fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // 🎯 Gestion du cache des appels API
  if (requestUrl.startsWith("http://localhost:2000/api/")) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log("🔄 Données API servies depuis le cache :", requestUrl);
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }
});
