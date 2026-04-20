import React, { useState } from 'react';
import { ThemeColor, THEME_COLORS, OSState } from '../../../types';
import { ShoppingBag, Download, Check, Shield, Star, Clock } from 'lucide-react';

interface AppStoreProps {
  accentColor: ThemeColor;
  osState: OSState;
  updateOSConfig: (key: keyof OSState, value: any) => void;
}

export const AppStore: React.FC<AppStoreProps> = ({ accentColor, osState, updateOSConfig }) => {
  const theme = THEME_COLORS[accentColor];

  const MARKET_APPS = [
    { 
      id: 'quadrais', 
      name: 'Quadrais AI', 
      developer: 'Quadrais Corp',
      description: 'Advanced AI assistant for complex logic and data processing.',
      icon: 'https://quadrais-ai.vercel.app/favicon.ico',
      url: 'https://quadrais-ai.vercel.app/',
      rating: 4.9,
      downloads: '1.2M+'
    },
    { 
      id: 'securesync', 
      name: 'SecureSync', 
      developer: 'Infinity Security',
      description: 'End-to-end encrypted backup agent.',
      icon: null,
      rating: 4.7,
      downloads: '500K'
    },
    { 
      id: 'nodevis', 
      name: 'Node Visualizer', 
      developer: 'NetworkLabs',
      description: 'Real-time 3D network topology visualization.',
      icon: null,
      rating: 4.5,
      downloads: '100K'
    }
  ];

  const installApp = (appId: string) => {
    if (osState.installedAppIds.includes(appId)) return;
    updateOSConfig('installedAppIds', [...osState.installedAppIds, appId]);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 font-sans">
      <div className="p-6 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShoppingBag className="w-6 h-6" style={{ color: theme.primary }} />
          Infinity Store
        </h2>
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Trusted Security Applications</p>
      </div>

      <div className="p-6 flex-1 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          {MARKET_APPS.map((app) => (
            <div key={app.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex items-center gap-6 hover:bg-zinc-800/50 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-700">
                {app.icon ? (
                  <img src={app.icon} alt={app.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Shield className="w-8 h-8 opacity-20" style={{ color: theme.primary }} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-zinc-100">{app.name}</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20">VERIFIED</span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{app.description}</p>
                
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {app.rating}
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
                      <Download className="w-3 h-3" />
                      {app.downloads}
                   </div>
                </div>
              </div>

              <button 
                onClick={() => installApp(app.id)}
                disabled={osState.installedAppIds.includes(app.id)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  osState.installedAppIds.includes(app.id) 
                    ? 'bg-zinc-800 text-zinc-500 cursor-default' 
                    : 'bg-white text-black hover:scale-105 active:scale-95'
                }`}
              >
                {osState.installedAppIds.includes(app.id) ? (
                  <span className="flex items-center gap-2"><Check className="w-3 h-3" /> INSTALLED</span>
                ) : (
                  'GET'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
