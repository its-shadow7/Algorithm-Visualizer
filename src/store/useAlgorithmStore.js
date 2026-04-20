import { create } from 'zustand';

export const useAlgorithmStore = create((set, get) => ({
  // Global Settings
  playbackSpeed: '25x', 
  configSize: 12, // Default array size
  sharedDataset: [65, 34, 12, 89, 45, 23, 76, 10].map((v, i) => ({ id: `init-${i}`, value: v })),
  
  // instances: { [id]: { activeAlgorithm, snapshots, currentIndex, isPlaying, isFinished } }
  instances: {
    main: {
      activeAlgorithm: null,
      snapshots: [],
      currentIndex: 0,
      isPlaying: false,
      isFinished: false,
    },
  },

  // Actions
  setGlobalSpeed: (speed) => set({ playbackSpeed: speed }),
  
  setConfigSize: (size) => set({ configSize: size }),

  setSharedDataset: (data) => set({ 
    sharedDataset: data,
    // Reset all instances when data changes
    instances: Object.keys(get().instances).reduce((acc, id) => {
      acc[id] = { ...get().instances[id], currentIndex: 0, isPlaying: false, isFinished: false };
      return acc;
    }, {})
  }),

  initInstance: (id, algorithmData) => {
    set((state) => ({
      instances: {
        ...state.instances,
        [id]: {
          activeAlgorithm: algorithmData,
          snapshots: algorithmData.snapshots || [],
          currentIndex: 0,
          isPlaying: false,
          isFinished: false,
          metrics: { comparisons: 0, swaps: 0 }
        }
      }
    }));
  },

  nextStep: (id, batch = 1) => {
    const instance = get().instances[id];
    if (!instance || instance.isFinished) return;
    
    if (instance.currentIndex < instance.snapshots.length - 1) {
      const nextIdx = Math.min(instance.currentIndex + batch, instance.snapshots.length - 1);
      const isFinished = nextIdx === instance.snapshots.length - 1;

      set((state) => ({
        instances: {
          ...state.instances,
          [id]: { 
            ...instance, 
            currentIndex: nextIdx,
            isFinished,
            isPlaying: isFinished ? false : instance.isPlaying
          }
        }
      }));
    }
  },

  prevStep: (id) => {
    const instance = get().instances[id];
    if (!instance || instance.currentIndex === 0) return;
    
    set((state) => ({
      instances: {
        ...state.instances,
        [id]: { ...instance, currentIndex: instance.currentIndex - 1, isFinished: false }
      }
    }));
  },

  togglePlay: (id) => {
    const instance = get().instances[id];
    if (!instance) return;
    
    set((state) => ({
      instances: {
        ...state.instances,
        [id]: { ...instance, isPlaying: !instance.isPlaying }
      }
    }));
  },

  resetInstance: (id) => {
    const instance = get().instances[id];
    if (!instance) return;
    
    set((state) => ({
      instances: {
        ...state.instances,
        [id]: { ...instance, currentIndex: 0, isPlaying: false, isFinished: false }
      }
    }));
  },

  startAll: () => {
    set((state) => {
      const nextInstances = { ...state.instances };
      Object.keys(nextInstances).forEach(id => {
        nextInstances[id] = { ...nextInstances[id], isPlaying: true, isFinished: false };
      });
      return { instances: nextInstances };
    });
  }
}));
