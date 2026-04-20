import React, { useState } from 'react';
import { ThemeColor, THEME_COLORS, OSState, Message } from '../../../types';
import { 
  Smartphone, 
  Bell, 
  MessageSquare, 
  Phone, 
  Battery, 
  Wifi, 
  MoreVertical,
  Shield,
  Send,
  Zap,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface PhoneLinkProps {
  accentColor: ThemeColor;
  osState: OSState;
  updateOSConfig: (key: string, value: any) => void;
}

export const PhoneLink: React.FC<PhoneLinkProps> = ({ accentColor, osState, updateOSConfig }) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages' | 'calls'>('notifications');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const theme = THEME_COLORS[accentColor];

  const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });

  const messages = osState.messages || [];
  const contacts = Array.from(new Set(messages.map(m => m.sender)));

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: selectedContact,
      text: messageInput,
      timestamp: 'Just now',
      isMe: true
    };

    const updatedMessages = [...messages, userMsg];
    updateOSConfig('messages', updatedMessages);
    setMessageInput('');
    setIsAiTyping(true);

    try {
      const prompt = `You are simulated contact "${selectedContact}" on a futuristic mobile phone connected to Infinity OS.
      The user just sent you a message: "${messageInput}"
      Context: Previous messages for this contact were ${JSON.stringify(messages.filter(m => m.sender === selectedContact))}.
      Respond as if you are a colleague or system agent. Keep it under 30 words and very futuristic/tech-savvy.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const aiText = result.text || "Signal interrupted.";
      const modelMsg: Message = {
        id: Math.random().toString(),
        sender: selectedContact,
        text: aiText,
        timestamp: 'Just now',
        isMe: false
      };

      updateOSConfig('messages', [...updatedMessages, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiTyping(false);
    }
  };

  const notifications = [
    { id: 1, title: 'Security Alert', body: 'New login detected on Workstation-4', time: '2m ago', urgent: true },
    { id: 2, title: 'Manager', body: 'The firewall audit is complete.', time: '15m ago', urgent: false },
    { id: 3, title: 'System', body: 'Backup successful.', time: '1h ago', urgent: false },
  ];

  return (
    <div className="h-full grid grid-cols-[240px_1fr] bg-[#080808] font-sans text-zinc-300 overflow-hidden">
      {/* Device Sidebar */}
      <div className="border-r border-white/5 p-6 flex flex-col items-center gap-6 bg-[#040404]">
        <div className="relative">
          <div className="w-24 h-48 border-[3px] border-zinc-900 rounded-[2.5rem] bg-zinc-950 relative p-1 shadow-2xl">
            <div className="w-10 h-1 bg-zinc-900 rounded-full mx-auto mt-2" />
            <div className="absolute inset-x-2 top-8 bottom-8 rounded-[1.8rem] bg-zinc-900/40 flex flex-col items-center justify-center gap-2">
               <Shield className="w-8 h-8 opacity-20" style={{ color: theme.primary }} />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border border-zinc-900" />
          </div>
          <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
        </div>

        <div className="text-center">
           <h4 className="text-sm font-bold text-white uppercase italic tracking-[0.2em] leading-none mb-1">Infinity XP-1</h4>
           <div className="flex items-center gap-2 justify-center">
              <span className="w-1 h-1 rounded-full bg-cyan-500" />
              <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Linked</p>
           </div>
        </div>

        <div className="w-full space-y-4 pt-6 border-t border-white/5">
           {[
             { label: 'Battery', val: '84%', icon: Battery, color: 'text-emerald-500' },
             { label: 'Network', val: '5G_AES', icon: Wifi, color: 'text-cyan-500' }
           ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between">
                 <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</span>
                 <div className="flex items-center gap-1.5">
                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                    <span className="text-[9px] font-mono text-zinc-400">{stat.val}</span>
                 </div>
              </div>
           ))}
        </div>

        <nav className="w-full space-y-1 mt-auto">
           {[
             { id: 'notifications', label: 'Transmissions', icon: Bell },
             { id: 'messages', label: 'Neural Chat', icon: MessageSquare },
             { id: 'calls', label: 'VoIP Crypt', icon: Phone },
           ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-white/5 text-white' : 'text-zinc-600 hover:text-zinc-400 opacity-60'}`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{tab.label}</span>
              </button>
           ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex flex-col bg-white/[0.01]">
        {activeTab === 'notifications' ? (
          <>
            <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Live Intercept</h3>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-8 space-y-4">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-5 rounded-2xl border transition-all hover:bg-white/[0.02] ${n.urgent ? 'bg-red-500/5 border-red-500/20' : 'bg-black border-white/5 shadow-xl'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${n.urgent ? 'text-red-500' : 'text-zinc-600'}`}>
                      {n.title}
                    </span>
                    <span className="text-[8px] text-zinc-700 font-mono italic">{n.time}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">{n.body}</p>
                </div>
              ))}
            </div>
          </>
        ) : activeTab === 'messages' ? (
           <div className="flex-1 flex overflow-hidden">
             {/* Contacts Sidebar */}
             <div className="w-64 border-r border-white/5 flex flex-col p-4 space-y-1">
                {contacts.map(contact => (
                  <button 
                    key={contact}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 rounded-xl text-left transition-all ${selectedContact === contact ? 'bg-white/5 border border-white/10' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{contact}</p>
                    <p className="text-[9px] font-mono text-zinc-700 line-clamp-1 italic">
                      {messages.filter(m => m.sender === contact).slice(-1)[0]?.text}
                    </p>
                  </button>
                ))}
             </div>

             {/* Chat Window */}
             <div className="flex-1 flex flex-col">
                {selectedContact ? (
                  <>
                    <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                             {selectedContact[0]}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest">{selectedContact}</h3>
                            <span className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">
                               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Encrypted Link
                            </span>
                          </div>
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                       {messages.filter(m => m.sender === selectedContact).map((m, i) => (
                         <div key={i} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-[11px] leading-relaxed ${m.isMe ? 'bg-cyan-500 text-black font-bold border border-cyan-400 shadow-lg' : 'bg-white/5 text-zinc-400 border border-white/5'}`}>
                               {m.text}
                            </div>
                         </div>
                       ))}
                       {isAiTyping && (
                         <div className="flex justify-start">
                           <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex gap-1.5 items-center">
                              <Sparkles className="w-3 h-3 text-cyan-500 animate-pulse" />
                              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic tracking-widest">Intercepting Response...</span>
                           </div>
                         </div>
                       )}
                    </div>
                    <form onSubmit={sendMessage} className="p-6 bg-black border-t border-white/5">
                       <div className="relative">
                          <input 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Neural transmission..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs outline-none focus:border-cyan-500/30 transition-all font-mono"
                          />
                          <button 
                            type="submit"
                            disabled={!messageInput.trim() || isAiTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-30"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                       </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                     <MessageSquare className="w-16 h-16 mb-4" />
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Initialize Connection</p>
                  </div>
                )}
             </div>
           </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 grayscale scale-75">
             <Zap className="w-16 h-16 mb-6" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em]">VoIP_Crypt Module Offline</p>
          </div>
        )}
      </div>
    </div>
  );
};
