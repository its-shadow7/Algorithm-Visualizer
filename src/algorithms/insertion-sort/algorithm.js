export function* insertionSort(dataset) {
  const arr = [...dataset];
  const n = arr.length;

  // 1. Initial State (Step 0)
  yield {
    dataState: [...arr],
    pointers: { active: [], writing: [], sortedIndices: [] },
    metrics: { comparisons: 0, swaps: 0 },
    description: "INITIALIZING_INSERTION_SORT",
    activeCodeLine: 1
  };

  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < n; i++) {
    let j = i;

    // Use Continuous Swap method to maintain unique IDs and avoid key collisions
    while (j > 0 && arr[j - 1].value > arr[j].value) {
      comparisons++;
      
      // The Swap Logic
      const temp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = temp;
      swaps++;

      // 2. Safe Yield (Inside while loop, after swap)
      yield {
        dataState: [...arr],
        pointers: { 
          active: [j - 1], 
          writing: [j],
          sortedIndices: Array.from({length: i + 1}, (_, k) => k).filter(idx => idx < j - 1 || idx > j)
        },
        metrics: { comparisons, swaps },
        description: `SWAPPING_${arr[j - 1].value}_AND_${arr[j].value}`,
        activeCodeLine: 8
      };

      j--;
    }
  }

  // 3. Final Sorted State
  yield {
    dataState: [...arr],
    pointers: { active: [], writing: [], sortedIndices: Array.from({length: n}, (_, k) => k) },
    metrics: { comparisons, swaps },
    description: "SORT_COMPLETE",
    activeCodeLine: 15
  };
}
