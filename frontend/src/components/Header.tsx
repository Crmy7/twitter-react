import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const { setToken, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Liste des routes publiques où l'on ne doit PAS rediriger
    const publicRoutes = ["/login", "/register"];

    // Vérifie si l'utilisateur est non connecté et essaie d'accéder à une page privée
    if (
      !token &&
      !publicRoutes.includes(location.pathname) &&
      !location.pathname.startsWith("/user/")
    ) {
      navigate("/login"); // Redirige uniquement si l'utilisateur essaie d'accéder à une page réellement privée
    }
  }, [token, navigate, location.pathname]);
  // Ajout de `location.pathname` pour réagir aux changements d'URL

  const handleLogout = () => {
    logoutUser();
    setToken(null); // Met à jour le contexte
    navigate("/login"); // Redirige après déconnexion
  };

  // Ne pas afficher le bouton de déconnexion sur les pages de login et register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className="fixed bottom-0 left-0 w-full bg-black text-white p-4 flex justify-center items-center border-gray-200 dark:border-gray-800 border">
      <button
        onClick={handleLogout}
        className="bg-white text-black px-4 py-2 rounded-full"
      >
        Se déconnecter
      </button>
    </header>
  );
};

export default Header;
