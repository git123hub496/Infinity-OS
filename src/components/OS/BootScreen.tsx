import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Cpu, Binary, Zap } from 'lucide-react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootMessages = [
    "INFINITY OS v4.2.0",
    "Copyright (C) 2026 Infinity Corp.",
    "Initializing kernel...",
    "Self-test: CPU checking... [OK]",
    "Self-test: Memory checking... [OK]",
    "Hardware Abstraction Layer starting...",
    "Mounting /dev/nvme0n1p2...",
    "Loading encrypted file system...",
    "Infinity protocols engaged.",
    "System Services: ACTIVE",
    "Global Interface: ACTIVE",
    "Starting Infinity Desktop Environment...",
  ];

  useEffect(() => {
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < bootMessages.length) {
        setLogs(prev => [...prev, bootMessages[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + (Math.random() * 5);
      });
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-emerald-500 font-mono p-10 flex flex-col items-center justify-center overflow-hidden z-[9999]">
      <div className="max-w-2xl w-full">
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 flex items-center justify-center border-2 border-emerald-400 rounded-xl"
          >
            <span className="text-4xl font-bold text-emerald-400">∞</span>
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-emerald-400">INFINITY OS</h1>
            <p className="text-emerald-600">ADVANCED SYSTEM BIOS v2.1</p>
          </div>
        </div>

        <div className="h-64 overflow-y-auto mb-8 pr-4 space-y-1 custom-scrollbar">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-emerald-700">[{i.toString().padStart(2, '0')}]</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>SYSTEM INITIALIZATION</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full bg-emerald-900/30 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="bg-emerald-500 h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center p-8 rounded-full border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            >
              <span className="text-8xl font-bold text-emerald-500 animate-pulse">∞</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
