import React from "react";

interface TweetFormProps {
  // Define your props here
}

const TweetForm: React.FC<TweetFormProps> = (props) => {
  return (
    <div className="px-10">
      <form className="flex flex-col items-start">
        <input
          type="text"
          placeholder="Quoi de neuf ?"
          className="text-gray-100/50 font-medium text-2xl"
        />
        <div className="w-full flex justify-end items-center">
          <button className="bg-white text-black px-4 py-2 rounded-full">
            Poster
          </button>
        </div>
      </form>
    </div>
  );
};

export default TweetForm;
