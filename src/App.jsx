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
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      {!isChatPage && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<Chat />} />
        </Routes>
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
