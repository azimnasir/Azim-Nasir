import React from 'react';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-gray-800 py-8 px-6 bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-end">
        <div className="flex flex-col group cursor-default">
          <h1 className="font-serif text-3xl text-gray-100 italic tracking-tight transition-colors group-hover:text-amber-500">
            Brand Builder <span className="text-[10px] not-italic font-sans text-gray-600 ml-2">by Azim Nasir</span>
          </h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500 mt-1">
            Visual Imagination Engine
          </span>
        </div>
        
        <nav className="hidden md:flex gap-10 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <a href="#" className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500 pb-1">Showcase</a>
          <a href="#" className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500 pb-1">AI Models</a>
          <a href="#" className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500 pb-1">About</a>
        </nav>
      </div>
    </header>
  );
}
