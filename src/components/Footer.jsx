// src/components/Footer.jsx
import { motion } from 'framer-motion';
import { Heart, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-effect border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="gradient-text text-lg font-display font-bold">KUDO AI</div>
            <p className="text-white/60 text-sm mt-2">
              Transforming conversations with AI
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-white/60 hover:text-tertiary transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-secondary transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-primary transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Made with</span>
              <Heart size={16} className="text-secondary" />
              <span className="text-white/60 text-sm">in 2024</span>
            </div>
            <div className="flex space-x-6 mt-2">
              <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}