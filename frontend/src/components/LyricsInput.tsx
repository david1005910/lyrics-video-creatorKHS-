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
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 animate-fade-in">
      <div className="flex items-center mb-4">
        <AlignCenter className="h-5 w-5 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-white">Lyrics</h2>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        Enter lyrics here. Each line will be displayed as one subtitle line.
      </p>

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Enter lyrics here..."
          className="w-full h-64 px-4 py-3 bg-slate-800 text-slate-200 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      <div className="mt-2 flex justify-end">
        <div className="text-xs text-slate-500">
          {value.split('\n').length} lines
        </div>
      </div>
    </div>
  );
};