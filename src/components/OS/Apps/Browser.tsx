import React, { useState } from 'react';
import { ThemeColor, THEME_COLORS } from '../../../types';
import { Globe, ArrowLeft, ArrowRight, RotateCw, ShieldCheck } from 'lucide-react';

interface BrowserProps {
  accentColor: ThemeColor;
}

export const Browser: React.FC<BrowserProps> = ({ accentColor }) => {
  const [url, setUrl] = useState('https://www.google.com/search?q=Infinity+Security&igu=1');
  const [input, setInput] = useState(url);
  const theme = THEME_COLORS[accentColor];

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = input;
    if (!target.startsWith('http')) {
      target = `https://${target}`;
    }
    setUrl(target);
    setInput(target);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Address Bar Area */}
      <div className="bg-zinc-100 border-b border-zinc-300 p-2 flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <button className="p-1.5 hover:bg-zinc-200 rounded-md transition-colors"><ArrowLeft className="w-4 h-4 text-zinc-600" /></button>
          <button className="p-1.5 hover:bg-zinc-200 rounded-md transition-colors"><ArrowRight className="w-4 h-4 text-zinc-600" /></button>
          <button className="p-1.5 hover:bg-zinc-200 rounded-md transition-colors"><RotateCw className="w-4 h-4 text-zinc-600" /></button>
        </div>
        
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white border border-zinc-300 rounded-full px-4 py-1 gap-2 focus-within:border-accent group transition-all">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-zinc-800"
            placeholder="Search or enter URL"
          />
        </form>

        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
            <Globe className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url} 
          title="Browser Viewport"
          className="w-full h-full border-none"
          referrerPolicy="no-referrer"
        />
        
        {/* Security Banner Overlay */}
        <div className="absolute top-0 right-4 bg-emerald-500 text-white px-2 py-0.5 rounded-b-md text-[9px] font-bold uppercase tracking-wider shadow-sm z-10">
          Infinity Secure Proxy Active
        </div>
      </div>
    </div>
  );
};
