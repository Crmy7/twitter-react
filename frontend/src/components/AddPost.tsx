import React, { useState } from "react";
import { createPost } from "../services/api"; // ✅ Importation correcte

interface AddPostProps {
  onPostAdded: () => void; // Déclaration de la prop pour notifier un ajout
}

const AddPost: React.FC<AddPostProps> = ({ onPostAdded }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const defaultImage =
    "https://images.pexels.com/photos/534757/pexels-photo-534757.jpeg";

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!content.trim()) {
      setError("Le contenu du post ne peut pas être vide !");
      return;
    }

    console.log("📤 Tentative d'ajout d'un post...");

    try {
      const result = await createPost({
        content,
        imageUrl: imageUrl.trim() ? imageUrl : defaultImage,
      });

      if (result.message === "Post sauvegardé hors ligne et sera synchronisé plus tard.") {
        console.warn("📂 Post enregistré en local (IndexedDB)");
        setSuccess("📂 Post sauvegardé hors ligne !");
      } else {
        console.log("✅ Post créé avec succès !");
        setSuccess("Post créé avec succès !");
      }

      setContent("");
      setImageUrl("");
      onPostAdded(); // Rafraîchit les posts après ajout
    } catch (error: any) {
      console.error("❌ Erreur lors de la publication :", error);
      setError(error.response?.data?.message || "Échec de la publication du post.");
    }
  };

  return (
    <div className="px-4">
      <div className="w-full my-10 border-gray-200 dark:border-gray-800 rounded-xl border p-4">
        <form onSubmit={handleAddPost} className="">
          <div className="flex">
            <div className="w-10">
              <img
                className="inline-block h-10 w-10 rounded-full"
                src="https://pbs.twimg.com/profile_images/1121328878142853120/e-rpjoJi_bigger.png"
                alt="User Avatar"
              />
            </div>
            <div className="flex-1 ml-2">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <textarea
                className="bg-transparent text-gray-400 font-normal text-lg w-full focus:outline-none"
                rows={2}
                placeholder="Quoi de neuf ?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />

              <input
                className="hidden w-full p-2 bg-gray-900 rounded-md border border-gray-700 focus:border-blue-500 text-white mt-2"
                placeholder="Image URL (optionnel)"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end items-center mt-4">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
