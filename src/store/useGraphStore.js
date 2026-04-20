import { create } from 'zustand';
import { calculateBFSSync } from '../algorithms/pathfinding/bfs';
import { calculateAStarSync } from '../algorithms/pathfinding/astar';
import { calculateDijkstraSync } from '../algorithms/pathfinding/dijkstra';
import { loadAlgorithmData } from '../lib/AlgorithmLoader';
import { recursiveBacktracker } from '../algorithms/pathfinding/mazeGenerator';

const ROWS = 23;
const COLS = 55;

const getInitialGrid = () => {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const currentRow = [];
    for (let c = 0; c < COLS; c++) {
      currentRow.push({
        row: r,
        col: c,
        type: (r === Math.floor(ROWS/2) && c === Math.floor(COLS/4)) ? 'START' : (r === Math.floor(ROWS/2) && c === Math.floor(COLS*0.75)) ? 'TARGET' : 'EMPTY',
        isVisited: false,
        isPath: false,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

export const useGraphStore = create((set, get) => ({
  grid: getInitialGrid(),
  startNode: { row: Math.floor(ROWS/2), col: Math.floor(COLS/4) },
  targetNode: { row: Math.floor(ROWS/2), col: Math.floor(COLS*0.75) },
  isMouseDown: false,
  draggedNodeType: null, 
  currentAlgorithmId: 'bfs', // Current active algorithm ID
  
  // Execution Mode State
  isExecutionMode: false,
  isPlaying: false,
  snapshots: [],
  currentIndex: 0,
  activeAlgorithm: null,
  isFinished: false,
  drawingMode: 'WALL', // 'WALL' | 'WEIGHT'
  lastCalculationHash: '',

  setAlgorithm: (id) => {
    if (get().currentAlgorithmId === id) return; // Prevent duplicate resets
    set({ currentAlgorithmId: id });
    get().recalculatePath();
  },

  setDrawingMode: (mode) => set({ drawingMode: mode }),

  setMouseDown: (isDown) => set({ isMouseDown: isDown }),
  
  onMouseDownNode: (row, col) => {
    const { grid, isExecutionMode } = get();
    if (isExecutionMode) return;
    
    const node = grid[row][col];
    
    if (node.type === 'START') {
      set({ isMouseDown: true, draggedNodeType: 'START' });
    } else if (node.type === 'TARGET') {
      set({ isMouseDown: true, draggedNodeType: 'TARGET' });
    } else {
      const { drawingMode } = get();
      const newType = node.type === drawingMode ? 'EMPTY' : drawingMode;
      set({ isMouseDown: true, draggedNodeType: newType });
      get().toggleNode(row, col, newType);
    }
  },

  onMouseMoveNode: (row, col) => {
    const { isMouseDown, draggedNodeType, grid, startNode, targetNode, isExecutionMode } = get();
    if (!isMouseDown || !draggedNodeType || isExecutionMode) return;

    if (draggedNodeType === 'START') {
      if (grid[row][col].type === 'WALL' || (row === targetNode.row && col === targetNode.col)) return;
      if (row === startNode.row && col === startNode.col) return;
      
      set((state) => {
        const newGrid = state.grid.slice();
        newGrid[startNode.row] = newGrid[startNode.row].slice();
        newGrid[startNode.row][startNode.col] = { ...newGrid[startNode.row][startNode.col], type: 'EMPTY' };
        
        newGrid[row] = newGrid[row].slice();
        newGrid[row][col] = { ...newGrid[row][col], type: 'START' };
        
        return { grid: newGrid, startNode: { row, col } };
      });
      get().recalculatePath();
    } else if (draggedNodeType === 'TARGET') {
      if (grid[row][col].type === 'WALL' || (row === startNode.row && col === startNode.col)) return;
      if (row === targetNode.row && col === targetNode.col) return;
      
      set((state) => {
        const newGrid = state.grid.slice();
        newGrid[targetNode.row] = newGrid[targetNode.row].slice();
        newGrid[targetNode.row][targetNode.col] = { ...newGrid[targetNode.row][targetNode.col], type: 'EMPTY' };
        
        newGrid[row] = newGrid[row].slice();
        newGrid[row][col] = { ...newGrid[row][col], type: 'TARGET' };
        
        return { grid: newGrid, targetNode: { row, col } };
      });
      get().recalculatePath();
    } else if (draggedNodeType === 'WALL' || draggedNodeType === 'EMPTY' || draggedNodeType === 'WEIGHT') {
      get().toggleNode(row, col, draggedNodeType);
    }
  },

  onMouseUp: () => {
    set({ isMouseDown: false, draggedNodeType: null });
  },

  toggleNode: (row, col, type) => {
    const { startNode, targetNode, isExecutionMode } = get();
    if (isExecutionMode) return;
    if ((row === startNode.row && col === startNode.col) || (row === targetNode.row && col === targetNode.col)) return;

    set((state) => {
      const newGrid = state.grid.slice();
      newGrid[row] = newGrid[row].slice();
      newGrid[row][col] = { ...newGrid[row][col], type };
      return { grid: newGrid };
    });
    get().recalculatePath();
  },

  recalculatePath: () => {
    const { grid, startNode, targetNode, currentAlgorithmId, lastCalculationHash } = get();
    
    // 1. The 'Recalculate' Debounce hook
    // Hash grid state that impacts pathfinding calculations
    let gridHash = '';
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const type = grid[r][c].type;
        if (type === 'WALL' || type === 'WEIGHT') {
          gridHash += `${r},${c},${type}|`;
        }
      }
    }
    const currentHash = `${currentAlgorithmId}|S${startNode.row},${startNode.col}|T${targetNode.row},${targetNode.col}|${gridHash}`;

    if (currentHash === lastCalculationHash) return;

    // 2. Immutable Grid Updates
    const newGrid = grid.map(row => [...row]); // Only clone rows
    
    // Clear existing visualization nodes
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[r].length; c++) {
        const node = newGrid[r][c];
        if (node.isVisited || node.isPath) {
          newGrid[r][c] = { ...node, isVisited: false, isPath: false };
        }
      }
    }

    // 3. Select Algorithm Sync
    let engine = calculateBFSSync;
    if (currentAlgorithmId === 'a-star') engine = calculateAStarSync;
    if (currentAlgorithmId === 'dijkstra') engine = calculateDijkstraSync;

    const { visitedNodesInOrder, shortestPath } = engine(newGrid, startNode, targetNode);

    // 4. Re-apply the new 'VISITED' and 'PATH'
    for (const node of visitedNodesInOrder) {
      if (!(node.row === startNode.row && node.col === startNode.col) &&
          !(node.row === targetNode.row && node.col === targetNode.col)) {
        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isVisited: true };
      }
    }

    for (const node of shortestPath) {
      if (!(node.row === startNode.row && node.col === startNode.col) &&
          !(node.row === targetNode.row && node.col === targetNode.col)) {
        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isPath: true };
      }
    }

    set({ grid: newGrid, lastCalculationHash: currentHash });
  },

  resetBoard: () => {
    const { startNode, targetNode } = get();
    const newGrid = getInitialGrid();
    
    // Ensure Start and Target are exactly where they should be
    // Using default or last known position (here we use last known to avoid user frustration)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === startNode.row && c === startNode.col) {
          newGrid[r][c].type = 'START';
        } else if (r === targetNode.row && c === targetNode.col) {
          newGrid[r][c].type = 'TARGET';
        } else {
          newGrid[r][c].type = 'EMPTY';
        }
        newGrid[r][c].isVisited = false;
        newGrid[r][c].isPath = false;
      }
    }

    set({ 
      grid: newGrid, 
      lastCalculationHash: '', 
      snapshots: [], 
      currentIndex: 0, 
      isExecutionMode: false,
      isPlaying: false 
    });
  },

  generateMaze: () => {
    const { grid, startNode, targetNode } = get();
    // Reset execution and clear path
    get().resetExecution();
    
    const gen = recursiveBacktracker(grid, startNode, targetNode);
    const snaps = [];
    let result = gen.next();
    while (!result.done) {
      snaps.push(result.value);
      result = gen.next();
    }

    set({
      snapshots: snaps,
      currentIndex: 0,
      isExecutionMode: true,
      isPlaying: true,
      activeAlgorithm: { id: 'maze-gen', title: 'Recursive Backtracker' }
    });
  },

  // --- Execution Actions ---

  startExecution: async () => {
    const { grid, startNode, targetNode, currentAlgorithmId } = get();
    
    // Clear any previous visualization nodes
    get().recalculatePath();

    try {
      const data = await loadAlgorithmData(currentAlgorithmId);
      const gen = data.algorithmFn(grid, startNode, targetNode);
      const snaps = [];
      let result = gen.next();
      while (!result.done) {
        snaps.push(result.value);
        result = gen.next();
      }

      set({
        activeAlgorithm: data,
        snapshots: snaps,
        currentIndex: 0,
        isExecutionMode: true,
        isPlaying: true, // Auto-start
        isFinished: false
      });
    } catch (e) {
      console.error("Execution failed", e);
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  nextStep: (batch = 1) => {
    const { snapshots, currentIndex, activeAlgorithm, currentAlgorithmId } = get();
    const nextIdx = Math.min(currentIndex + batch, snapshots.length - 1);
    const isAtEnd = nextIdx >= snapshots.length - 1;

    if (isAtEnd) {
      // Automatic Transition for Maze Generation
      if (activeAlgorithm?.id === 'maze-gen') {
        const finalGrid = snapshots[snapshots.length - 1].grid;
        set({ 
          grid: finalGrid, 
          isExecutionMode: false, 
          isPlaying: false, 
          snapshots: [],
          currentIndex: 0,
          activeCodeLine: null,
          isFinished: false // Reset finished state
        });

        // Re-sync algorithm state with current URL parameter (BFS or A*)
        loadAlgorithmData(currentAlgorithmId).then(data => {
          set({ activeAlgorithm: data });
        }).catch(err => {
          console.error("Failed to re-sync algorithm data", err);
          set({ activeAlgorithm: null });
        });
      } else {
        set({ currentIndex: nextIdx, isPlaying: false, isFinished: true });
      }
    } else {
      set({ currentIndex: nextIdx, isFinished: false });
    }
  },

  prevStep: () => {
    const { currentIndex } = get();
    if (currentIndex <= 0) return;
    set({ currentIndex: currentIndex - 1, isFinished: false });
  },

  resetExecution: () => {
    set({
      isExecutionMode: false,
      isPlaying: false,
      snapshots: [],
      currentIndex: 0,
      activeAlgorithm: null,
      isFinished: false
    });
    // Restore grid path
    get().recalculatePath();
  }

}));
