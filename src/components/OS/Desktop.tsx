import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WindowState, ThemeColor, THEME_COLORS, OSState } from '../../types';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { Terminal } from './Apps/Terminal';
import { Settings } from './Apps/Settings';
import { Camera } from './Apps/Camera';
import { PhoneLink } from './Apps/PhoneLink';
import { Browser } from './Apps/Browser';
import { AppStore } from './Apps/AppStore';
import { IframeApp } from './Apps/IframeApp';
import { BiosSetup } from './Apps/BiosSetup';
import { Files } from './Apps/Files';
import { Notes } from './Apps/Notes';
import { Payment } from './Apps/Payment';
import { Paint } from './Apps/Paint';
import { Email } from './Apps/Email';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  Settings as SettingsIcon, 
  Camera as CameraIcon, 
  Smartphone, 
  Globe, 
  ShoppingBag, 
  Cpu, 
  FileText,
  Volume2,
  Sun,
  Power,
  Wifi,
  FolderOpen,
  StickyNote,
  LogOut,
  Dna,
  Wallet,
  Pencil,
  Mail,
  AlertCircle,
  Bell,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface DesktopProps {
  accentColor: ThemeColor;
  wallpaper: string;
  updateOSConfig: (key: any, value: any) => void;
  osState: OSState;
}

const ALL_APPS = [
  { id: 'terminal', name: 'Terminal', icon: TerminalIcon, component: Terminal },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, component: Settings },
  { id: 'camera', name: 'Camera', icon: CameraIcon, component: Camera },
  { id: 'bios', name: 'BIOS Setup', icon: Dna, component: BiosSetup },
  { id: 'phone', name: 'Phone Link', icon: Smartphone, component: PhoneLink },
  { id: 'browser', name: 'Browser', icon: Globe, component: Browser },
  { id: 'appstore', name: 'App Store', icon: ShoppingBag, component: AppStore },
  { id: 'files', name: 'Files', icon: FolderOpen, component: Files },
  { id: 'notes', name: 'Notes', icon: StickyNote, component: Notes },
  { id: 'payment', name: 'Payment', icon: Wallet, component: Payment },
  { id: 'paint', name: 'Paint', icon: Pencil, component: Paint },
  { id: 'email', name: 'Email', icon: Mail, component: Email },
  { 
    id: 'quadrais', 
    name: 'Infinity AI Workspace', 
    icon: Cpu, 
    component: () => <IframeApp url="https://infinity-ai-workspace.vercel.app/" /> 
  },
];

