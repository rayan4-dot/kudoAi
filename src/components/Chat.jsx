// src/components/Chat.jsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { generateResponse } from '../utils/gemini';
import { saveChat, getChats, getChatMessages, deleteChat } from '../utils/chatStorage';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
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
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
    navigate('/chat');
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
    <div className="flex h-screen bg-black">
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black border border-white/20 rounded-lg text-white"
      >
        <Menu size={24} />
      </button>

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

      <div className="flex-1 flex flex-col h-screen relative">
        <div 
          ref={messagesEndRef}
          className="absolute inset-0 bottom-[100px] overflow-y-auto custom-scrollbar"
        >
          <div className="flex flex-col justify-end min-h-full p-6">
            <div className="flex flex-col">
              {messages.map((message) => (
                <motion.div
                  key={message.timestamp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-white text-black' 
                      : 'bg-black text-white border border-white/20'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-lg">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start mb-6">
                  <div className="bg-black text-white rounded-2xl p-4 border border-white/20">
                    <p className="text-lg">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-white/10 p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="max-w-xl w-full p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Start a new conversation..."
                    className="w-full p-6 rounded-2xl bg-black text-white border-2 border-white/20 focus:border-white transition-colors text-lg placeholder:text-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-full p-4 rounded-xl bg-white text-black font-medium text-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-4 rounded-xl bg-black text-white border-2 border-white/20 focus:border-white transition-colors text-lg placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-8 rounded-xl bg-white text-black font-medium text-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>
          )}
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
