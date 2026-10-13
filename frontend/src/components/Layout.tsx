import React from 'react';
import { Film, GithubIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-card py-4 px-6 mb-6 rounded-b-softer border-t-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-button shadow-glow-primary">
              <Film className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lyrics Video Creator
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Kogia-sima/lyrics-video-creator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl glass-card hover:shadow-glow-secondary transition-all duration-300"
              title="GitHub"
            >
              <GithubIcon className="h-5 w-5 text-slate-600" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-6">
        {children}
      </main>

      <footer className="glass-card py-4 px-6 mt-6 rounded-t-softer border-b-0">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent font-medium">
            Lyrics Video Creator &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
};
