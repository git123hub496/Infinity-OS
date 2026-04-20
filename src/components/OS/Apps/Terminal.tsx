import React, { useState, useRef, useEffect } from 'react';
import { ThemeColor, THEME_COLORS } from '../../../types';

interface TerminalProps {
  accentColor: ThemeColor;
}

export const Terminal: React.FC<TerminalProps> = ({ accentColor }) => {
  const [history, setHistory] = useState<string[]>([
    "Infinity Security Terminal v4.2.0",
    "System authenticated. Welcome, SECURITY_ADMIN.",
    "Type 'help' for available commands.",
    ""
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = THEME_COLORS[accentColor];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `admin@infinity:~$ ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push("Available commands:", " - clear: Clear terminal", " - status: Check system security", " - network: List active connections", " - version: Show OS version", " - whoami: Display current user information");
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'status':
        newHistory.push("SYSTEM STATUS: SECURE", "Firewall Protection: HIGH", "Encryption: AES-256-GCM", "Intrusion Detection: SCANNING...");
        break;
      case 'network':
        newHistory.push("ACTIVE CONNECTIONS:", " - Connection 1: 192.168.1.105 [INTERNAL]", " - Connection 2: ESTABLISHED [ENCRYPTED]");
        break;
      case 'version':
        newHistory.push("Infinity OS Version 4.2.0-SECURE (Build 2026.04.18)");
        break;
      case 'whoami':
        newHistory.push("USER: SECURITY_ADMIN", "ROLE: GLOBAL_ADMINISTRATOR", "SECURITY_CLEARANCE: LEVEL_9");
        break;
      default:
        newHistory.push(`Command not found: ${cmd}. Type 'help' for assistance.`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div 
      className="p-4 font-mono text-sm h-full flex flex-col bg-black/80"
      style={{ color: '#00ffaa' }}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto pointer-events-auto space-y-1 mb-2 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-center gap-2">
        <span style={{ color: theme.primary }}>admin@infinity:~$</span>
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 text-zinc-100"
          spellCheck={false}
        />
      </form>
    </div>
  );
};
