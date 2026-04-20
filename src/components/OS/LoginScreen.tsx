import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Fingerprint, Lock, ChevronRight, User, Power, RefreshCw, UserPlus, LogOut } from 'lucide-react';
import { OSState } from '../../types';

interface LoginScreenProps {
  onLogin: () => void;
  accentColor: string;
  osState: OSState;
  updateOSConfig: (key: keyof OSState, value: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, accentColor, osState, updateOSConfig }) => {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  const currentUser = osState.users.find(u => u.id === osState.currentUserId) || osState.users[0];

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const addAccount = () => {
    const name = prompt("Enter new username:");
    if (name) {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.toUpperCase(),
        role: 'Standard User'
      };
      updateOSConfig('users', [...osState.users, newUser]);
      updateOSConfig('currentUserId', newUser.id);
    }
  };

  const handlePowerAction = (action: 'restart' | 'shutdown') => {
    if (action === 'restart') {
      updateOSConfig('isBooted', false);
    } else {
      // Shutdown - just refresh or show black
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,25,30,1)_0%,rgba(0,0,0,1)_100%)] z-0" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] border border-cyan-500/20 rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40rem] h-[40rem] border border-cyan-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm flex flex-col items-center relative z-10"
      >
        <div className="mb-10 text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl relative group overflow-hidden mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Shield className="w-12 h-12 text-cyan-500 relative z-10" />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Infinity OS</h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">Secure environment access</p>
        </div>

        <AnimatePresence mode="wait">
          {!isVerifying ? (
            <motion.div 
              key="login-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full space-y-8"
            >
              {/* User Selection */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex -space-x-4">
                  {osState.users.map(user => (
                    <button
                      key={user.id}
                      onClick={() => updateOSConfig('currentUserId', user.id)}
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all overflow-hidden ${osState.currentUserId === user.id ? 'border-cyan-500 scale-110 z-10' : 'border-zinc-800 bg-zinc-900 grayscale opacity-50 z-0'}`}
                    >
                      <User className="w-6 h-6 text-zinc-400" />
                    </button>
                  ))}
                  <button 
                    onClick={addAccount}
                    className="w-14 h-14 rounded-full border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center hover:border-zinc-600 transition-all"
                  >
                    <UserPlus className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold">{currentUser.name}</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider">{currentUser.role}</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="ENTER AUTHORIZATION"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder:text-zinc-700 placeholder:text-[10px] text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-600 hover:text-cyan-500 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleLogin()}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <Fingerprint className="h-5 w-5" />
                  BIOMETRIC SIGN-IN
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin" />
                <Shield className="absolute inset-0 m-auto w-6 h-6 text-cyan-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold uppercase tracking-[0.2em] text-xs">Authenticating</p>
                <p className="text-zinc-500 text-[9px] uppercase tracking-tighter mt-1">infinity security handshake...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Interface */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-20">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-zinc-500 font-mono uppercase">System: infinity_node_01</div>
          <div className="text-[10px] text-cyan-500/50 font-mono animate-pulse uppercase">Press [B] for BIOS settings</div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {showPowerMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-4 w-48 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                <button 
                  onClick={() => handlePowerAction('restart')}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-zinc-300 text-xs font-bold transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-500" /> RESTART
                </button>
                <button 
                  onClick={() => handlePowerAction('shutdown')}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-zinc-300 text-xs font-bold transition-colors"
                >
                  <Power className="w-4 h-4 text-red-500" /> SHUT DOWN
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setShowPowerMenu(!showPowerMenu)}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Power className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
