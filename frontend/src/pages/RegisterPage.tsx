import React, { useState, useEffect } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token, setToken } = useAuth(); // Ajout de `setToken` pour stocker le token

  // ✅ Redirection automatique si l'utilisateur est déjà connecté
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = await registerUser(username, password); // Récupérer le token après inscription

      if (token) {
        setToken(token); // ✅ Stocker le token après l'inscription
        navigate("/"); // ✅ Rediriger immédiatement vers la page d'accueil
      } else {
        setError("Inscription réussie, mais échec de l'authentification automatique.");
      }

      setUsername("");
      setPassword("");
    } catch (error) {
      setError("Échec de l’inscription. Veuillez réessayer.");
      console.error("Erreur lors de l’inscription:", error);
    }
  };

  return (
    <div className="flex min-h-screen -mt-20 items-center justify-center">
      <div className="w-full max-w-[80%] border border-gray-800 rounded-2xl shadow-md">
        <div className="mx-auto flex items-center flex-col space-y-6 py-12 font-semibold text-gray-500">
          {/* Logo */}
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-white" fill="currentColor">
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
            </g>
          </svg>

          <h1 className="text-white text-2xl">Créer un compte Twitter</h1>

          {/* Messages d'erreur et de succès */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          {/* Formulaire d'inscription */}
          <form onSubmit={handleRegister} className="w-full px-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom d'utilisateur"
                required
                className="w-full p-2 mt-2 rounded-md font-normal border border-gray-700 focus:border-blue-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                className="w-full p-2 mt-2 rounded-md font-normal border border-gray-700 focus:border-blue-500 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-white rounded-full font-bold text-black transition duration-300 cursor-pointer"
            >
              S'inscrire
            </button>
          </form>

          {/* Lien vers la connexion */}
          <p className="text-sm">
            Vous avez déjà un compte ?{" "}
            <a className="font-semibold text-sky-400 hover:underline" href="/login">
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
