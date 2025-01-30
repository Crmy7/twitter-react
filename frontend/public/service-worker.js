import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from "workbox-strategies";
import { openDB } from "idb";

// 🏗️ Nettoyage des anciens caches
cleanupOutdatedCaches();

// 📦 Pré-cache automatique des fichiers statiques générés par Vite
precacheAndRoute(self.__WB_MANIFEST);

// 📌 Mise en cache des fichiers statiques (JS, CSS, images)
registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image",
  new CacheFirst({
    cacheName: "static-resources",
  })
);

// 📌 Mise en cache des API avec StaleWhileRevalidate
registerRoute(
  ({ url }) =>
    url.origin === "http://localhost:2000" && url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: "api-cache",
  })
);

// 📌 Ajout de `NetworkFirst` pour gérer certaines requêtes dynamiques
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/posts"),
  new NetworkFirst({
    cacheName: "dynamic-api",
  })
);

// ✨ Gestion de la synchronisation en arrière-plan pour les posts
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-new-posts") {
    event.waitUntil(syncPosts());
  }
});

// 🔄 Fonction de synchronisation hors ligne
const syncPosts = async () => {
  const db = await openDB("offline-sync", 1);
  const tx = db.transaction("posts", "readwrite");
  const store = tx.objectStore("posts");

  const posts = await store.getAll();
  for (const post of posts) {
    try {
      const response = await fetch("http://localhost:2000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${post.token}`,
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        console.log("✅ Post synchronisé :", post);
        await store.delete(post.id);
      } else {
        console.error("❌ Erreur de synchronisation :", response.statusText);
      }
    } catch (error) {
      console.error("❌ Synchronisation échouée :", error);
    }
  }
};
