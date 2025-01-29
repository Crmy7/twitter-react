import React from 'react';
import TwitList from './components/TwitList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Liste des Publications</h1>
      <TwitList />
    </div>
  );
};

export default App;