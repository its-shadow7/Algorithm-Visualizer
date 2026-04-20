import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Cpu } from 'lucide-react';

export default function AlgoCard({ algo }) {
  const isSorting = algo.category === 'Sorting';
  
  // Dynamic color assignments based on category
  const borderHoverColor = isSorting ? 'border-accent-green' : 'border-indigo-400';
  const textHoverColor = isSorting ? 'text-accent-green' : 'text-indigo-400';
  const categoryColor = isSorting ? 'text-emerald-400' : 'text-indigo-400';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full w-full bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-xl flex flex-col overflow-hidden transition-colors duration-300 group hover:bg-zinc-900/80"
    >
      {/* We apply the border transition on a child wrapper to avoid Framer Motion / Tailwind conflicts */}
      <Link 
        to={algo.href} 
        className={`flex flex-col h-full p-6 border border-transparent rounded-xl transition-colors duration-300 group-hover:${borderHoverColor}/50`}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-2 ${categoryColor}`}>
              {algo.category}
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{algo.title}</h3>
          </div>
          <div className="p-2 bg-black/40 rounded-lg border border-white/5 group-hover:bg-white/5 transition-colors">
            <Code2 size={16} className="text-text-muted group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">
          {algo.description}
        </p>

        {/* Metrics Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-black/40 border border-white/5 px-3 py-2 rounded-sm group-hover:border-white/10 transition-colors">
            <Cpu size={14} className="text-text-muted" />
            <div className="flex flex-col">
              <span className="text-[8px] text-text-muted uppercase tracking-[0.2em] font-mono">Time Complexty</span>
              <span className="text-[11px] font-mono font-bold text-white/90">{algo.timeComplexity}</span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 bg-black/40 border border-white/5 px-3 py-2 rounded-sm group-hover:border-white/10 transition-colors">
            <Cpu size={14} className="text-text-muted" />
            <div className="flex flex-col">
              <span className="text-[8px] text-text-muted uppercase tracking-[0.2em] font-mono">Space Complexty</span>
              <span className="text-[11px] font-mono font-bold text-white/90">{algo.spaceComplexity}</span>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
          <span className={`text-xs font-mono font-bold tracking-[0.2em] uppercase transition-colors text-text-muted group-hover:${textHoverColor}`}>
            Visualize Logic
          </span>
          <ArrowRight 
            size={16} 
            className={`transition-all duration-300 transform group-hover:translate-x-1 text-text-muted group-hover:${textHoverColor}`} 
          />
        </div>
      </Link>
    </motion.div>
  );
}
