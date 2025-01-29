import React, { useEffect, useState } from 'react';
import TwitCard from './TwitCard';

const TwitList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('https://api.example.com/posts'); // Remplacez par l'URL de votre API
            const data = await response.json();
            setPosts(data);
        };

        fetchPosts();
    }, []);

    return (
        <div>
            {posts.map(post => (
                <TwitCard key={post.id} title={post.title} content={post.content} author={post.author} />
            ))}
        </div>
    );
};

export default TwitList;