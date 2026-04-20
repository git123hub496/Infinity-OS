import React, { useState } from 'react';
import { 
  ThemeColor, 
  THEME_COLORS, 
  OSState, 
  User 
} from '../../../types';
import { 
  Palette, 
  Monitor, 
  LayoutGrid, 
  Eye, 
  Bell, 
  UserCircle, 
  Shield, 
  RotateCcw, 
  HelpCircle,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  Cpu,
  Lock,
  Globe,
  Wifi,
  Smartphone,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Info
} from 'lucide-react';

interface SettingsProps {
  accentColor: ThemeColor;
  updateOSConfig: (key: string, value: any) => void;
  wallpaper: string;
  osState: OSState;
}

const CATEGORIES = [
  { id: 'personalization', name: 'Personalization', icon: Palette },
  { id: 'display', name: 'Display', icon: Monitor },
  { id: 'apps', name: 'Apps', icon: LayoutGrid },
  { id: 'accessibility', name: 'Accessibility', icon: Eye },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'accounts', name: 'Accounts', icon: UserCircle },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'updates', name: 'Updates', icon: RotateCcw },
  { id: 'about', name: 'About', icon: HelpCircle },
];

const ALL_APPS_LIST = [
  { id: 'terminal', name: 'Terminal', icon: LayoutGrid },
  { id: 'settings', name: 'Settings', icon: Palette },
  { id: 'camera', name: 'Camera', icon: Monitor },
  { id: 'phone', name: 'Phone Link', icon: Smartphone },
  { id: 'browser', name: 'Browser', icon: Globe },
  { id: 'appstore', name: 'App Store', icon: LayoutGrid },
  { id: 'files', name: 'Files', icon: LayoutGrid },
  { id: 'payment', name: 'Payment', icon: Shield },
  { id: 'paint', name: 'Paint', icon: Palette },
  { id: 'email', name: 'Email', icon: Bell },
];