export const Desktop: React.FC<DesktopProps> = ({ accentColor, wallpaper, updateOSConfig, osState }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const [time, setTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [startMenuView, setStartMenuView] = useState<'pinned' | 'all'>('pinned');
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!osState.notificationSettings.enabled) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const potentialNotes = [
          { title: 'Nexus Signal', message: 'Nodes synchronized successfully.', type: 'success' },
          { title: 'Security Alert', message: 'Blocked a brute-force attempt from Unknown Proxy.', type: 'warning' },
          { title: 'Quantum Flux', message: 'Encryption entropy at 99.8%. Optimal.', type: 'info' },
          { title: 'Update Available', message: 'Patch INF-404 ready for deployment.', type: 'info' },
          { title: 'Storage Status', message: 'Volume A initialized without errors.', type: 'success' },
        ];
        const note = potentialNotes[Math.floor(Math.random() * potentialNotes.length)];
        const id = Math.random().toString();
        
        setNotifications(prev => [...prev, { ...note, id }]);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [osState.notificationSettings.enabled]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const theme = THEME_COLORS[accentColor];
  
  const installedApps = ALL_APPS.filter(app => osState.installedAppIds.includes(app.id) || ['files', 'notes', 'bios'].includes(app.id));

  const openApp = (appId: string) => {
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      focusWindow(existing.id);
      setIsStartOpen(false);
      return;
    }

    const app = ALL_APPS.find(a => a.id === appId);
    if (!app) return;

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      title: app.name,
      isMaximized: false,
      isMinimized: false,
      zIndex: maxZIndex + 1,
    };

    setWindows([...windows, newWindow]);
    setMaxZIndex(prev => prev + 1);
    setIsStartOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setWindows(windows.map(w => {
      if (w.id === id) {
        return { ...w, zIndex: maxZIndex + 1, isMinimized: false };
      }
      return w;
    }));
    setMaxZIndex(prev => prev + 1);
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => {
      if (w.id === id) return { ...w, isMinimized: true };
      return w;
    }));
  };

  const currentUser = osState.users.find(u => u.id === osState.currentUserId) || osState.users[0];

  return (
    <div 
      className={`fixed inset-0 overflow-hidden flex flex-col transition-colors duration-1000 w-screen h-screen ${wallpaper === 'solid-teal' ? 'bg-solid-teal' : wallpaper === 'none' ? 'bg-black' : 'bg-[#050505]'}`}
      style={osState.customWallpaper ? { 
        backgroundImage: `url(${osState.customWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {/* Grid Pattern Overlay */}
      {wallpaper === 'matrix' && !osState.customWallpaper && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundSize: '32px 32px', backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)' }} />
      )}

      {/* Desktop Content & Windows Rendering */}
      <div className="flex-1 relative z-10 w-full h-full">
        <AnimatePresence>
          {windows.map((w) => {
            const AppComp = ALL_APPS.find(a => a.id === w.appId)?.component || (() => null);
            return (
              <Window
                key={w.id}
                window={w}
                accentColor={accentColor}
                onClose={() => closeWindow(w.id)}
                onFocus={() => focusWindow(w.id)}
                onMinimize={() => minimizeWindow(w.id)}
              >
                <AppComp 
                  accentColor={accentColor} 
                  updateOSConfig={updateOSConfig}
                  osState={osState}
                  wallpaper={wallpaper}
                />
              </Window>
            );
          })}
        </AnimatePresence>
      </div>

      <Taskbar 
        accentColor={accentColor} 
        openApp={openApp} 
        time={time}
        activeApps={windows}
        onAppClick={(id) => focusWindow(id)}
        onToggleStart={() => {
          setIsStartOpen(!isStartOpen);
          if (!isStartOpen) setStartMenuView('pinned');
        }}
        onToggleQuickSettings={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
      />

      {/* Popups */}
      <AnimatePresence>
        {isStartOpen && (
          <div key="start-menu-container">
            <div className="fixed inset-0 z-[7000]" onClick={() => setIsStartOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 left-4 w-84 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[7001]"
            >
              <div className="p-6 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 overflow-hidden">
                    <span className="text-2xl font-bold text-cyan-500">∞</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none mb-1">{currentUser.name}</h3>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-tighter">{currentUser.role}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {startMenuView === 'pinned' ? (
                  <>
                    <div className="flex justify-between items-center mb-6 px-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pinned Apps</span>
                      <button 
                        onClick={() => setStartMenuView('all')}
                        className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-1"
                      >
                        All Apps <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                      {installedApps.slice(0, 9).map(app => (
                        <button key={app.id} onClick={() => openApp(app.id)} className="flex flex-col items-center gap-2 group transition-all">
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-colors">
                            <app.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase font-mono tracking-tighter text-center line-clamp-1">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-6 px-1">
                      <button 
                        onClick={() => setStartMenuView('pinned')}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">All Transmissions</span>
                    </div>
                    <div className="space-y-1 h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                      {installedApps.map(app => (
                        <button 
                          key={app.id} 
                          onClick={() => openApp(app.id)}
                          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <app.icon className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-bold text-zinc-300 group-hover:text-white uppercase tracking-widest mb-0.5">{app.name}</p>
                            <p className="text-[8px] text-zinc-600 font-mono uppercase">Operational</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Secure Node Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => updateOSConfig('isLoggedIn', false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </button>
                   <button 
                    onClick={() => updateOSConfig('isBooted', false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="Restart"
                  >
                    <Power className="w-4 h-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isQuickSettingsOpen && (
          <div key="quick-settings-container">
            <div className="fixed inset-0 z-[7000]" onClick={() => setIsQuickSettingsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-4 w-72 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl z-[7001]"
            >
              <div className="space-y-6">
                 {/* Brightness */}
                 <div className="space-y-3">
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <div className="flex items-center gap-2"><Sun className="w-3 h-3 text-cyan-500" /> Brightness</div>
                      <span className="text-zinc-300">{osState.brightness}%</span>
                   </div>
                   <input 
                     type="range" 
                     className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                     value={osState.brightness}
                     onChange={(e) => updateOSConfig('brightness', parseInt(e.target.value))}
                   />
                 </div>

                 {/* Volume */}
                 <div className="space-y-3">
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <div className="flex items-center gap-2"><Volume2 className="w-3 h-3 text-cyan-500" /> Volume</div>
                      <span className="text-zinc-300">{osState.volume}%</span>
                   </div>
                   <input 
                     type="range" 
                     className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                     value={osState.volume}
                     onChange={(e) => updateOSConfig('volume', parseInt(e.target.value))}
                   />
                 </div>

                 <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { icon: Wifi, label: 'Wifi', active: true },
                      { icon: Smartphone, label: 'Phone', active: true },
                      { icon: Shield, label: 'Safe', active: true },
                    ].map((btn, idx) => (
                      <button key={idx} className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-colors ${btn.active ? 'bg-white/5 border border-white/10' : 'bg-black/20 border border-transparent opacity-50'}`}>
                        <btn.icon className="w-4 h-4" style={{ color: btn.active ? theme.primary : '' }} />
                        <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-tighter">{btn.label}</span>
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications / Toasts */}
      <div className="fixed top-20 right-6 flex flex-col gap-3 z-[9000] pointer-events-none">
        <AnimatePresence>
          {notifications.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`w-80 p-4 rounded-2xl border backdrop-blur-3xl shadow-2xl flex gap-4 pointer-events-auto ${note.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : note.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-zinc-950/80 border-white/10'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${note.type === 'warning' ? 'bg-amber-500/20 border-amber-500/20 text-amber-500' : note.type === 'error' ? 'bg-red-500/20 border-red-500/20 text-red-500' : 'bg-cyan-500/20 border-cyan-500/20 text-cyan-500'}`}>
                {note.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : note.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-0.5 truncate">{note.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-tight line-clamp-2">{note.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
