import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeColor, THEME_COLORS, WindowState } from '../../types';
import { Shield, LayoutGrid, Terminal, Settings, Camera, Smartphone, Search, Wifi, Battery, Volume2, Globe, ShoppingBag } from 'lucide-react';

interface TaskbarProps {
  accentColor: ThemeColor;
  openApp: (id: string) => void;
  time: Date;
  activeApps: WindowState[];
  onAppClick: (id: string) => void;
  onToggleStart: () => void;
  onToggleQuickSettings: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  accentColor, 
  openApp, 
  time, 
  activeApps, 
  onAppClick,
  onToggleStart,
  onToggleQuickSettings
}) => {
  const theme = THEME_COLORS[accentColor];

  const APPS_BAR = [
    { id: 'browser', icon: Globe },
    { id: 'terminal', icon: Terminal },
    { id: 'appstore', icon: ShoppingBag },
    { id: 'settings', icon: Settings },
  ];

  return (
    <div className="h-12 bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-border flex items-center justify-between px-4 z-[8000]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleStart} 
          className="w-10 h-8 flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 active:scale-90"
          style={{ color: theme.primary }}
        >
          ∞
        </button>

        <div className="flex items-center gap-1.5 pl-2">
          {APPS_BAR.map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="w-8 h-8 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center transition-all relative group hover:bg-white/10 hover:border-white/20"
              style={{ borderColor: activeApps.some(w => w.appId === app.id) ? theme.primary : '' }}
            >
              <app.icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleQuickSettings}
          className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-2 text-zinc-700 group-hover:text-zinc-500">
            <Wifi className="w-3 h-3" />
            <Volume2 className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
          
          <div className="font-mono text-right leading-none">
            <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
