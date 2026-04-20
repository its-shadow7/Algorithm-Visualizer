import React, { useEffect, useState } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { getAlgorithms, loadAlgorithmData } from '../lib/AlgorithmLoader';
import useAlgorithmExecution from '../hooks/useAlgorithmExecution';
import VisualizerCanvas from '../components/VisualizerCanvas';
import SpeedController from '../components/SpeedController';
import DataInjector from '../components/DataInjector';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { SPEED_TIERS } from '../constants/speedTiers';
import { libraryData } from '../config/libraryData';

export default function Benchmark() {
  const [availableAlgos, setAvailableAlgos] = useState([]);
  const [selectedA, setSelectedA] = useState('');
  const [selectedB, setSelectedB] = useState('');
  const [winnerId, setWinnerId] = useState(null);

  const { 
    instances, 
    initInstance, 
    resetInstance, 
    startAll, 
    sharedDataset,
    playbackSpeed
  } = useAlgorithmStore();

  // DRIVE INDEPENDENT TICKERS FOR RACE INSTANCES
  useAlgorithmExecution('raceA');
  useAlgorithmExecution('raceB');

  // Track Winner
  useEffect(() => {
    if (!winnerId) {
      if (instances.raceA?.isFinished && !instances.raceB?.isFinished) {
        setWinnerId('raceA');
      } else if (instances.raceB?.isFinished && !instances.raceA?.isFinished) {
        setWinnerId('raceB');
      }
    }
  }, [instances.raceA?.isFinished, instances.raceB?.isFinished, winnerId]);

  useEffect(() => {
    setAvailableAlgos(getAlgorithms());
  }, []);

  const handleResetBoth = () => {
    resetInstance('raceA');
    resetInstance('raceB');
    setWinnerId(null);
  };

  const handleStartRace = () => {
    setWinnerId(null);
    startAll();
  };

  // Comparison Metrics for highlighting
  const bothFinished = instances.raceA?.isFinished && instances.raceB?.isFinished;
  const bestComparisons = bothFinished ? Math.min(instances.raceA?.snapshots?.[instances.raceA?.currentIndex]?.metrics?.comparisons || 0, instances.raceB?.snapshots?.[instances.raceB?.currentIndex]?.metrics?.comparisons || 0) : null;
  const bestSwaps = bothFinished ? Math.min(instances.raceA?.snapshots?.[instances.raceA?.currentIndex]?.metrics?.swaps || 0, instances.raceB?.snapshots?.[instances.raceB?.currentIndex]?.metrics?.swaps || 0) : null;

  // Load Instance A
  useEffect(() => {
    if (selectedA) {
      loadAlgorithmData(selectedA).then(data => {
        const gen = data.algorithmFn(sharedDataset);
        const snaps = [];
        let r = gen.next();
        while(!r.done) { snaps.push(r.value); r = gen.next(); }
        initInstance('raceA', { ...data, snapshots: snaps });
      });
    }
  }, [selectedA, sharedDataset, initInstance]);

  // Load Instance B
  useEffect(() => {
    if (selectedB) {
      loadAlgorithmData(selectedB).then(data => {
        const gen = data.algorithmFn(sharedDataset);
        const snaps = [];
        let r = gen.next();
        while(!r.done) { snaps.push(r.value); r = gen.next(); }
        initInstance('raceB', { ...data, snapshots: snaps });
      });
    }
  }, [selectedB, sharedDataset, initInstance]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#050505]">
      {/* Race Header */}
      <div className="h-14 border-b border-[#262626] bg-[#0c0c0c] flex items-center justify-between px-6 shrink-0 z-20 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-accent-green font-mono text-xs font-bold uppercase tracking-widest">
            <Zap size={14} /> Race Mode Active
          </div>
          <DataInjector />
          <div className="bg-white/5 border border-white/10 rounded-sm">
            <SpeedController />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleResetBoth}
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm border border-white/10 text-text-secondary hover:text-text-primary text-[10px] font-mono uppercase transition-colors"
          >
            <RotateCcw size={12} /> Reset Components
          </button>
          <button 
            onClick={handleStartRace}
            className="flex items-center gap-2 px-6 py-1.5 rounded-sm bg-accent-green text-black font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent-green-hover transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          >
            <Play size={12} fill="currentColor" /> Synchronize Start
          </button>
        </div>
      </div>

      {/* Split Pane Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Instance */}
        <div className={`flex-1 border-b border-[#262626] relative overflow-hidden flex flex-col transition-all duration-500 ${winnerId === 'raceA' ? 'ring-2 ring-accent-green/50 ring-inset z-10' : ''}`}>
          <RacePane 
            instance={instances.raceA} 
            available={availableAlgos}
            selected={selectedA}
            onSelect={setSelectedA}
            label="PROCESS_01"
            isWinner={winnerId === 'raceA'}
            bestMetrics={{ comparisons: bestComparisons, swaps: bestSwaps }}
          />
        </div>

        {/* Bottom Instance */}
        <div className={`flex-1 relative overflow-hidden flex flex-col transition-all duration-500 ${winnerId === 'raceB' ? 'ring-2 ring-accent-green/50 ring-inset z-10' : ''}`}>
          <RacePane 
            instance={instances.raceB} 
            available={availableAlgos}
            selected={selectedB}
            onSelect={setSelectedB}
            label="PROCESS_02"
            isWinner={winnerId === 'raceB'}
            bestMetrics={{ comparisons: bestComparisons, swaps: bestSwaps }}
          />
        </div>
      </div>
    </div>
  );
}

