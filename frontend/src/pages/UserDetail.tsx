import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

const UserDetail: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`http://localhost:2000/api/users/${username}/posts`);
        if (response.data.length === 0) {
          setError("Cet utilisateur n'a pas encore posté.");
        }
        setPosts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        setError("Impossible de charger les publications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil de {username}</h1>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Publications :</h2>

        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400 mt-4">Chargement...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="mt-4 border-b border-gray-700 pb-4">
                <p className="text-gray-900 dark:text-white">{post.content}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="mt-2 rounded-lg max-w-full"
                  />
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
