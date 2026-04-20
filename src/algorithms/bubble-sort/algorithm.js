export function* bubbleSort(array) {
  const arr = [...array];
  const n = arr.length;
  const sortedIndices = [];
  
  yield {
    step: 0,
    description: "INITIALIZING BUBBLE SORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], sortedIndices: [...sortedIndices] },
    metrics: { comparisons: 0, swaps: 0 }
  };

  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n; i++) {
    let swappedThisRound = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      
      yield {
        description: `COMPARING arr[${j}] AND arr[${j+1}]`,
        activeCodeLine: 5,
        dataState: [...arr],
        pointers: { active: [j, j + 1], sortedIndices: [...sortedIndices] },
        metrics: { comparisons, swaps }
      };

      if (arr[j].value > arr[j + 1].value) {
        swaps++;
        swappedThisRound = true;

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        yield {
          description: `SWAPPING arr[${j}] AND arr[${j+1}]`,
          activeCodeLine: 7,
          dataState: [...arr],
          pointers: { active: [j, j + 1], sortedIndices: [...sortedIndices] },
          metrics: { comparisons, swaps }
        };
      }
    }

    // Element bubbling to the top resolves its final position
    sortedIndices.push(n - i - 1);
    
    if (!swappedThisRound) {
      // If no swaps occurred, the array is fully sorted
      for (let k = 0; k < n - i - 1; k++) sortedIndices.push(k);
      break;
    }
  }

  yield {
    description: "SORTING COMPLETE",
    activeCodeLine: 13,
    dataState: [...arr],
    pointers: { active: [], sortedIndices: [...sortedIndices] },
    metrics: { comparisons, swaps }
  };
}
