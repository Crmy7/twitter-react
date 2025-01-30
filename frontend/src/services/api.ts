import axios from "axios";
import Cookies from "js-cookie";
import { openDB, deleteDB } from "idb";

const BASE_URL = "http://localhost:2000/api";

/**
 * 📌 Vérifie et initialise IndexedDB si nécessaire
 */
const initializeDB = async () => {
  try {
    const db = await openDB("offline-sync", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("posts")) {
          db.createObjectStore("posts", { keyPath: "id", autoIncrement: true });
          console.log("✅ Object Store 'posts' créé !");
        }
      },
    });
    return db;
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation d'IndexedDB :", error);
  }
};

/**
 * 📌 Vérifie si IndexedDB est disponible
 */
const isIndexedDBAvailable = () => {
  return "indexedDB" in window;
};

/**
 * 📌 Supprime et réinitialise IndexedDB si corrompu
 */
const resetIndexedDB = async () => {
  console.warn("⚠️ Suppression et réinitialisation d'IndexedDB...");
  await deleteDB("offline-sync");
  await initializeDB();
};

/**
 * 📌 Sauvegarde un post en mode hors ligne dans IndexedDB
 */
async function saveForLater(data: any) {
  if (!isIndexedDBAvailable()) {
    console.warn("⚠️ IndexedDB non disponible, sauvegarde impossible.");
    return;
  }

  const token = Cookies.get("token");
  if (!token) {
    console.warn("⚠️ Aucun token disponible. Impossible de sauvegarder.");
    return;
  }

  const db = await initializeDB();
  if (!db) {
    console.error("❌ Impossible d'accéder à IndexedDB.");
    return;
  }

  try {
    await db.add("posts", { ...data, token });
    console.log("📌 Post sauvegardé en mode hors ligne.");
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      console.error(
        "❌ Object Store 'posts' manquant. Réinitialisation de la base..."
      );
      await resetIndexedDB();
    } else {
      console.error("❌ Erreur lors de l'ajout du post à IndexedDB :", error);
    }
  }

  // ✅ Vérification si Background Sync est supporté AVANT d'appeler sync.register
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const serviceWorker: any = await navigator.serviceWorker.ready;
      await serviceWorker.sync.register("sync-new-posts");
      console.log("📌 Synchronisation en arrière-plan enregistrée.");
    } catch (error) {
      console.error(
        "❌ Échec de l'enregistrement de la synchronisation :",
        error
      );
    }
  } else {
    console.warn("⚠️ Background Sync non supporté, utilisation d'un fallback.");
    fallbackSyncPosts();
  }
}

/**
 * 🔄 Fallback: Vérification et synchronisation manuelle des posts stockés
 */
const fallbackSyncPosts = async () => {
  if (!navigator.onLine || !isIndexedDBAvailable()) return;

  const db = await initializeDB();
  if (!db) {
    console.error("❌ IndexedDB indisponible, synchronisation annulée.");
    return;
  }

  const store = db.transaction("posts", "readonly").objectStore("posts");

  try {
    const posts = await store.getAll();
    for (const post of posts) {
      try {
        const response = await fetch(`${BASE_URL}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${post.token}`,
          },
          body: JSON.stringify(post),
        });

        if (response.ok) {
          console.log("✅ Post synchronisé (Fallback) :", post);
          const deleteTx = db.transaction("posts", "readwrite");
          await deleteTx.objectStore("posts").delete(post.id);
          await deleteTx.done;
        }
      } catch (error) {
        console.error("❌ Erreur de synchronisation (Fallback) :", error);
      }
    }
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      console.error("❌ Object Store 'posts' manquant. Réinitialisation...");
      await resetIndexedDB();
    } else {
      console.error("❌ Erreur lors de la lecture d'IndexedDB :", error);
    }
  }
};

// 📌 Détection du retour en ligne et exécution du fallback
window.addEventListener("online", () => {
  console.log("🌐 Reconnexion détectée, tentative de synchronisation...");
  fallbackSyncPosts();
});

/**
 * 📌 Création d’un post en ligne ou sauvegarde locale si hors ligne
 */
export const createPost = async (post: {
  content: string;
  imageUrl?: string;
}) => {
  const token = Cookies.get("token");

  if (!token) {
    console.error(
      "❌ Impossible de créer le post : utilisateur non authentifié."
    );
    return;
  }

  if (!navigator.onLine) {
    console.warn("🚨 Mode hors ligne détecté. Sauvegarde locale du post...");
    await saveForLater(post);
    return {
      message: "Post sauvegardé hors ligne et sera synchronisé plus tard.",
    };
  }

  try {
    const response = await axios.post(`${BASE_URL}/posts`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la création du post :", error);
    await saveForLater(post);
  }
};

/**
 * 📌 Inscription d’un utilisateur
 */
export const registerUser = async (
  username: string,
  password: string
): Promise<string> => {
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    username,
    password,
  });
  const token = response.data.token;
  Cookies.set("token", token, { expires: 7 });
  return token;
};

/**
 * 📌 Connexion d’un utilisateur
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<string> => {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    username,
    password,
  });
  const token = response.data.token;
  Cookies.set("token", token, { expires: 7 });
  return token;
};

/**
 * 📌 Récupération des posts existants
 */
export const getPosts = async () => {
  const token = Cookies.get("token");

  if (!token) {
    console.error(
      "❌ Impossible de récupérer les posts : utilisateur non authentifié."
    );
    return;
  }

  const response = await axios.get(`${BASE_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * 📌 Déconnexion de l’utilisateur
 */
export const logoutUser = () => {
  Cookies.remove("token");
};
