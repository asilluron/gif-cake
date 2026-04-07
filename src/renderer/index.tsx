import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { SearchPanel } from './components/SearchPanel';

const App = () => {
  return <SearchPanel />;
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;

