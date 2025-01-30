import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import TweetCard from "./TweetCard";
import AddPost from "./AddPost";

interface Post {
  id: number;
  content: string;
  username: string;
  imageUrl?: string | null;
  createdAt: string;
}

const TweetList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false); // Ajout d’un état pour forcer le rechargement

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await getPosts();
        setPosts(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
        setError("Impossible de charger les posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [refreshTrigger]); // Déclenche le useEffect chaque fois que refreshTrigger change

  return (
    <div className="mt-6">
      <AddPost onPostAdded={() => setRefreshTrigger((prev) => !prev)} />{" "}
      {isLoading ? (
        <p className="text-white text-center">Chargement des posts...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <TweetCard
            key={post.id}
            content={post.content}
            username={post.username}
            imageUrl={post.imageUrl}
            createdAt={post.createdAt}
          />
        ))
      ) : (
        <p className="text-white text-center">Aucun post à afficher.</p>
      )}
    </div>
  );
};

export default TweetList;
