import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { loadAlgorithmData } from '../lib/AlgorithmLoader';
import useAlgorithmExecution from '../hooks/useAlgorithmExecution';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PlaybackControls from '../components/PlaybackControls';
import SpeedController from '../components/SpeedController';
import DataInjector from '../components/DataInjector';

export default function Visualizer() {
  const { slug } = useParams();
  const editorRef = useRef(null);
  const decoRef = useRef([]);
  
  const { 
    instances, 
    initInstance, 
    resetInstance,
    sharedDataset 
  } = useAlgorithmStore();

  const instance = instances.main;

  // Drive execution for 'main' instance
  useAlgorithmExecution('main');

  // Initialize Algorithm
  useEffect(() => {
    async function init() {
      const data = await loadAlgorithmData(slug);
      const gen = data.algorithmFn(sharedDataset);
      const snaps = [];
      let result = gen.next();
      while (!result.done) {
        snaps.push(result.value);
        result = gen.next();
      }
      
      initInstance('main', { ...data, snapshots: snaps });
    }
    
    if (slug) init();
    
    // 'Ghost Execution' Cleanup: KILL generators when user leaves the page
    return () => {
      resetInstance('main');
    };
  }, [slug, initInstance, resetInstance, sharedDataset]);

  // Code Synchronization (Highlighting & Auto-Scroll)
  useEffect(() => {
    if (editorRef.current && instance) {
      const currentStep = instance.snapshots?.[instance.currentIndex];
      if (currentStep) {
        const line = currentStep.activeCodeLine;
        
        // Reveal Line
        editorRef.current.revealLineInCenter(line);
        
        // Update Decorations
        decoRef.current = editorRef.current.deltaDecorations(decoRef.current, [
          {
            range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1000 },
            options: {
              isWholeLine: true,
              className: 'bg-accent-green/20 border-l-2 border-accent-green',
              marginClassName: 'bg-accent-green/20'
            }
          }
        ]);
      }
    }
  }, [instance?.currentIndex, instance?.snapshots]);

  if (!instance?.activeAlgorithm) return (
    <div className="p-10 flex flex-col items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin mb-4" />
      <div className="text-text-muted font-mono text-sm tracking-widest uppercase">INITIALIZING_ALGO_V1_SYSTEM...</div>
    </div>
  );

  const currentSnapshot = instance.snapshots?.[instance?.currentIndex ?? 0];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Sub-Header / ToolBar */}
      <div className="h-12 border-b border-[#262626] bg-[#0c0c0c] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/5 rounded-sm">
            Dataset: <span className="text-accent-green">{sharedDataset.length} ITEMS</span>
          </div>
          <DataInjector />
        </div>
        
        <div className="flex items-center gap-4">
          <SpeedController />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Visualization Canvas (60%) */}
        <div className="flex-[0.6] border-r border-[#262626] relative bg-[#0a0a0a]">
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono text-text-secondary">
              ALGO: <span className="text-accent-green uppercase">{instance.activeAlgorithm.meta.name}</span>
            </div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono text-text-secondary">
              COMPLEXITY: <span className="text-accent-purple">{instance.activeAlgorithm.meta.complexity}</span>
            </div>
          </div>

          <VisualizerCanvas snapshot={currentSnapshot} />
          <PlaybackControls instanceId="main" />
        </div>

        {/* RIGHT: Code & Walkthrough (40%) */}
        <div className="flex-[0.4] flex flex-col bg-bg-nav">
          <div className="flex-[0.6] border-b border-[#262626] flex flex-col">
            <div className="h-10 border-b border-[#262626] px-4 flex items-center justify-between bg-white/[0.02]">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest font-bold">Implementation</span>
              <span className="text-[10px] font-mono text-accent-green opacity-50">javascript.js</span>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={instance.activeAlgorithm.code}
                onMount={(editor) => {
                  editorRef.current = editor;
                  editor.updateOptions({
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollBeyondLastLine: false,
                    backgroundColor: '#121212',
                    lineDecorationsWidth: 5
                  });
                }}
              />
            </div>
          </div>

          <div className="flex-[0.4] flex flex-col bg-[#0d0d0d] p-6 overflow-y-auto no-scrollbar">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] font-bold">Logic Walkthrough</h3>
              <div className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase bg-accent-green/10 text-accent-green`}>
                Snapshot active
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">
                {currentSnapshot?.description || "AWAITING_STEP_DATA"}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Analyzing array indices for comparison. The execution engine is currently monitoring memory operations and pointer movements.
              </p>
            </div>

            <div className="mt-6 flex gap-8 border-t border-white/5 pt-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-text-muted uppercase">Comparisons</span>
                <span className="text-xl font-bold font-mono text-white">{currentSnapshot?.metrics?.comparisons || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-text-muted uppercase">Swaps</span>
                <span className="text-xl font-bold font-mono text-accent-green">{currentSnapshot?.metrics?.swaps || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
