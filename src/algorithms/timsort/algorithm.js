export function* timsort(array) {
  const arr = [...array];
  const n = arr.length;
  const RUN = 16;
  const sortedIndices = [];

  let comparisons = 0;
  let swaps = 0;

  yield {
    description: "INITIALIZING TIMSORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], sortedIndices: [] },
    metrics: { comparisons: 0, swaps: 0 }
  };

  // 1. Insertion Sort on Runs
  for (let i = 0; i < n; i += RUN) {
    const end = Math.min(i + RUN - 1, n - 1);
    
    for (let j = i + 1; j <= end; j++) {
      const currentItem = arr[j];
      let k = j - 1;
      
      while (k >= i) {
        comparisons++;
        yield {
          description: `INSERTION SORT ON RUN: COMPARING arr[${k}] AND arr[${k+1}]`,
          activeCodeLine: 8,
          dataState: [...arr],
          pointers: { active: [k, k + 1], range: [i, end] },
          metrics: { comparisons, swaps }
        };

        if (arr[k].value > currentItem.value) {
          // Swap to maintain reference safety
          [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]];
          swaps++;
          k--;
        } else {
          break;
        }
      }
    }
  }

  // 2. Iterative Merge Phase
  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);

      if (mid < right) {
        // Safe Merge Implementation
        const leftSide = arr.slice(left, mid + 1);
        const rightSide = arr.slice(mid + 1, right + 1);
        
        // Final sorted order of this specific segment
        const sortedSegment = [];
        let i = 0, j = 0;
        while (i < leftSide.length && j < rightSide.length) {
          comparisons++;
          if (leftSide[i].value <= rightSide[j].value) {
            sortedSegment.push(leftSide[i++]);
          } else {
            sortedSegment.push(rightSide[j++]);
          }
        }
        while (i < leftSide.length) sortedSegment.push(leftSide[i++]);
        while (j < rightSide.length) sortedSegment.push(rightSide[j++]);

        // "Sync" the main array with the sortedSegment references using safe swaps
        for (let k = 0; k < sortedSegment.length; k++) {
          const targetItem = sortedSegment[k];
          const actualIndex = left + k;
          const currentPosOfItem = arr.indexOf(targetItem);

          if (currentPosOfItem !== actualIndex) {
            [arr[actualIndex], arr[currentPosOfItem]] = [arr[currentPosOfItem], arr[actualIndex]];
            swaps++;
          }

          yield {
            description: `MERGING RUNS: SYNCING POSITION ${actualIndex}`,
            activeCodeLine: 20,
            dataState: [...arr],
            pointers: { active: [actualIndex], range: [left, right] },
            metrics: { comparisons, swaps }
          };
        }
      }
    }
  }

  yield {
    description: "TIMSORT COMPLETE",
    activeCodeLine: 35,
    dataState: [...arr],
    pointers: { active: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    metrics: { comparisons, swaps }
  };
}
