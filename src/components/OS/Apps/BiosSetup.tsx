import React, { useState } from 'react';
import { ThemeColor, THEME_COLORS } from '../../../types';

interface BiosSetupProps {
  accentColor: ThemeColor;
  updateOSConfig: (key: any, value: any) => void;
}

export const BiosSetup: React.FC<BiosSetupProps> = ({ accentColor, updateOSConfig }) => {
  const theme = THEME_COLORS[accentColor];
  const [selectedSetting, setSelectedSetting] = useState(0);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const securitySettings = [
    { name: 'Set Supervisor Password', status: 'NOT SET' },
    { name: 'Manage Encryption Keys', status: 'VALID' },
    { name: 'Network Hardware Lock', status: 'ENABLED' },
    { name: 'Factory Hard Reset', status: 'DISARMED' },
    { name: 'Legacy Boot Mode', status: 'DISABLED' },
  ];

  return (
    <div className="h-full bg-[#000084] text-white font-mono p-10 overflow-auto select-none">
      <div className="border-4 border-white h-full p-4 flex flex-col relative">
        <div className="text-center bg-white text-[#000084] font-bold py-1 mb-6">
          INFINITY SECURITY FIRMWARE SETUP UTILITY (ver 0.99b)
        </div>

        {showResetWarning && (
          <div className="absolute inset-0 bg-[#000084]/95 flex items-center justify-center p-6 z-50">
            <div className="bg-red-600 border-4 border-white text-white p-6 max-w-md shadow-[8px_8px_0_rgba(0,0,0,0.5)] space-y-4 font-mono text-center">
              <div className="bg-white text-red-600 font-bold py-1 px-4 uppercase text-center text-xs">
                !!! HARDWARE SECURITY ALERT !!!
              </div>
              <p className="text-xs leading-relaxed uppercase">
                A request has been received to flash BIOS blocks and restore raw partition state to NEBULA OS. 
                This action is IRREVERSIBLE and will partition 'HDD0: SECURE_DRIVE'.
              </p>
              <div className="flex gap-4 justify-center pt-2">
                <a 
                  href="https://nebulaoslink.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowResetWarning(false)}
                  className="bg-white text-red-600 border-2 border-white px-4 py-1 font-bold text-xs"
                >
                  [ YES - EXECUTE ]
                </a>
                <button 
                  onClick={() => setShowResetWarning(false)}
                  className="bg-red-600 text-white border-2 border-white px-4 py-1 font-bold text-xs hover:bg-red-500"
                >
                  [ CANCEL ]
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 grid grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="underline">Main Configuration</h3>
            <div className="space-y-2 text-xs">
              <p className="flex justify-between"><span>Processor:</span> <span className="text-cyan-300">INFINITY-X1 @ 4.2GHz</span></p>
              <p className="flex justify-between"><span>Memory:</span> <span className="text-cyan-300">131072MB ECC DDR5</span></p>
              <p className="flex justify-between"><span>L1 Cache:</span> <span className="text-cyan-300">1024KB</span></p>
              <p className="flex justify-between"><span>Secure Boot:</span> <span className="text-emerald-400">[ACTIVE]</span></p>
              <p className="flex justify-between"><span>Kernel Isolation:</span> <span className="text-emerald-400">[ENABLED]</span></p>
              <p className="flex justify-between"><span>Boot Priority:</span> <span className="text-amber-300">HDD0: SECURE_DRIVE</span></p>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="underline">Security Parameters</h3>
             <ul className="list-none space-y-2 text-xs">
                {securitySettings.map((s, i) => (
                  <li 
                    key={i}
                    onClick={() => {
                      setSelectedSetting(i);
                      if (s.name === 'Factory Hard Reset') {
                        setShowResetWarning(true);
                      }
                    }}
                    className={`px-1 cursor-pointer flex justify-between ${selectedSetting === i ? 'bg-white text-[#000084]' : 'hover:bg-white/10'}`}
                  >
                    <span>{s.name}</span>
                    <span className="opacity-70">{s.status}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white pt-4 text-[10px] space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>F10: Save and Exit</p>
              <p>ESC: Discard Changes</p>
              <p>UP/DOWN: Navigate</p>
            </div>
            <div className="bg-white/5 p-2 italic text-[#fffa] border border-white/10 text-[9px]">
              CAUTION: Modifying firmware parameters may result in hardware-level encryption lockout. Proceed with administrative caution.
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => updateOSConfig('isBooted', false)}
              className="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-1 text-xs font-bold border-2 border-white shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              COMMIT & REBOOT
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-white text-[#000084] px-4 py-1 text-xs font-bold border-2 border-[#000084] shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              EXIT WITHOUT SAVING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
