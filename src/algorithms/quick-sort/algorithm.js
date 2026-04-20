export function* quickSort(array) {
  const arr = [...array];
  const n = arr.length;
  let metrics = { comparisons: 0, swaps: 0 };
  const sortedIndices = [];

  yield {
    step: 0,
    description: "INITIALIZING QUICK SORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], range: null, sortedIndices: [] },
    metrics: { ...metrics }
  };

  yield* sort(arr, 0, n - 1, metrics, sortedIndices);

  yield {
    description: "SORTING COMPLETE",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { 
      active: [], 
      range: null, 
      pivot: null,
      sortedIndices: arr.map((_, i) => i) 
    },
    metrics: { ...metrics }
  };
}

function* sort(arr, low, high, metrics, sortedIndices) {
  if (low < high) {
    yield {
      description: `PARTITIONING SUB-ARRAY: [${low}...${high}]`,
      activeCodeLine: 2,
      dataState: [...arr],
      pointers: { range: [low, high], sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };

    const pIdx = yield* partition(arr, low, high, metrics, sortedIndices);
    
    // The pivot at pIdx is now permanently sorted
    sortedIndices.push(pIdx);
    yield {
      description: `PIVOT LOCKED AT INDEX ${pIdx}`,
      activeCodeLine: 3,
      dataState: [...arr],
      pointers: { range: [low, high], sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };

    yield { description: "RECURSIVE CALL: LEFT SUB-ARRAY", activeCodeLine: 4, dataState: [...arr], pointers: { range: [low, high], sortedIndices: [...sortedIndices] }, metrics: { ...metrics } };
    yield* sort(arr, low, pIdx - 1, metrics, sortedIndices);

    yield { description: "RECURSIVE CALL: RIGHT SUB-ARRAY", activeCodeLine: 5, dataState: [...arr], pointers: { range: [low, high], sortedIndices: [...sortedIndices] }, metrics: { ...metrics } };
    yield* sort(arr, pIdx + 1, high, metrics, sortedIndices);
  } else if (low === high) {
    // Single element is also sorted
    if (!sortedIndices.includes(low)) sortedIndices.push(low);
  }
}

function* partition(arr, low, high, metrics, sortedIndices) {
  const pivot = arr[high];
  
  yield {
    description: `SELECTED PIVOT: ${pivot.value} (Index ${high})`,
    activeCodeLine: 10,
    dataState: [...arr],
    pointers: { range: [low, high], pivot: high, sortedIndices: [...sortedIndices] },
    metrics: { ...metrics }
  };

  let i = low - 1;

  for (let j = low; j < high; j++) {
    metrics.comparisons++;
    
    yield {
      description: `COMPARING arr[${j}] WITH PIVOT`,
      activeCodeLine: 14,
      dataState: [...arr],
      pointers: { range: [low, high], active: [j], pivot: high, sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };

    if (arr[j].value < pivot.value) {
      i++;
      if (i !== j) {
        metrics.swaps++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield {
          description: `SWAPPING arr[${i}] AND arr[${j}]`,
          activeCodeLine: 16,
          dataState: [...arr],
          pointers: { range: [low, high], active: [j], writing: [i, j], pivot: high, sortedIndices: [...sortedIndices] },
          metrics: { ...metrics }
        };
      }
    }
  }

  metrics.swaps++;
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  yield {
    description: "PLACING PIVOT IN FINAL POSITION",
    activeCodeLine: 20,
    dataState: [...arr],
    pointers: { range: [low, high], active: [high], writing: [i + 1, high], pivot: i + 1, sortedIndices: [...sortedIndices] },
    metrics: { ...metrics }
  };

  return i + 1;
}
