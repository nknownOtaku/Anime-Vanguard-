import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InfoPage from './pages/InfoPage';
import SearchPage from './pages/SearchPage';
import WatchPage from './pages/WatchPage';
import PlayPage from './pages/PlayPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/info/:id" element={<InfoPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/watch/:title" element={<WatchPage />} />
        <Route path="/play/:slug/:session" element={<PlayPage />} />
      </Routes>
    </div>
  );
}

export default App;
