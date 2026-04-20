import React, { useState } from 'react';
import { Search, Settings, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUIStore } from '../store/useUIStore';
import AuthModal from './AuthModal';
import SettingsModal from './SettingsModal';

export default function TopHeader() {
  const { user, signOut, isAuthModalOpen, setAuthModalOpen } = useAuth();
  const { searchQuery, setSearchQuery, setSettingsOpen } = useUIStore();

  return (
    <div className="h-16 bg-bg-nav border-b border-[#262626] flex items-center justify-between px-8 text-sm shrink-0 w-full z-10">
      <div className="flex items-center gap-6 text-text-secondary">
        <a 
          href="https://github.com/its-shadow7/Algorithm-Visualizer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-text-primary transition-colors cursor-pointer"
        >
          Docs
        </a>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-text-muted group-focus-within:text-text-secondary transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Library..."
            className="bg-[#050505] border border-[#262626] rounded-sm py-1.5 pl-9 pr-4 text-xs text-text-primary w-64 focus:outline-none focus:border-accent-green/50 placeholder:text-text-muted transition-colors"
          />
        </div>

        <div className="h-6 w-[1px] bg-[#262626] mx-1" />

        <div className="flex items-center gap-4 text-text-muted">
          <button onClick={() => setSettingsOpen(true)} className="hover:text-text-primary transition-colors">
            <Settings size={16} />
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-white max-w-[120px] truncate">{user.email}</span>
              <span className="text-[8px] font-mono text-accent-green uppercase tracking-tighter">Authenticated</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700/50 transition-all group"
              title="Sign Out"
            >
              <LogOut size={16} className="transition-transform group-hover:scale-110" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 bg-accent-green hover:bg-accent-green-hover text-black font-mono font-bold text-[11px] tracking-widest uppercase px-5 py-2 rounded-sm transition-colors shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          >
            <LogIn size={14} fill="currentColor" />
            Sign In
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SettingsModal />
    </div>
  );
}
