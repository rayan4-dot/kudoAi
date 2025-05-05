// src/components/Sidebar.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageSquarePlus, Edit3, Trash2, Check, X, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ chats, activeChat, onChatSelect, onNewChat, onDeleteChat, onEditTitle }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleStartEdit = (chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSubmitEdit = (chatId) => {
    if (!editTitle.trim()) return;
    onEditTitle(chatId, editTitle.trim());
    setEditingId(null);
  };

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-full lg:w-96 h-full bg-black border-r border-white/20 p-6 overflow-y-auto scrollbar-none"
    >
      <Link to="" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
        <Brain size={32} className="text-white" />
        <div>
          <h1 className="text-2xl font-bold text-white">Kudo AI</h1>
          <p className="text-xs text-gray-400">Powered by Gemini Pro</p>
        </div>
      </Link>

      <button
        onClick={onNewChat}
        className="w-full bg-white text-black p-4 rounded-xl hover:bg-gray-100 transition-colors mb-6 flex items-center justify-center gap-2 text-lg font-medium cursor-pointer"
      >
        <MessageSquarePlus size={24} />
        <span>New Chat</span>
      </button>
      
      <div className="space-y-3">
        {[...chats].reverse().map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onChatSelect(chat.id)}
            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              chat.id === activeChat 
                ? 'bg-white text-black' 
                : 'bg-black text-white border border-white/20 hover:border-white/40'
            }`}
          >
            {editingId === chat.id ? (
              <div className="flex gap-3" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 bg-black rounded-lg px-4 py-2 text-white text-lg border-2 border-white/20 focus:border-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitEdit(chat.id)}
                  autoFocus
                />
                <button onClick={() => handleSubmitEdit(chat.id)} className="cursor-pointer">
                  <Check size={20} />
                </button>
                <button onClick={() => setEditingId(null)} className="cursor-pointer">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-lg truncate flex-1">
                  {chat.title}
                </p>
                <div className="flex gap-2 invisible group-hover:visible" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(chat);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      chat.id === activeChat
                        ? 'text-black hover:bg-black/10'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      chat.id === activeChat
                        ? 'text-black hover:bg-black/10'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
