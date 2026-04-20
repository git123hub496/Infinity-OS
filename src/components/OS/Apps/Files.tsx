import React, { useState, useEffect } from 'react';
import { ThemeColor, THEME_COLORS, OSState } from '../../../types';
import { 
  Folder, 
  File, 
  Shield, 
  ChevronRight, 
  HardDrive, 
  Lock, 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Cpu
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder' | 'image';
  size?: string;
  modified: string;
  content?: string; // For images, this will be the data URL
}

interface FilesProps {
  accentColor: ThemeColor;
  osState: OSState;
  updateOSConfig: (key: string, value: any) => void;
}

export const Files: React.FC<FilesProps> = ({ accentColor, osState, updateOSConfig }) => {
  const [currentPath, setCurrentPath] = useState(['ROOT']);
  const theme = THEME_COLORS[accentColor];

  const defaultFS: Record<string, FileItem[]> = {
    'ROOT': [
      { name: 'SYSTEM', type: 'folder', modified: '2026.04.18' },
      { name: 'USER', type: 'folder', modified: '2026.04.18' },
      { name: 'config.sys', type: 'file', size: '2KB', modified: '2026.04.15' },
    ],
    'USER': [
      { name: 'Documents', type: 'folder', modified: '2026.04.18' },
      { name: 'Media', type: 'folder', modified: '2026.04.18' },
      { name: 'identity_v2.key', type: 'file', size: '128KB', modified: '2026.04.17' },
    ],
    'SYSTEM': [
      { name: 'KERN_LDR', type: 'file', size: '4.2GB', modified: '2026.04.10' },
      { name: 'FIREWALL_LOG', type: 'file', size: '1.5MB', modified: '2026.04.18' },
    ],
    'MEDIA': [],
    'DOCUMENTS': [],
  };

  const fs = osState.fileSystem || defaultFS;
  const currentKey = currentPath[currentPath.length - 1].toUpperCase();
  const files = fs[currentKey] || [];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem: FileItem = {
          name: file.name,
          type: isImage ? 'image' : 'file',
          size: `${Math.round(file.size / 1024)}KB`,
          modified: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
          content: isImage ? (event.target?.result as string) : undefined
        };

        const updatedFS = { ...fs };
        updatedFS[currentKey] = [...(updatedFS[currentKey] || []), newItem];
        updateOSConfig('fileSystem', updatedFS);
      };
      if (isImage) reader.readAsDataURL(file);
      else reader.readAsText(file);
    }
  };

  const navigateTo = (folder: string) => {
    setCurrentPath([...currentPath, folder.toUpperCase()]);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 font-sans text-zinc-400 select-none">
      {/* Sidebar / Nav */}
      <div className="flex bg-zinc-900/50 p-2.5 items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-4 text-[10px] font-bold">
          <div className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-zinc-600" />
            <span className="uppercase tracking-widest text-zinc-100">Infinity_Hard_Drive</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-600">
            {currentPath.map((p, i) => (
              <React.Fragment key={i}>
                <span className={i === currentPath.length - 1 ? "text-cyan-500" : "hover:text-zinc-300 cursor-pointer"} onClick={() => setCurrentPath(currentPath.slice(0, i+1))}>{p}</span>
                {i < currentPath.length - 1 && <ChevronRight className="w-3 h-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <label className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[10px] font-bold text-white cursor-pointer transition-all active:scale-95">
           <Upload className="w-3.5 h-3.5" />
           UPLOAD
           <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Links */}
        <div className="w-48 border-r border-zinc-900 p-4 space-y-6 bg-black/20">
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider">Access Controls</span>
            <div 
              onClick={() => setCurrentPath(['ROOT'])}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${currentKey === 'ROOT' ? 'bg-white/5 border-white/20 text-white' : 'border-transparent hover:bg-white/5'}`}
            >
              <Shield className="w-4 h-4 text-cyan-500" />
              <span className="text-xs">Secure Root</span>
            </div>
            <div 
              onClick={() => setCurrentPath(['ROOT', 'SYSTEM'])}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${currentKey === 'SYSTEM' ? 'bg-white/5 border-white/20 text-white' : 'border-transparent hover:bg-white/5'}`}
            >
              <Cpu className="w-4 h-4 text-amber-500" />
              <span className="text-xs">System Registry</span>
            </div>
            <div 
              onClick={() => setCurrentPath(['ROOT', 'USER'])}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${currentKey === 'USER' ? 'bg-white/5 border-white/20 text-white' : 'border-transparent hover:bg-white/5'}`}
            >
              <Lock className="w-4 h-4 text-zinc-600" />
              <span className="text-xs">Vault A1</span>
            </div>
          </div>
        </div>

        {/* File Browser Grid */}
        <div className="flex-1 p-6 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6">
            {files.map((file, idx) => (
              <div 
                key={idx} 
                onDoubleClick={() => file.type === 'folder' && navigateTo(file.name)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/20 transition-all shadow-lg active:scale-95 group relative overflow-hidden">
                  {file.type === 'folder' ? (
                     <Folder className="w-8 h-8 text-cyan-500 fill-cyan-500/10" />
                  ) : file.type === 'image' ? (
                     <img src={file.content} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                     <FileText className="w-8 h-8 text-zinc-600" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-tighter truncate w-24">{file.name}</p>
                  <p className="text-[8px] text-zinc-600 font-mono italic">{file.size || 'DIR'}</p>
                </div>
              </div>
            ))}
            
            {files.length === 0 && (
              <div className="col-span-full h-full flex flex-col items-center justify-center text-zinc-800 py-20 border-2 border-dashed border-white/[0.02] rounded-3xl">
                 <Folder className="w-12 h-12 mb-4 opacity-20" />
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Empty Secure Space</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-zinc-900 flex items-center justify-between text-[8px] font-bold uppercase text-zinc-600 px-4 border-t border-white/5">
        <div className="flex gap-4">
           <span>Total Objects: {files.length}</span>
           <span>Path: {currentPath.join('/')}</span>
        </div>
        <span className="text-emerald-500/50 flex items-center gap-1"><Shield className="w-2.5 h-2.5" /> Hardware Integrity: 100%</span>
      </div>
    </div>
  );
};
