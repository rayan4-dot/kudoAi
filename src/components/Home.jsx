// src/components/Home.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const animationRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isMobile = window.innerWidth < 768;
    
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);
    
    const nodeCount = isMobile ? 20 : 45;
    const connectionCount = isMobile ? 3 : 5;
    const connectionDistance = isMobile ? 250 : 350;
    
    nodesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      connections: Array.from(
        { length: Math.floor(Math.random() * connectionCount) + 3 }, 
        () => Math.floor(Math.random() * nodeCount)
      ).filter(idx => idx !== i)
    }));
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodesRef.current.forEach(node => {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 2000;
          node.vx += dx * force;
          node.vy += dy * force;
        }

        node.vx = Math.max(Math.min(node.vx, 2), -2);
        node.vy = Math.max(Math.min(node.vy, 2), -2);
        
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x <= 0 || node.x >= canvas.width) {
          node.vx *= -0.8;
          node.x = Math.max(0, Math.min(node.x, canvas.width));
        }
        if (node.y <= 0 || node.y >= canvas.height) {
          node.vy *= -0.8;
          node.y = Math.max(0, Math.min(node.y, canvas.height));
        }

        node.vx *= 0.99;
        node.vy *= 0.99;
        
        node.connections.forEach(targetIndex => {
          const target = nodesRef.current[targetIndex];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
            ctx.lineWidth = opacity * 2;
            ctx.stroke();
            
            const pulsePos = (Date.now() / 1500) % 1;
            const pulseX = node.x + dx * pulsePos;
            const pulseY = node.y + dy * pulsePos;
            
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
            ctx.fill();
          }
        });
      });

      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <motion.div 
        className="text-center space-y-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col items-center space-y-4">
          <Brain size={64} className="text-white" />
          <h1 className="text-6xl font-bold text-white">
            KUDOAI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Experience the next generation of AI-powered conversations. 
            Powered by Gemini Pro for enhanced natural language understanding.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/chat"
            className="bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg inline-block font-medium"
          >
            Start Chatting
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}