function RacePane({ instance, available, selected, onSelect, label, isWinner, bestMetrics }) {
  const { playbackSpeed } = useAlgorithmStore();
  const currentSnapshot = instance?.snapshots?.[instance?.currentIndex ?? 0];
  const metrics = currentSnapshot?.metrics;
  
  // Filter libraryData for Sorting category
  const sortingAlgos = libraryData.filter(algo => algo.category === 'Sorting');
  
  return (
    <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
      {/* Visualizer Side */}
      <div className="flex-1 relative bg-[#0a0a0a] border-r border-[#262626]">
        {isWinner && (
          <div className="absolute inset-0 bg-accent-green/5 animate-pulse-slow pointer-events-none z-0" />
        )}
        
        <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
          <span className="text-[9px] font-mono text-text-muted">{label}</span>
          <select 
            value={selected} 
            onChange={(e) => onSelect(e.target.value)}
            className="bg-[#121212] border border-white/10 rounded-sm px-2 py-1 text-[10px] font-mono text-accent-green focus:outline-none"
          >
            <option value="">SELECT_ALGORITHM</option>
            {sortingAlgos.map(a => <option key={a.id} value={a.id}>{a.title.toUpperCase()}</option>)}
          </select>
          {isWinner && (
            <div className="bg-accent-green text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm animate-bounce">🏆 SPEED WINNER</div>
          )}
        </div>

        {instance ? (
          <VisualizerCanvas snapshot={currentSnapshot} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted font-mono text-xs uppercase tracking-widest opacity-30">
            [ AWAITING_ALGORITHM_SELECTION ]
          </div>
        )}
      </div>

      {/* Metrics Side */}
      <div className="w-80 bg-[#0d0d0d] p-6 flex flex-col shrink-0">
        <div className="mb-4">
          <div className="text-[9px] font-mono text-text-muted uppercase tracking-[0.2em] mb-1">Status</div>
          <div className={`text-xs font-mono uppercase ${instance?.isFinished ? 'text-accent-green' : 'text-text-primary'}`}>
            {instance?.isFinished ? 'EXECUTION_COMPLETE' : instance?.isPlaying ? 'RUNNING_SYNC' : 'IDLE_AWAIT_SYNC'}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <Metric 
            label="Comparisons" 
            value={metrics?.comparisons || 0} 
            isBest={instance?.isFinished && metrics?.comparisons === bestMetrics.comparisons}
          />
          <Metric 
            label="Swaps" 
            value={metrics?.swaps || 0} 
            isBest={instance?.isFinished && metrics?.swaps === bestMetrics.swaps}
          />
          <Metric 
            label="Ops / Sec" 
            value={(() => {
              if (!instance?.isPlaying) return 0;
              const tier = SPEED_TIERS[playbackSpeed] || SPEED_TIERS["1x"];
              return Math.round((1000 / tier.interval) * tier.batch);
            })()} 
          />
        </div>

        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest mb-2">Step Progress</div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-accent-green h-full transition-all duration-300" 
              style={{ width: `${((instance?.currentIndex || 0) / (instance?.snapshots?.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, isBest }) {
  return (
    <div>
      <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-bold font-mono leading-none transition-colors ${isBest ? 'text-accent-green' : 'text-white'}`}>
        {value}
        {isBest && <span className="ml-2 text-[10px] tracking-tight text-accent-green/60">BEST</span>}
      </div>
    </div>
  );
}
