import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AlgorithmCard({ algorithm }) {
  const navigate = useNavigate();
  const { name, complexity, category, description, tags, slug } = algorithm;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/visualizer/${slug}`)}
      className="bg-bg-card border border-[#262626] hover:border-accent-green/50 transition-colors p-6 rounded relative flex flex-col h-full cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="w-10 h-10 bg-[#0f0f0f] rounded flex items-center justify-center text-accent-green font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div className="px-2 py-1 rounded font-mono text-[9px] border bg-accent-green/10 text-accent-green border-accent-green/20">
          {complexity}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-green transition-colors">{name}</h3>
        <p className="text-text-secondary text-xs leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-text-muted">{category}</span>
      </div>
    </motion.div>
  );
}
