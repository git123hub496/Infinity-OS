import React, { useState } from 'react';
import { ThemeColor, THEME_COLORS, OSState, Email as EmailType } from '../../../types';
import { 
  Mail, 
  Send, 
  Search, 
  Inbox, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface EmailProps {
  accentColor: ThemeColor;
  osState: OSState;
  updateOSConfig: (key: string, value: any) => void;
}

export const Email: React.FC<EmailProps> = ({ accentColor, osState, updateOSConfig }) => {
  const [activeEmailId, setActiveEmailId] = useState<string | null>(osState.emails?.[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const theme = THEME_COLORS[accentColor];

  const emails = osState.emails || [];
  const activeEmail = emails.find(e => e.id === activeEmailId);

  const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });

  const sendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeEmail) return;

    const userReply = { role: 'user' as const, text: replyText, timestamp: 'Just now' };
    const updatedReplies = [...activeEmail.replies, userReply];
    
    const updatedEmails = emails.map(email => 
      email.id === activeEmail.id ? { ...email, replies: updatedReplies } : email
    );
    updateOSConfig('emails', updatedEmails);
    setReplyText('');
    setIsAiReplying(true);

    try {
      const prompt = `You are an AI assistant for Infinity OS, representing Infinity Cyber Security Company. 
      You are replying to an email conversation. 
      Original Subject: ${activeEmail.subject}
      Original Body: ${activeEmail.body}
      Previous Replies: ${JSON.stringify(activeEmail.replies)}
      Latest User Message: ${replyText}
      
      Provide a professional, concise, and futuristic security-focused response. Keep it under 50 words.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const aiText = result.text || "Neural connection interrupted. Please retry.";
      const modelReply = { role: 'model' as const, text: aiText, timestamp: 'Just now' };

      const finalEmails = updatedEmails.map(email => 
        email.id === activeEmail.id ? { ...email, replies: [...updatedReplies, modelReply] } : email
      );
      updateOSConfig('emails', finalEmails);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiReplying(false);
    }
  };

  return (
    <div className="h-full flex bg-[#0c0d0f] font-sans text-zinc-300 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/5 flex flex-col pt-6">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Mail className="w-4 h-4 text-cyan-500" />
             </div>
             <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Quantum_Mail</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Filter transmissions..." 
              className="w-full bg-white/[0.03] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-[10px] outline-none focus:border-cyan-500/30 transition-all font-mono"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
           {emails.map(email => (
             <button
               key={email.id}
               onClick={() => {
                 setActiveEmailId(email.id);
                 if (!email.isRead) {
                    updateOSConfig('emails', emails.map(e => e.id === email.id ? { ...e, isRead: true } : e));
                 }
               }}
               className={`w-full p-4 rounded-xl text-left border transition-all flex flex-col gap-1 ${activeEmailId === email.id ? 'bg-white/5 border-white/10 shadow-lg' : 'border-transparent hover:bg-white/[0.02]'}`}
             >
               <div className="flex justify-between items-center mb-1">
                 <span className={`text-[10px] font-bold ${email.isRead ? 'text-zinc-500' : 'text-cyan-500'}`}>{email.sender}</span>
                 <span className="text-[8px] text-zinc-600 font-mono">{email.timestamp}</span>
               </div>
               <h3 className={`text-xs ${email.isRead ? 'text-zinc-400' : 'text-white font-bold'} tracking-tight truncate`}>{email.subject}</h3>
               <p className="text-[10px] text-zinc-600 line-clamp-1 truncate italic">"{email.body}"</p>
             </button>
           ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.01]">
        {activeEmail ? (
          <>
            {/* Thread Header */}
            <div className="p-8 pb-6 border-b border-white/5">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <h2 className="text-xl font-bold text-white tracking-tight uppercase italic mb-1">{activeEmail.subject}</h2>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{activeEmail.sender}</span>
                      <ChevronRight className="w-3 h-3 text-zinc-700" />
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Infinity_User_A1</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2.5 bg-white/5 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all"><Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-500" /></button>
                 </div>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
              {/* Original Message */}
              <div className="flex gap-4 group">
                 <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 shrink-0 flex items-center justify-center text-[10px] font-bold text-zinc-700">ROOT</div>
                 <div className="space-y-4 max-w-2xl">
                    <p className="text-sm text-zinc-300 leading-relaxed font-light">{activeEmail.body}</p>
                    <div className="flex items-center gap-4 py-2 px-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg w-fit">
                       <ShieldCheck className="w-3 h-3 text-cyan-500" />
                       <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest">Verified System Communication</span>
                    </div>
                 </div>
              </div>

              {/* Replies */}
              {activeEmail.replies.map((reply, i) => (
                <div key={i} className={`flex gap-4 ${reply.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                   <div className={`w-10 h-10 rounded-xl border shrink-0 flex items-center justify-center text-[10px] font-bold ${reply.role === 'user' ? 'bg-white text-black border-white' : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'}`}>
                      {reply.role === 'user' ? 'YOU' : <Sparkles className="w-5 h-5" />}
                   </div>
                   <div className={`p-4 rounded-2xl max-w-xl text-sm leading-relaxed ${reply.role === 'user' ? 'bg-white/5 border border-white/10 text-white ml-auto' : 'bg-zinc-900 border border-white/5 text-zinc-400'}`}>
                      {reply.text}
                   </div>
                </div>
              ))}

              {isAiReplying && (
                <div className="flex gap-4 animate-pulse">
                   <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0 flex items-center justify-center text-cyan-500">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                   </div>
                   <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">
                      Processing neural response...
                   </div>
                </div>
              )}
            </div>

            {/* Reply Input */}
            <form onSubmit={sendReply} className="p-6 bg-white/[0.02] border-t border-white/5">
               <div className="relative">
                 <textarea 
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       sendReply();
                     }
                   }}
                   placeholder="Neural encryption active. Type your transmission..."
                   className="w-full bg-[#161c21] border border-white/10 rounded-2xl py-4 pl-4 pr-16 text-sm outline-none focus:border-cyan-500/30 transition-all resize-none min-h-[60px]"
                 />
                 <button 
                   type="submit"
                   disabled={!replyText.trim() || isAiReplying}
                   className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                 >
                   <Send className="w-4 h-4" />
                 </button>
               </div>
               <div className="mt-2 flex items-center gap-2 px-1">
                  <Sparkles className="w-3 h-3 text-cyan-500" />
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">AI Assisted Response Active</span>
               </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
             <Inbox className="w-16 h-16 mb-6" />
             <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No Transmission Selected</p>
          </div>
        )}
      </div>
    </div>
  );
};
