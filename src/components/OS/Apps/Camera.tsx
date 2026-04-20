import React, { useRef, useEffect, useState } from 'react';
import { ThemeColor, THEME_COLORS } from '../../../types';
import { Camera as CameraIcon, Scan, RefreshCw, Radio } from 'lucide-react';

interface CameraProps {
  accentColor: ThemeColor;
}

export const Camera: React.FC<CameraProps> = ({ accentColor }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = THEME_COLORS[accentColor];

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        setError("SECURITY ACCESS DENIED OR CAMERA NOT FOUND");
      }
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="bg-black h-full flex flex-col relative overflow-hidden font-mono">
      {/* HUD Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-red-500 font-bold">REC // LIVE_FEED</span>
            </div>
            <span className="text-[10px] text-zinc-500">RES: 1920x1080 @ 60FPS</span>
            <span className="text-[10px] text-zinc-500">ISO: AUTO / SHUTTER: 1/120</span>
          </div>
          <div className="text-right">
            <span className="text-[12px] font-bold" style={{ color: theme.primary }}>INFINITY_BIOS_v4.2</span>
            <div className="text-[10px] text-zinc-600">ENCRYPTION: HARDWARE_LEVEL_3</div>
          </div>
        </div>

        {/* Framing lines */}
        <div className="absolute inset-0 border-[20px] border-black/20 m-4">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: theme.primary }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: theme.primary }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: theme.primary }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: theme.primary }} />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-zinc-500/20 rounded-full flex items-center justify-center">
             <div className="w-1 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Scanning facial markers...</div>
            <div className="w-48 bg-zinc-900 h-1 overflow-hidden">
               <div className="h-full animate-[loading_2s_infinite] w-1/2" style={{ backgroundColor: theme.primary }} />
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2 mb-2">
                <Scan className="w-4 h-4" style={{ color: theme.primary }} />
                <span className="text-[10px] font-bold" style={{ color: theme.primary }}>OBJ_DETECT</span>
             </div>
             <div className="text-[10px] text-zinc-600">SAT_LOCK: ACQUIRED</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-zinc-900/20">
        {error ? (
          <div className="text-red-500 text-center space-y-2 p-8 border-2 border-dashed border-red-500/20 rounded-2xl">
            <Radio className="w-12 h-12 mx-auto mb-4 animate-bounce" />
            <h4 className="font-bold text-lg uppercase tracking-widest">Access Blocked</h4>
            <p className="text-xs opacity-60">SYSTEM PRIVILEGES INSUFFICIENT OR HARDWARE DISCONNECTED.</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-80"
            style={{ filter: 'contrast(1.2) brightness(0.9) sepia(0.2)' }}
          />
        )}
      </div>

      <div className="h-16 bg-zinc-950 border-t border-zinc-900 flex items-center justify-center gap-8 z-20">
        <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors">
          <RefreshCw className="w-4 h-4 text-zinc-400" />
        </button>
        <button className="w-12 h-12 rounded-full border-4 flex items-center justify-center hover:scale-110 transition-transform shadow-lg group" style={{ borderColor: theme.primary }}>
           <div className="w-8 h-8 rounded-full transition-all group-hover:scale-90" style={{ backgroundColor: theme.primary }} />
        </button>
        <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors">
          <CameraIcon className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
