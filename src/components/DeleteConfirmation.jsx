// src/components/DeleteConfirmation.jsx
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="fixed inset-0 bg-black/70" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-black border border-white/20 p-6 rounded-xl w-full max-w-md m-4 z-50 relative"
        >
          <h2 className="text-xl font-bold text-white mb-4">Delete Chat</h2>
          <p className="text-gray-300 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 p-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 p-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
