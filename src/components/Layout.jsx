import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import TopHeader from './TopHeader';

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-bg-app font-sans text-text-primary overflow-hidden">
      {/* Fixed Sidebar */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopHeader />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative w-full">
          <Outlet />
        </main>

        {/* Global System Status Indicator */}
        <div className="absolute bottom-6 right-6 border-l border-accent-green bg-bg-card px-4 py-3 shadow-lg flex items-center gap-3 w-64 z-50 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <div>
            <div className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em] mb-0.5">System Status</div>
            <div className="text-[10px] font-mono text-text-primary uppercase tracking-widest leading-none">ALGO_CORE_STABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
