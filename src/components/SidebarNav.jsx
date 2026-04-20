import React, { useState, useEffect } from 'react';
import { 
  LayoutList, 
  Network, 
  Zap, 
  ChevronDown, 
  BarChart2, 
  Binary, 
  Activity,
  Box
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function SidebarNav() {
  const { pathname } = useLocation();
  
  // Categorized State
  const [expanded, setExpanded] = useState({
    sorting: pathname.includes('/sorting'),
    pathfinding: pathname.includes('/pathfinding'),
    trees: pathname.includes('/trees')
  });

  // Auto-expand based on route
  useEffect(() => {
    if (pathname.includes('/sorting')) setExpanded(prev => ({ ...prev, sorting: true }));
    if (pathname.includes('/pathfinding')) setExpanded(prev => ({ ...prev, pathfinding: true }));
    if (pathname.includes('/trees')) setExpanded(prev => ({ ...prev, trees: true }));
  }, [pathname]);

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-64 h-full bg-bg-sidebar border-r border-white/5 flex flex-col pt-8 pb-4 select-none shrink-0 z-10 overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="px-7 flex items-center gap-4 mb-12">
        <div className="w-8 h-8 bg-accent-green/10 border border-accent-green/20 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <BarChart2 className="text-accent-green" size={16} />
        </div>
        <div>
          <h1 className="font-mono text-white text-sm tracking-widest font-bold">ALGO_CORE</h1>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[9px] text-text-muted font-mono uppercase tracking-widest">v 2.1.0_PRO</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6">
        {/* Global Group */}
        <div className="space-y-1">
          <NavSectionHeader label="System Dashboard" />
          <NavItem to="/library" icon={<LayoutList size={16} />} label="Algorithm Library" />
          <NavItem to="/sorting/race" icon={<Zap size={16} />} label="High-Speed Race" />
        </div>

        {/* Sorting Accordion */}
        <div className="space-y-1">
          <button 
            onClick={() => toggle('sorting')}
            className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] hover:text-text-primary transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Binary size={12} className={expanded.sorting ? 'text-accent-green' : ''} />
              Sorting Visuals
            </div>
            <ChevronDown size={12} className={`transition-transform duration-300 ${expanded.sorting ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence initial={false}>
            {expanded.sorting && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-0.5 ml-2 border-l border-white/5"
              >
                {/* Category: Classic */}
                <div className="px-5 py-2 mt-2 text-[8px] font-mono font-bold text-text-muted uppercase tracking-widest border-b border-white/5 mb-1">Classic Algorithms</div>
                <SubNavItem to="/sorting/merge-sort" label="Merge Sort" />
                <SubNavItem to="/sorting/quick-sort" label="Quick Sort" />
                <SubNavItem to="/sorting/heap-sort" label="Heap Sort" />
                <SubNavItem to="/sorting/bubble-sort" label="Bubble Sort" />
                <SubNavItem to="/sorting/selection-sort" label="Selection Sort" />
                <SubNavItem to="/sorting/insertion-sort" label="Insertion Sort" />

                {/* Category: System Engines */}
                <div className="px-5 py-2 mt-4 text-[8px] font-mono font-bold text-text-muted uppercase tracking-widest border-b border-white/5 mb-1">System Engines</div>
                <SubNavItem to="/sorting/timsort" label="Timsort [Python]" />
                <SubNavItem to="/sorting/dual-pivot-quick-sort" label="Dual-Pivot QS [Java]" />
                <SubNavItem to="/sorting/introsort" label="Introsort [C++]" />

                {/* Category: Non-Comparative */}
                <div className="px-5 py-2 mt-4 text-[8px] font-mono font-bold text-text-muted uppercase tracking-widest border-b border-white/5 mb-1">Non-Comparative</div>
                <SubNavItem to="/sorting/radix-sort" label="Radix Sort" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pathfinding Accordion */}
        <div className="space-y-1">
          <button 
            onClick={() => toggle('pathfinding')}
            className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] hover:text-text-primary transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Activity size={12} className={expanded.pathfinding ? 'text-cyan-400' : ''} />
              Pathfinding
            </div>
            <ChevronDown size={12} className={`transition-transform duration-300 ${expanded.pathfinding ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence initial={false}>
            {expanded.pathfinding && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-0.5 ml-2 border-l border-white/5"
              >
                <SubNavItem to="/pathfinding/bfs" label="BFS Grid Sandbox" />
                <SubNavItem to="/pathfinding/a-star" label="A* Search Path" />
                <SubNavItem to="/pathfinding/dijkstra" label="Dijkstra's Algorithm" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trees Accordion */}
        <div className="space-y-1">
          <button 
            onClick={() => toggle('trees')}
            className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] hover:text-text-primary transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Network size={12} className={expanded.trees ? 'text-purple-400' : ''} />
              Tree Structures
            </div>
            <ChevronDown size={12} className={`transition-transform duration-300 ${expanded.trees ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence initial={false}>
            {expanded.trees && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-0.5 ml-2 border-l border-white/5"
              >
                <SubNavItem to="/trees/bst" label="Binary Search Tree" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Locked/Future Groups */}
        <div className="pt-4 opacity-40">
           <NavSectionHeader label="Experimental" isLocked />
           <div className="px-4 space-y-2 mt-2">
             <FuturePlaceHolder label="Dynamic Programming" />
           </div>
        </div>
      </nav>

      {/* Sidebar Footer Info */}
      <div className="mt-auto px-7 pt-6 border-t border-white/5">
         <div className="bg-bg-card p-3 rounded-lg border border-white/5 shadow-inner">
            <div className="text-[8px] font-mono text-text-muted uppercase mb-1">Compute Environment</div>
            <p className="text-[10px] font-mono text-white/70">WASM_V8_ENABLED</p>
         </div>
      </div>
    </div>
  );
}

function NavSectionHeader({ label, isLocked }) {
  return (
    <div className="px-3 py-2 text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] flex items-center justify-between">
      {label}
      {isLocked && <Box size={10} />}
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to}
      className={({isActive}) => `w-full flex items-center gap-4 px-3 py-2.5 rounded-sm text-[13px] font-medium transition-all group ${
        isActive 
          ? 'bg-accent-green/10 text-accent-green border-r-2 border-accent-green pl-4' 
          : 'text-text-secondary hover:text-white hover:bg-white/5'
      }`}
    >
      <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function SubNavItem({ to, label }) {
  return (
    <NavLink 
      to={to}
      className={({isActive}) => `block w-full px-5 py-2 text-[12px] font-medium transition-all ${
        isActive 
          ? 'text-white translate-x-1 font-bold' 
          : 'text-text-muted hover:text-white hover:translate-x-1'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-1 h-1 rounded-full ${
          to.includes('pathfinding') ? 'bg-cyan-500' : 
          to.includes('trees') ? 'bg-purple-500' : 'bg-accent-green'
        } opacity-20`} />
        {label}
      </div>
    </NavLink>
  );
}

function FuturePlaceHolder({ label }) {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-text-muted italic cursor-not-allowed">
       <span className="w-1 h-1 bg-white/10 rounded-full" />
       {label}
    </div>
  );
}
