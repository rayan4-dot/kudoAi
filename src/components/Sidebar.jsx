// src/components/Sidebar.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageSquarePlus, Edit3, Trash2, Check, X, Sparkles, Folder, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ chats, activeChat, onChatSelect, onNewChat, onDeleteChat, onEditTitle }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

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
      className="w-full lg:w-96 h-full bg-surface border-r border-white/10 drop-shadow-xl p-6 overflow-y-auto custom-scrollbar"
    >
      <Link to="" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
        <div className="bg-primary rounded-full p-2 shadow-glow">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-white text-xl tracking-wide">KUDO<span className="text-tertiary">AI</span></h1>
          <p className="text-xs text-white/60">Powered by Gemini Pro</p>
        </div>
      </Link>

      <button
        onClick={onNewChat}
        className="w-full bg-primary text-white p-4 rounded-xl hover:bg-primary/90 shadow-glow hover:shadow-lg transition-all mb-6 flex items-center justify-center gap-2 text-lg font-medium cursor-pointer"
      >
        <MessageSquarePlus size={24} />
        <span>New Chat</span>
      </button>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-white/60 px-2 mb-2">
          <Folder size={18} />
          <span className="text-sm font-medium">Recent Chats</span>
        </div>
        
        {[...chats].reverse().map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onChatSelect(chat.id)}
            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              chat.id === activeChat 
                ? 'bg-primary text-white shadow-glow' 
                : 'bg-elevated/50 text-white hover:bg-elevated border border-white/5'
            }`}
          >
            {editingId === chat.id ? (
              <div className="flex gap-3" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 bg-background rounded-lg px-4 py-2 text-white text-base border border-white/20 focus:border-tertiary focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitEdit(chat.id)}
                  autoFocus
                />
                <button 
                  onClick={() => handleSubmitEdit(chat.id)} 
                  className="p-2 bg-tertiary text-black rounded-lg cursor-pointer hover:bg-tertiary/80"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={() => setEditingId(null)} 
                  className="p-2 bg-white/10 text-white rounded-lg cursor-pointer hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Cpu size={18} className={`${chat.id === activeChat ? 'text-tertiary' : 'text-white/60'}`} />
                  <p className="text-base truncate flex-1">
                    {chat.title}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(chat);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      chat.id === activeChat
                        ? 'text-white/80 hover:bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      chat.id === activeChat
                        ? 'text-white/80 hover:bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="bg-elevated/50 rounded-xl p-4 text-white/70 text-sm">
          <p className="mb-2 font-medium text-tertiary">Pro Tip</p>
          <p>Try asking questions about code, data analysis, or creative writing for best results.</p>
        </div>
      </div>
    </motion.div>
  );
}