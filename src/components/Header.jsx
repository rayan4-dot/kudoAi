// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Key, MessageCircle, Github } from 'lucide-react';

export default function Header({ onApiKeyClick }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-white/10">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-primary rounded-full p-2 shadow-glow transition-all duration-300 group-hover:shadow-pink">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-xl tracking-wide">KUDO<span className="text-tertiary">AI</span></h1>
            <p className="text-xs text-white/60">Powered by Gemini Pro</p>
          </div>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/chat" 
            className={`text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              location.pathname === '/chat' 
                ? 'text-tertiary shadow-neon' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageCircle size={18} />
            <span>Home</span>
          </Link>
          
          <a 
            href="https://github.com/rayan4-dot/kudoAi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
          >
            <Github size={18} />
            <span className="text-sm font-medium">GitHub</span>
          </a>
          
          <a 
            href="https://aistudio.google.com/welcome" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white shadow-glow hover:shadow-lg hover:scale-105 transition-all"
          >
            <Key size={18} />
            <span className="text-sm font-medium">Get API key</span>
          </a>
        </nav>
      </div>
    </header>
  );
}