import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:2000/api';

// Crée une instance Axios avec une configuration de base
const api = axios.create({
  baseURL: BASE_URL,
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Récupère le token stocké
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Service d'inscription d'un utilisateur
 */
export const registerUser = async (username: string, password: string): Promise<string> => {
  const response = await api.post('/auth/register', { username, password });
  const token = response.data.token;

  // Stocker le token dans les cookies pour persistance
  Cookies.set('token', token, { expires: 7 }); // Expiration dans 7 jours

  return token;
};

/**
 * Service de connexion d'un utilisateur
 */
export const loginUser = async (username: string, password: string): Promise<string> => {
  const response = await api.post('/auth/login', { username, password });
  const token = response.data.token;

  // Stocker le token dans les cookies pour persistance
  Cookies.set('token', token, { expires: 7 }); // Expiration dans 7 jours

  return token;
};

/**
 * Récupérer tous les posts (requête protégée)
 */
export const getPosts = async () => {
  const response = await api.get('/posts'); // Le token est ajouté automatiquement
  return response.data;
};

/**
 * Créer un nouveau post (requête protégée)
 */
export const createPost = async (post: { content: string }) => {
  const response = await api.post('/posts', post); // Le token est ajouté automatiquement
  return response.data;
};

/**
 * Déconnexion de l'utilisateur
 */
export const logoutUser = () => {
  Cookies.remove('token'); // Supprime le token
};
