import React from 'react';

interface TwitCardProps {
    title: string;
    content: string;
    author: string;
}

const TwitCard: React.FC<TwitCardProps> = ({ title, content, author }) => {
    return (
        <div className="twit-card">
            <h2>{title}</h2>
            <p>{content}</p>
            <p><strong>Author:</strong> {author}</p>
        </div>
    );
};

export default TwitCard;