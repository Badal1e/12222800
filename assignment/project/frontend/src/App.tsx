import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { Link as LinkIcon, BarChart3, Plus, Minus, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { logger } from '../logging-middleware/browser-logger.js';
import URLShortener from './pages/URLShortener';
import Statistics from './pages/Statistics';

// Navigation Component
const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <LinkIcon size={24} />
            <h1 className="text-xl font-bold">URL Shortener</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <LinkIcon size={16} />
              <span>Shorten</span>
            </Link>
            <Link
              to="/statistics"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/statistics' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <BarChart3 size={16} />
              <span>Statistics</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Initialize logger for frontend
const CLIENT_ID = 'your-client-id-here';
const CLIENT_SECRET = 'your-client-secret-here';

logger.init(CLIENT_ID, CLIENT_SECRET).then(() => {
  logger.log('frontend', 'info', 'config', 'Frontend logger initialized successfully');
}).catch(error => {
  console.error('Frontend logger initialization failed:', error);
});

function App() {
  React.useEffect(() => {
    logger.log('frontend', 'info', 'component', 'App component mounted');
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<URLShortener />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;