import { create } from 'zustand';
import { bstSearch } from '../algorithms/bstGenerator';

export const useTreeStore = create((set, get) => ({
  treeRoot: null,
  snapshots: [],
  currentIndex: 0,
  isExecutionMode: false,
  isPlaying: false,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  generateRandomTree: () => {
    const minNodes = 31;
    const maxNodes = 40;
    const numNodes = Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;

    const values = new Set();
    while (values.size < numNodes) {
      values.add(Math.floor(Math.random() * 999) + 1);
    }
    
    const sortedValues = Array.from(values).sort((a, b) => a - b);
    let idCounter = 1;

    const buildBalanced = (arr, start, end) => {
      if (start > end) return null;
      const mid = Math.floor((start + end) / 2);
      const node = {
        id: `node-${idCounter++}`,
        value: arr[mid],
        left: buildBalanced(arr, start, mid - 1),
        right: buildBalanced(arr, mid + 1, end)
      };
      return node;
    };

    const root = buildBalanced(sortedValues, 0, sortedValues.length - 1);
    set({ treeRoot: root, snapshots: [], currentIndex: 0, isExecutionMode: false, isPlaying: false });
  },

  searchValue: (value) => {
    const { treeRoot } = get();
    if (!treeRoot) return;

    const generator = bstSearch(treeRoot, value);
    const snapshots = [];
    
    let result = generator.next();
    while (!result.done) {
      snapshots.push(result.value);
      result = generator.next();
    }

    set({ 
      snapshots, 
      currentIndex: 0, 
      isExecutionMode: true,
      isPlaying: true 
    });
  },

  nextStep: () => {
    const { currentIndex, snapshots } = get();
    if (currentIndex < snapshots.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  resetExecution: () => {
    set({ isExecutionMode: false, snapshots: [], currentIndex: 0, isPlaying: false });
  },

  clearTree: () => {
    set({ treeRoot: null, snapshots: [], currentIndex: 0, isExecutionMode: false, isPlaying: false });
  }
}));
