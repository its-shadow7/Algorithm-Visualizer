import React, { useEffect, useCallback } from 'react';
import { Database, Zap } from 'lucide-react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';

export default function DataInjector() {
  const { setSharedDataset, configSize, setConfigSize } = useAlgorithmStore();

  const handleSizeChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    if (val < 10) val = 10;
    if (val > 100) val = 100;
    setConfigSize(val);
  };

  const generateData = useCallback((type) => {
    let newData = [];
    const size = configSize;
    
    switch (type) {
      case 'sorted':
        newData = Array.from({ length: size }, (_, i) => Math.floor(((i + 1) / size) * 90) + 5);
        break;
      case 'reverse':
        newData = Array.from({ length: size }, (_, i) => Math.floor(((size - i) / size) * 90) + 5);
        break;
      case 'near':
        newData = Array.from({ length: size }, (_, i) => Math.floor(((i + 1) / size) * 90) + 5);
        for (let i = 0; i < Math.max(1, Math.floor(size / 6)); i++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          [newData[idx1], newData[idx2]] = [newData[idx2], newData[idx1]];
        }
        break;
      case 'duplicates':
        const vals = [20, 50, 80];
        newData = Array.from({ length: size }, () => vals[Math.floor(Math.random() * 3)]);
        break;
      case 'random':
        newData = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
        break;
      default:
        newData = [65, 34, 12, 89, 45, 23, 76, 10];
    }
    
    const dataset = newData.map((val, i) => ({
      id: `item-${Date.now()}-${i}-${Math.random().toString(36).substring(2,9)}`,
      value: val
    }));
    
    setSharedDataset(dataset);
  }, [configSize, setSharedDataset]);

  // Reactive Data Generation on Size Change
  useEffect(() => {
    const timer = setTimeout(() => {
      generateData('random');
    }, 300);

    return () => clearTimeout(timer);
  }, [configSize, generateData]);

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
      <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
        <label className="text-[8px] font-mono text-text-muted uppercase">Size N=</label>
        <input 
          type="number" 
          value={configSize}
          onChange={handleSizeChange}
          min="10" 
          max="100"
          className="bg-transparent border-none text-[10px] font-mono text-accent-green w-8 p-0 focus:outline-none"
        />
      </div>
      
      <div className="flex gap-2">
        <InjectorButton onClick={() => generateData('random')} label="RANDOM" />
        <InjectorButton onClick={() => generateData('reverse')} label="REVERSE" />
        <InjectorButton onClick={() => generateData('near')} label="NEARLY" />
        <InjectorButton onClick={() => generateData('duplicates')} label="DUPLICATES" />
      </div>
    </div>
  );
}

function InjectorButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="text-text-secondary hover:text-accent-green hover:bg-white/5 px-2 py-0.5 rounded-sm text-[9px] font-mono transition-colors tracking-tighter"
    >
      {label}
    </button>
  );
}
