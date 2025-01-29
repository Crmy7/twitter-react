import React, { useEffect, useState } from 'react';
import TwitCard from './TweetCard';
import { getPosts } from '../services/api'; // Utilisation de la fonction API existante
import type { Post } from '../types/post';

const TwitList = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts(); // Appel à l'API
                setPosts(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des posts :", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <TwitCard key={post.id} title={post.title} content={post.content} author={post.author} />
                ))
            ) : (
                <p>Aucun post trouvé.</p>
            )}
        </div>
    );
};

export default TwitList;
