// src/components/DeleteConfirmation.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmation({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-surface border gradient-border p-6 rounded-xl w-full max-w-md m-4 z-50 relative"
        >
          <div className="absolute top-4 right-4">
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-error/20 p-3 rounded-full">
              <AlertTriangle size={24} className="text-error" />
            </div>
            <h2 className="text-xl font-display font-bold text-white">Delete Chat</h2>
          </div>
          
          <p className="text-white/80 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 p-3 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 p-3 rounded-lg bg-error text-white hover:bg-error/80 transition-all font-medium shadow-lg"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}