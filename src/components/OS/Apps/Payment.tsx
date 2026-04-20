import React, { useState } from 'react';
import { ThemeColor, THEME_COLORS } from '../../../types';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  History, 
  Send, 
  ShieldCheck, 
  Plus,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const Payment: React.FC<{ accentColor: ThemeColor }> = ({ accentColor }) => {
  const [balance, setBalance] = useState(4250.85);
  const theme = THEME_COLORS[accentColor];

  const transactions = [
    { id: 1, type: 'sent', recipient: 'Azure Cloud', amount: 450.00, date: 'Apr 18', status: 'COMPLETED' },
    { id: 2, type: 'received', recipient: 'Security Audit', amount: 1200.00, date: 'Apr 17', status: 'COMPLETED' },
    { id: 3, type: 'sent', recipient: 'Node Infra', amount: 89.99, date: 'Apr 15', status: 'VERIFYING' },
    { id: 4, type: 'received', recipient: 'Client #082', amount: 2400.00, date: 'Apr 14', status: 'COMPLETED' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0b0c0e] font-sans text-zinc-300 overflow-hidden">
      {/* Header */}
      <div className="p-8 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">Total Balance</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-white">${balance.toLocaleString()}</span>
            <span className="text-emerald-500 text-xs font-bold flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-95">
            <Plus className="w-5 h-5 text-white" />
          </button>
          <button className="px-6 py-3 bg-white text-black font-bold text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <Send className="w-4 h-4" /> SEND MONEY
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_320px] gap-8 p-8 pt-4 overflow-hidden">
        {/* Main Panel */}
        <div className="space-y-8 overflow-auto custom-scrollbar pr-2">
           {/* Quick Actions */}
           <div className="grid grid-cols-3 gap-4">
              {[
                { icon: CreditCard, label: 'Virtual Cards', color: theme.primary },
                { icon: ShieldCheck, label: 'Safe Pay', color: '#10b981' },
                { icon: History, label: 'Statements', color: '#6366f1' },
              ].map((action, i) => (
                <button key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                    <action.icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white">{action.label}</span>
                </button>
              ))}
           </div>

           {/* Transactions */}
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Recent Ledger</h3>
                <button className="text-[10px] text-zinc-600 hover:text-white transition-colors">VIEW ALL</button>
              </div>
              <div className="space-y-2">
                {transactions.map(tx => (
                  <div key={tx.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'sent' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {tx.type === 'sent' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">{tx.recipient}</p>
                        <p className="text-[10px] text-zinc-500 font-mono italic">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === 'sent' ? 'text-zinc-400' : 'text-emerald-400'}`}>
                        {tx.type === 'sent' ? '-' : '+'}${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-[8px] font-bold opacity-40 uppercase tracking-tighter">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
           {/* Card Visualization */}
           <div className="w-full aspect-[1.58/1] bg-gradient-to-br from-zinc-800 to-black rounded-3xl p-6 relative overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 blur-[100px] group-hover:bg-cyan-500/30 transition-all" />
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-widest">ENCRYPTED_CARD</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 active:scale-95 transition-all flex items-center justify-center"><Wallet className="w-4 h-4 text-white/50" /></div>
              </div>
              <div className="mt-8 relative z-10">
                <p className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-widest">Card Number</p>
                <p className="text-lg font-mono text-white tracking-[0.2em]">•••• •••• •••• 8812</p>
              </div>
              <div className="mt-6 flex justify-between items-end relative z-10">
                <div>
                   <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Expiry</p>
                   <p className="text-[10px] font-bold text-white">08/29</p>
                </div>
                <div className="flex -space-x-3 italic font-black text-xl text-white/10 select-none">
                   <span>IN</span>
                   <span>FI</span>
                   <span>NI</span>
                   <span>TY</span>
                </div>
              </div>
           </div>

           {/* Stats / Spending */}
           <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Security Insights</p>
              <div className="space-y-4">
                 {[
                   { label: 'Merchant Trust Score', value: '98%', color: '#10b981' },
                   { label: 'Encrypted Proxy', value: 'ACTIVE', color: theme.primary },
                   { label: 'Spending Velocity', value: 'NORMAL', color: '#6366f1' },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                      <span className="text-zinc-600">{stat.label}</span>
                      <span style={{ color: stat.color }}>{stat.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
