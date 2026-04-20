import React, { useState } from 'react';
import { ThemeColor, THEME_COLORS, OSState } from '../../../types';
import { Plus, Trash2, StickyNote, Save } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface NotesProps {
  accentColor: ThemeColor;
  osState: OSState;
  updateOSConfig: (key: string, value: any) => void;
}

export const Notes: React.FC<NotesProps> = ({ accentColor, osState, updateOSConfig }) => {
  const defaultNotes: Note[] = [
    { id: '1', title: 'System Credentials', content: 'Encryption Key: SECURE_123\nAdmin: ROOT', updatedAt: new Date().toISOString() },
    { id: '2', title: 'TODO', content: '- Review firewall logs\n- Update kernel', updatedAt: new Date().toISOString() }
  ];

  const notes = osState.notes || defaultNotes;
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id);
  const theme = THEME_COLORS[accentColor];

  const activeNote = notes.find(n => n.id === activeNoteId);

  const addNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Note',
      content: '',
      updatedAt: new Date().toISOString()
    };
    updateOSConfig('notes', [newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    updateOSConfig('notes', updated);
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n);
    updateOSConfig('notes', updated);
  };

  return (
    <div className="h-full flex bg-zinc-950 font-sans">
      {/* Sidebar */}
      <div className="w-48 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secure Notes</span>
          <button onClick={addNote} className="p-1 hover:bg-white/5 rounded transition-colors">
            <Plus className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`w-full p-4 text-left border-b border-zinc-900 group transition-all ${activeNoteId === note.id ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
            >
              <h4 className={`text-xs font-bold truncate ${activeNoteId === note.id ? 'text-white' : 'text-zinc-500'}`}>{note.title || 'Untitled'}</h4>
              <p className="text-[9px] text-zinc-600 truncate mt-1">{note.content || 'No content'}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <input 
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="bg-transparent text-white font-bold text-sm outline-none w-full"
                placeholder="Note Title"
              />
              <button 
                onClick={() => deleteNote(activeNote.id)}
                className="p-2 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea 
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 bg-transparent p-6 text-zinc-300 text-sm outline-none resize-none"
              placeholder="Start typing your encrypted note..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <StickyNote className="w-12 h-12 mb-4" />
            <p className="text-xs uppercase tracking-widest font-bold">Select a note to decrypt</p>
          </div>
        )}
      </div>
    </div>
  );
};