export const Settings: React.FC<SettingsProps> = ({ accentColor, updateOSConfig, wallpaper, osState }) => {
  const [activeTab, setActiveTab] = useState('personalization');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const theme = THEME_COLORS[accentColor];
  
  const currentUser = osState.users.find(u => u.id === osState.currentUserId) || osState.users[0];

  const updateAvatar = () => {
    const url = prompt("Enter Image URL for profile picture:", currentUser.avatar || "");
    if (url !== null) {
      const updatedUsers = osState.users.map(u => 
        u.id === currentUser.id ? { ...u, avatar: url } : u
      );
      updateOSConfig('users', updatedUsers);
    }
  };

  const toggleApp = (appId: string) => {
    const installed = osState.installedAppIds;
    if (installed.includes(appId)) {
      updateOSConfig('installedAppIds', installed.filter(id => id !== appId));
    } else {
      updateOSConfig('installedAppIds', [...installed, appId]);
    }
  };

  const wallpapers = [
    { id: 'solid-teal', name: 'Teal Void' },
    { id: 'matrix', name: 'Cyber Grid' },
    { id: 'none', name: 'Pure Black' },
  ];

  const updateBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateOSConfig('customWallpaper', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personalization':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 px-1">Accent Color</h4>
              <div className="grid grid-cols-6 gap-3">
                {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => updateOSConfig('accentColor', color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${accentColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: THEME_COLORS[color].primary }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 px-1">Background Environment</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { id: 'solid-teal', name: 'Teal Void' },
                  { id: 'matrix', name: 'Cyber Grid' },
                  { id: 'none', name: 'Pure Black' },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      updateOSConfig('wallpaper', w.id);
                      updateOSConfig('customWallpaper', undefined);
                    }}
                    className={`px-3 py-3 rounded-xl border text-[10px] font-bold transition-all uppercase tracking-tighter ${wallpaper === w.id && !osState.customWallpaper ? 'bg-white text-black border-white' : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/20'}`}
                  >
                    {w.name}
                  </button>
                ))}
              </div>
              
              <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Custom Wallpaper</span>
                    {osState.customWallpaper && (
                      <button 
                        onClick={() => updateOSConfig('customWallpaper', undefined)}
                        className="text-[9px] text-red-500 hover:underline"
                      >
                        REMOVE CUSTOM
                      </button>
                    )}
                 </div>
                 <label className="w-full h-24 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 cursor-pointer transition-all group overflow-hidden relative">
                    {osState.customWallpaper ? (
                      <img src={osState.customWallpaper} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    ) : null}
                    <ImageIcon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors relative z-10" />
                    <span className="text-[10px] font-bold text-zinc-600 group-hover:text-zinc-300 relative z-10 uppercase">Upload Texture / Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={updateBackground} />
                 </label>
              </div>
            </section>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Brightness Level</span>
                <span className="text-[10px] font-mono text-zinc-500">{osState.brightness}%</span>
              </div>
              <input 
                type="range"
                min="10" max="100"
                value={osState.brightness}
                onChange={(e) => updateOSConfig('brightness', parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </section>
            <section className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Screen Optimization</h4>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                 <span className="text-xs text-zinc-300">Auto-Calibration</span>
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </section>
          </div>
        );

      case 'apps':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">App Management</h4>
            <div className="space-y-2">
              {ALL_APPS_LIST.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5">
                      <app.icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-widest">{app.name}</p>
                      <p className="text-[8px] text-zinc-600 uppercase font-mono">STABLE RELEASE</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleApp(app.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${osState.installedAppIds.includes(app.id) ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-white text-black'}`}
                  >
                    {osState.installedAppIds.includes(app.id) ? 'Uninstall' : 'Install'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
             <div className="space-y-4">
                {[
                  { id: 'highContrast', label: 'High Contrast', icon: Eye },
                  { id: 'reducedMotion', label: 'Reduced Motion', icon: RefreshCw },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-zinc-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">{item.label}</span>
                    </div>
                    <button 
                      onClick={() => updateOSConfig('accessibility', { ...osState.accessibility, [item.id]: !osState.accessibility[item.id as keyof typeof osState.accessibility] })}
                    >
                      {osState.accessibility[item.id as keyof typeof osState.accessibility] ? <ToggleRight className="w-8 h-8 text-cyan-500" /> : <ToggleLeft className="w-8 h-8 text-zinc-600" />}
                    </button>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
            <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Allow Notifications</span>
              </div>
              <button 
                onClick={() => updateOSConfig('notificationSettings', { ...osState.notificationSettings, enabled: !osState.notificationSettings.enabled })}
              >
                {osState.notificationSettings.enabled ? <ToggleRight className="w-8 h-8 text-cyan-500" /> : <ToggleLeft className="w-8 h-8 text-zinc-600" />}
              </button>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 px-1">User Identity</h4>
              <div className="flex items-center gap-6 bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
                  <span className="text-zinc-700 font-bold text-2xl">∞</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white tracking-widest uppercase">{currentUser.name}</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{currentUser.role}</p>
                </div>
              </div>
            </section>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
            <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl flex items-center gap-6">
               <ShieldCheck className="w-12 h-12 text-cyan-500" />
               <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Quantum Shield Active</h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-mono mt-1">Status: Fully Protected</p>
               </div>
            </div>
            <div className="space-y-2">
               <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Kernel Firewall</span>
                  <button onClick={() => updateOSConfig('securitySettings', { ...osState.securitySettings, firewallActive: !osState.securitySettings.firewallActive })}>
                     {osState.securitySettings.firewallActive ? <ToggleRight className="w-8 h-8 text-cyan-500" /> : <ToggleLeft className="w-8 h-8 text-zinc-600" />}
                  </button>
               </div>
               <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Cipher Level</span>
                  <div className="grid grid-cols-3 gap-2">
                     {['standard', 'quantum', 'military'].map(level => (
                       <button 
                         key={level}
                         onClick={() => updateOSConfig('securitySettings', { ...osState.securitySettings, encryptionLevel: level })}
                         className={`py-2 rounded-xl text-[9px] font-bold uppercase tracking-tighter border transition-all ${osState.securitySettings.encryptionLevel === level ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black/20 border-white/5 text-zinc-500'}`}
                       >
                         {level}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'updates':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
             <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 text-center space-y-6">
                <div className={`w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center ${isUpdating ? 'animate-spin' : ''}`}>
                   <RotateCcw className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Update Nexus</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">System Version: 1.2.0-STABLE</p>
                </div>
                <button 
                  onClick={() => {
                    setIsUpdating(true);
                    setTimeout(() => setIsUpdating(false), 2000);
                  }}
                  className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isUpdating ? 'Checking...' : 'Check for System Updates'}
                </button>
             </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 py-4">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                     <span className="text-4xl font-black text-cyan-500">∞</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter">INFINITY OS</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Quantum Core v1.2</p>
                  </div>
               </div>
               
               <div className="space-y-4 pt-4 border-t border-white/5">
                  <p className="text-xs leading-relaxed text-zinc-400">
                    Infinity OS is the pinnacle of secure computing, engineered by **Infinity Cyber Security Company**. 
                    Our mission is to provide an unbreakable digital fortress for your data.
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    Infinity Cyber Security Company is a global leader in neural-network encryption and quantum-resistant architectures. 
                    Founded in 2024, we aim to protect the digital infinity of every user.
                  </p>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-zinc-600">developer</span>
                        <span className="text-cyan-500">Infinity Cyber Security Co.</span>
                     </div>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-zinc-600">kernel</span>
                        <span className="text-white">Neural-Sync v4</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex bg-[#1e252b] text-zinc-300 font-sans select-none">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#2d3748] flex flex-col pt-8">
        <div className="px-6 mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#805ad5] mb-6">System Configuration</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            <input 
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161c21] border border-[#2d3748] rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-[#4a5568] transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all ${activeTab === cat.id ? 'bg-white/5 text-white' : 'hover:bg-white/[0.02] text-zinc-400 opacity-70 hover:opacity-100'}`}
            >
              <cat.icon className={`w-4 h-4 ${activeTab === cat.id ? 'text-white' : 'text-zinc-500'}`} />
              <span className={`text-sm ${activeTab === cat.id ? 'font-bold' : 'font-medium'}`}>{cat.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight capitalize">{activeTab}</h2>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
