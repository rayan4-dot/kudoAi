// src/components/Chat.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { generateResponse } from '../utils/gemini';
import { saveChat, getChats, getChatMessages, deleteChat } from '../utils/chatStorage';
import Sidebar from './Sidebar';
import { Menu, Send, Bot, User, Sparkles, ArrowUp, Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteConfirmation from './DeleteConfirmation';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState(getChats());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setChats(getChats());
  }, []);

  useEffect(() => {
    if (activeChatId) {
      try {
        const chatMessages = getChatMessages(activeChatId);
        setMessages(chatMessages);
      } catch (error) {
        setMessages([]);
      }
    }
  }, [activeChatId]);

  useEffect(() => {
    if (chatId && chats[chatId]) {
      handleChatSelect(chatId);
    }
  }, [chatId]);

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    navigate(`/chat/${chatId}`);
    const selectedMessages = getChatMessages(chatId);
    setMessages(selectedMessages);
    setInput('');
    // Focus input after chat selection
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
    navigate('/chat');
    // Focus input after new chat
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleEditTitle = (chatId, newTitle) => {
    const chat = chats[chatId];
    if (chat) {
      saveChat(chatId, newTitle, getChatMessages(chatId));
      setChats(getChats());
    }
  };

  const handleDeleteChat = (chatId) => {
    setDeleteTarget(null);
    deleteChat(chatId);
    setChats(getChats());
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]) ;
      navigate('/chat');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    const timestamp = Date.now();
    const newMessage = { role: 'user', content: input.trim(), timestamp };
    let currentChatId = activeChatId;
    let updatedMessages = [];

    try {
      if (!currentChatId) {
        currentChatId = `chat_${timestamp}`;
        updatedMessages = [newMessage];
        setActiveChatId(currentChatId);
        navigate(`/chat/${currentChatId}`);
        saveChat(currentChatId, input.trim().slice(0, 30) + '...', updatedMessages);
      } else {
        updatedMessages = [...messages, newMessage];
        saveChat(currentChatId, null, updatedMessages);
      }

      setMessages(updatedMessages);
      setInput('');
      setChats(getChats());

      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('API key not found. Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY.');
      }

      const response = await generateResponse(input.trim());
      const aiMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: Date.now() 
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveChat(currentChatId, null, finalMessages);
      setChats(getChats());

    } catch (error) {
      console.error('Chat error:', error);
      
      if (error.message.includes('API key not found')) {
        setMessages(prev => [...prev, { 
          role: 'error', 
          content: 'API key not found. Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY.',
          timestamp: Date.now() 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'error', 
          content: `Error: ${error.message || 'Failed to generate response'}`, 
          timestamp: Date.now() 
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-background">
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white border border-white/10 rounded-lg shadow-glow"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 lg:relative fixed inset-y-0 left-0 z-40 h-screen`}>
        <Sidebar
          chats={Object.values(chats)}
          activeChat={activeChatId}
          onChatSelect={(chatId) => {
            handleChatSelect(chatId);
            setSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onDeleteChat={(id) => setDeleteTarget(id)}
          onEditTitle={handleEditTitle}
        />
      </div>

      <div className="flex-1 flex flex-col h-screen relative bg-background">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
        </div>
        
        <div 
          ref={messagesEndRef}
          className="absolute inset-0 bottom-[100px] overflow-y-auto custom-scrollbar px-4 md:px-6"
        >
          <div className="flex flex-col justify-end min-h-full py-6 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="bg-primary/20 p-4 rounded-full mx-auto mb-6">
                    <Sparkles size={40} className="text-primary animate-pulse-slow" />
                  </div>
                  <h1 className="text-3xl font-display font-bold text-white mb-3">Welcome to <span className="text-tertiary">Kudo</span>AI</h1>
                  <p className="text-white/70 max-w-md mx-auto">Start a conversation below to explore the capabilities of our AI assistant powered by Gemini Pro.</p>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-secondary shadow-pink' 
                          : message.role === 'error'
                            ? 'bg-error/20 text-error'
                            : 'bg-primary shadow-glow'
                      }`}>
                        {message.role === 'user' ? (
                          <User size={16} className="text-white" />
                        ) : message.role === 'error' ? (
                          <AlertTriangle size={16} className="text-error" />
                        ) : (
                          <Bot size={16} className="text-white" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl p-4 ${
                        message.role === 'user' 
                          ? 'bg-secondary/20 border border-secondary/30 text-white' 
                          : message.role === 'error'
                            ? 'bg-error/10 border border-error/30 text-white'
                            : 'bg-surface border border-primary/30 text-white'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-base">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Loader size={16} className="text-white animate-spin" />
                      </div>
                      <div className="bg-surface border border-primary/30 text-white rounded-2xl p-4">
                        <p className="text-white/70">Thinking<span className="animate-pulse">...</span></p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 glass-effect border-t border-white/5 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={messages.length === 0 ? "Ask me anything..." : "Type your message..."}
                className="flex-1 p-4 rounded-xl bg-surface text-white border border-white/10 focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary transition-all text-base placeholder:text-white/40"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-50 disabled:hover:bg-primary shadow-glow disabled:shadow-none flex items-center justify-center"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <ArrowUp size={20} />
                )}
              </button>
            </form>
            <div className="mt-2 text-center">
              <p className="text-white/40 text-xs">
                Powered by Gemini Pro • Responses may not be accurate
              </p>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteChat(deleteTarget)}
      />
    </div>
  );
}