import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WindowState, ThemeColor, THEME_COLORS } from '../../types';
import { X, Minus, Square, Minimize2 } from 'lucide-react';

interface WindowProps {
  window: WindowState;
  accentColor: ThemeColor;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window, accentColor, onClose, onFocus, onMinimize, children }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const theme = THEME_COLORS[accentColor];

  if (window.isMinimized) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragMomentum={false}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      style={{ 
        zIndex: window.zIndex,
        width: isMaximized ? '100%' : '600px',
        height: isMaximized ? '100%' : '450px',
        position: 'absolute',
        top: isMaximized ? 0 : '10%',
        left: isMaximized ? 0 : '20%',
      }}
      className={`bg-surface border border-border rounded-[4px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-3xl transition-all duration-300 ${isMaximized ? 'rounded-none' : ''}`}
    >
      {/* Title Bar */}
      <div className="h-8 bg-[#1a1a1a] border-b border-border flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-all flex items-center justify-center group"
            >
              <X className="w-1.5 h-1.5 text-black/50 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-all flex items-center justify-center group"
            >
              <Minus className="w-1.5 h-1.5 text-black/50 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-all flex items-center justify-center group"
            >
              <Square className="w-1.5 h-1.5 text-black/50 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <span className="title-text text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: theme.primary }}>{window.title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-transparent">
        {children}
      </div>
    </motion.div>
  );
};
