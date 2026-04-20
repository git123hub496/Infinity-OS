import React, { useRef, useState, useEffect } from 'react';
import { ThemeColor, THEME_COLORS } from '../../../types';
import { Eraser, Pencil, Square, Circle, Download, Trash2, Undo } from 'lucide-react';

export const Paint: React.FC<{ accentColor: ThemeColor }> = ({ accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00fae1');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'rect' | 'circle'>('pencil');
  
  const theme = THEME_COLORS[accentColor];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
      }
    }
  }, [color, brushSize]);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (tool === 'eraser') {
        ctx.strokeStyle = '#050505';
      } else {
        ctx.strokeStyle = color;
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'infinity_art.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const colors = ['#00fae1', '#ffffff', '#ff0055', '#bc00ff', '#00d4ff', '#ffcc00', '#00ffaa'];

  return (
    <div className="h-full flex flex-col bg-zinc-950 font-sans select-none overflow-hidden">
      {/* Toolbar */}
      <div className="bg-zinc-900/80 border-b border-white/5 p-4 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
           {[
             { id: 'pencil', icon: Pencil },
             { id: 'eraser', icon: Eraser },
           ].map((t) => (
             <button
               key={t.id}
               onClick={() => setTool(t.id as any)}
               className={`p-2 rounded-lg transition-all ${tool === t.id ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
             >
               <t.icon className="w-4 h-4" />
             </button>
           ))}
        </div>

        <div className="flex items-center gap-2">
           {colors.map(c => (
              <button 
                key={c} 
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
           ))}
        </div>

        <div className="flex items-center gap-4">
           <input 
             type="range" 
             min="1" max="50"
             value={brushSize}
             onChange={(e) => setBrushSize(parseInt(e.target.value))}
             className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
           />
           <span className="text-[10px] font-mono text-zinc-500 w-4">{brushSize}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={clearCanvas} className="p-2 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-lg transition-all" title="Clear">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={download} className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> SAVE
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-[#050505] relative overflow-hidden flex items-center justify-center p-8">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 cursor-crosshair rounded-sm"
        />
      </div>
    </div>
  );
};
