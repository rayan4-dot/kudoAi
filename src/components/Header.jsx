// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { Brain, Key, House } from 'lucide-react';

export default function Header({ onApiKeyClick }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center bg-black/50 backdrop-blur-md">
      <div className="container flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2">
          <Brain size={32} className="text-white" />
          <span className="font-bold text-white text-xl">Kudo AI</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium ${location.pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'}`}
          >
            Home
          </Link>
          <a 
            href="https://aistudio.google.com/welcome" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/70 hover:text-white"
          >
            <Key size={18} />
            <span className="text-sm font-medium">Get API key</span>
          </a>

        </nav>
      </div>
    </header>
  );
}
