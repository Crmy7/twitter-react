import React from "react";
import { Link } from 'react-router-dom';

interface TweetCardProps {
  content: string;
  username: string;
  imageUrl?: string | null;
  createdAt: string;
}

const TweetCard: React.FC<TweetCardProps> = ({ content, username, imageUrl, createdAt }) => {
  return (
    <div className="bg-gray-50 dark:bg-black mb-5 flex items-center justify-center w-full">
      <div className="w-full bg-white dark:bg-black border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl">
        <Link className="flex justify-between"
          to={`/user/${username.toLowerCase().replace(/[\s']+/g, "")}`}
        >
          <div className="flex items-center">
            <img className="h-11 w-11 rounded-full" src="https://i.pravatar.cc/300" alt="Avatar" />
            <div className="ml-1.5 text-sm leading-tight">
              <span className="text-black dark:text-white font-bold block">{username}</span>
              <span className="text-gray-500 dark:text-gray-400 font-normal block">
                @{username.toLowerCase().replace(/[\s']+/g, "")}
              </span>
            </div>
          </div>
        </Link>
        <p className="text-black dark:text-white block text-xl leading-snug mt-3">{content}</p>
        {imageUrl && (
          <img
            className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-700"
            src={imageUrl}
            alt="Image du post"
          />
        )}
        <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TweetCard;
