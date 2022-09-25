import React, { useEffect } from 'react';

import './App.css';
import useGithubContributors from './hooks/useGithubContributors';

const App: React.FC = (): React.ReactElement => {
  const { isLoading, contributors, fetchData } = useGithubContributors();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.StrictMode>
      <div>...MEMORY APPLICATION...</div>
    </React.StrictMode>
  );
};

export default App;
