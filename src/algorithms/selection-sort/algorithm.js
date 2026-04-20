export function* selectionSort(array) {
  const arr = [...array];
  const n = arr.length;
  const sortedIndices = [];
  
  yield {
    step: 0,
    description: "INITIALIZING SELECTION SORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], pivot: null, sortedIndices: [...sortedIndices] },
    metrics: { comparisons: 0, swaps: 0 }
  };

  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield {
        description: `SEARCHING MINIMUM: COMPARING arr[${j}] AND arr[${minIdx}]`,
        activeCodeLine: 5,
        dataState: [...arr],
        pointers: { active: [j, minIdx], pivot: i, sortedIndices: [...sortedIndices] },
        metrics: { comparisons, swaps }
      };

      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;

        yield {
          description: `NEW MINIMUM FOUND AT INDEX ${j}`,
          activeCodeLine: 6,
          dataState: [...arr],
          pointers: { active: [j, minIdx], pivot: i, sortedIndices: [...sortedIndices] },
          metrics: { comparisons, swaps }
        };
      }
    }

    if (minIdx !== i) {
      swaps++;
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield {
        description: `SWAPPING MINIMUM arr[${minIdx}] WITH arr[${i}]`,
        activeCodeLine: 10,
        dataState: [...arr],
        pointers: { active: [i, minIdx], pivot: i, sortedIndices: [...sortedIndices] },
        metrics: { comparisons, swaps }
      };
    }
    
    sortedIndices.push(i);
  }

  yield {
    description: "SORTING COMPLETE",
    activeCodeLine: 15,
    dataState: [...arr],
    pointers: { active: [], pivot: null, sortedIndices: [...sortedIndices] },
    metrics: { comparisons, swaps }
  };
}
