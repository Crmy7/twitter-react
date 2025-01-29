import React from 'react';
import TwitList from './components/TweetList';
import TweetForm from './components/TweetForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <TweetForm />
      <h1 className='text-2xl mb-10 px-4'>Liste des Publications</h1>
      <TwitList />
    </div>
  );
};

export default App;