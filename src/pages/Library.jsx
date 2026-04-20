import React from 'react';
import { libraryData } from '../config/libraryData';
import AlgoCard from '../components/AlgoCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';

export default function Library() {
  const { searchQuery } = useUIStore();
  
  // Filter the library based on search query
  const filteredData = libraryData.filter(algo => 
    algo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    algo.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract unique categories efficiently from the FILTERED data so we don't render empty categories
  const categories = [...new Set(filteredData.map(a => a.category))];

  return (
    <div className="min-h-full w-full bg-[#050505] p-8 md:p-12 xl:p-16">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12 text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 leading-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              ALGORITHMS
            </span>
          </h1>
          <p className="text-sm font-mono text-text-secondary uppercase tracking-[0.2em] font-medium mx-auto md:mx-0">
            Select a module to initialize the visualizer.
          </p>
        </motion.div>
      </div>

      {/* Grid Layout Grouped by Category */}
      <div className="max-w-7xl mx-auto space-y-20">
        <AnimatePresence>
          {categories.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="text-center py-20"
             >
               <p className="text-slate-500 font-mono tracking-widest uppercase">No algorithms match your search.</p>
             </motion.div>
          )}
          {categories.map((category, catIndex) => (
            <motion.section 
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="mb-8 flex items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-white tracking-tight">{category}</h2>
                <div className="h-[1px] bg-gradient-to-r from-white/10 to-transparent flex-1" />
              </motion.div>
              
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                <AnimatePresence>
                  {filteredData.filter(algo => algo.category === category).map((algo, index) => (
                    <motion.div 
                      key={algo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlgoCard algo={algo} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
