import React, { useState, useEffect, useRef } from 'react';
import TreeCanvas from '../components/TreeCanvas';
import { useTreeStore } from '../store/useTreeStore';
import { Search, SkipForward, RotateCcw, Play, Pause, Dices, Code2, Terminal } from 'lucide-react';
import Editor from '@monaco-editor/react';

const bstSearchCode = `function search(node, target) {
  if (node === null) {
    return null; // Not found
  }

  if (target === node.value) {
    return node; // Found!
  } else if (target < node.value) {
    return search(node.left, target); // Search left
  } else {
    return search(node.right, target); // Search right
  }
}`;

export default function TreeVisualizer() {
  const [inputValue, setInputValue] = useState('');
  const editorRef = useRef(null);
  const decoRef = useRef([]);
  
  const { 
    treeRoot,
    searchValue, 
    nextStep, 
    isExecutionMode, 
    resetExecution, 
    snapshots,
    currentIndex,
    isPlaying,
    togglePlay,
    generateRandomTree
  } = useTreeStore();

  const currentSnapshot = isExecutionMode ? snapshots[currentIndex] : null;

  // On Mount: Auto generate balanced master tree
  useEffect(() => {
    if (!treeRoot) {
      generateRandomTree();
    }
  }, [treeRoot, generateRandomTree]);

  // Editor Decoration Hook
  useEffect(() => {
    if (editorRef.current) {
      if (currentSnapshot?.activeLine) {
        decoRef.current = editorRef.current.deltaDecorations(
          decoRef.current,
          [{
            range: { 
              startLineNumber: currentSnapshot.activeLine, 
              startColumn: 1, 
              endLineNumber: currentSnapshot.activeLine, 
              endColumn: 1 
            },
            options: {
              isWholeLine: true,
              className: 'bg-accent-green/20 border-l-4 border-accent-green',
            }
          }]
        );
      } else {
        decoRef.current = editorRef.current.deltaDecorations(decoRef.current, []);
      }
    }
  }, [currentSnapshot]);

  // Auto-Play Engine Hook
  useEffect(() => {
    let interval;
    if (isPlaying && isExecutionMode) {
      interval = setInterval(() => {
        nextStep();
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isExecutionMode, nextStep]);

  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    searchValue(val);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#050505]">
      {/* 3-Column HUD Toolbar */}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-900/50 border-b border-slate-800 shrink-0 z-20 shadow-xl overflow-hidden whitespace-nowrap flex-nowrap">
        
        {/* Left: Module Title */}
        <div className="flex items-center min-w-[150px]">
          <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/20">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-accent-green uppercase tracking-[0.2em]">BST Engine</span>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-4 bg-white/5 px-4 py-1 rounded-sm border border-white/5 transition-opacity ${isExecutionMode ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
             <button onClick={resetExecution} disabled={currentIndex === 0 && !isPlaying} className="text-text-secondary hover:text-white disabled:opacity-20" title="Reset Traversal">
               <RotateCcw size={14} className="scale-x-[-1]" />
             </button>
             <button onClick={togglePlay} className="w-8 h-8 bg-accent-green text-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:bg-accent-green-hover transition-colors">
               {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
             </button>
             <button onClick={nextStep} disabled={currentIndex === snapshots.length -1} className="text-text-secondary hover:text-white disabled:opacity-20" title="Next Step">
               <SkipForward size={14} fill="currentColor" />
             </button>
             <div className="text-[10px] font-mono text-accent-green min-w-[60px] text-right">
               {isExecutionMode ? `${currentIndex + 1} / ${snapshots.length}` : '0 / 0'}
             </div>
          </div>
        </div>

        {/* Right: Spacer */}
        <div className="flex items-center w-[150px]"></div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Canvas */}
        <div className="flex-[0.7] relative border-r border-[#262626]">
          <TreeCanvas />
          
          {/* Floating Command Dock */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-2xl z-40">
            <div className="flex items-center gap-2">
              <input 
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isExecutionMode}
                placeholder="Value"
                className="bg-black/60 border border-white/10 rounded-md px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-accent-green/50 transition-colors w-24 uppercase"
              />
              <button 
                onClick={handleSearch}
                disabled={isExecutionMode || !inputValue}
                className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-accent-green text-black font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent-green-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(74,222,128,0.2)]"
              >
                <Search size={12} strokeWidth={3} /> Search
              </button>
            </div>

            <div className="h-6 w-[1px] bg-white/10 mx-2" />

            <button 
              onClick={generateRandomTree}
              disabled={isExecutionMode}
              title="Generate New Massive Tree"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/50 text-[10px] font-mono uppercase transition-all disabled:opacity-10"
            >
              <Dices size={12} /> Regenerate
            </button>
          </div>
        </div>

        {/* RIGHT: Code Pane */}
        <div className="flex-[0.3] flex flex-col bg-bg-nav">
          <div className="flex-[0.6] border-b border-[#262626] flex flex-col">
            <div className="h-10 border-b border-[#262626] px-4 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-accent-green" />
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest font-bold">Standard Search</span>
              </div>
              <span className="text-[10px] font-mono text-accent-green opacity-50">bst.js</span>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={bstSearchCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono',
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  scrollBeyondLastLine: false,
                  backgroundColor: '#121212'
                }}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </div>
          </div>

          <div className="flex-[0.4] flex flex-col bg-[#0d0d0d] p-6 overflow-y-auto no-scrollbar">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Terminal size={14} className="text-text-muted" />
                 <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] font-bold">Traversal Status</h3>
              </div>
              {isExecutionMode && (
                <div className="px-2 py-0.5 rounded-full text-[8px] font-mono uppercase bg-accent-green/10 text-accent-green border border-accent-green/20">
                  Step {currentIndex + 1}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">
                {currentSnapshot?.type || (isExecutionMode ? 'INITIALIZING...' : 'IDLE')}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                {currentSnapshot?.description || 'Awaiting search command. Type a number. (Hint: Try a root or deep leaf node).'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
