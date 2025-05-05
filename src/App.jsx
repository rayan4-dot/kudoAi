// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Chat from './components/Chat';
import Header from './components/Header'; 
import Footer from './components/Footer';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat');

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col overflow-hidden">
      {!isChatPage && <Header />}
      <main className="flex-1 relative">
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<Chat />} />
        </Routes>
        
        {/* Decorative background elements */}
        {!isChatPage && (
          <>
            <div className="fixed top-10 right-10 w-72 h-72 rounded-full bg-primary opacity-20 blur-3xl"></div>
            <div className="fixed bottom-10 left-10 w-64 h-64 rounded-full bg-secondary opacity-20 blur-3xl"></div>
            <div className="fixed top-1/2 left-1/3 w-40 h-40 rounded-full bg-tertiary opacity-10 blur-2xl"></div>
          </>
        )}
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;