import React from 'react';
import { AlignCenter } from 'lucide-react';

interface LyricsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const LyricsInput: React.FC<LyricsInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="glass-card rounded-softer p-6 float-3d animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="p-1.5 rounded-lg bg-gradient-button mr-2 shadow-glow-accent">
          <AlignCenter className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700">Lyrics</h2>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Enter lyrics here. Each line will be displayed as one subtitle line.
      </p>

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Enter lyrics here..."
          className="input-soft w-full h-64 px-4 py-3 text-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="mt-3 flex justify-end">
        <div className="px-3 py-1 rounded-full glass-card text-xs text-slate-500">
          {value.split('\n').length} lines
        </div>
      </div>
    </div>
  );
};
