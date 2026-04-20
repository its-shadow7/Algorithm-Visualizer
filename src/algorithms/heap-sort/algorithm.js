export function* heapSort(array) {
  const arr = [...array];
  const n = arr.length;
  let metrics = { comparisons: 0, swaps: 0 };
  const sortedIndices = [];

  yield {
    step: 0,
    description: "INITIALIZING HEAP SORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], range: null, sortedIndices: [] },
    metrics: { ...metrics }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield {
      description: `BUILDING HEAP: HEAPIFYING INDEX ${i}`,
      activeCodeLine: 4,
      dataState: [...arr],
      pointers: { active: [i], sortedIndices: [] },
      metrics: { ...metrics }
    };
    yield* heapify(arr, n, i, metrics, sortedIndices);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    metrics.swaps++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    yield {
      description: "EXTRACTING MAX ELEMENT TO END",
      activeCodeLine: 11,
      dataState: [...arr],
      pointers: { active: [0, i], writing: [0, i], sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };

    // Index i is now locked in sorted position
    sortedIndices.push(i);
    
    yield {
      description: `LOCKED INDEX ${i}`,
      activeCodeLine: 14,
      dataState: [...arr],
      pointers: { sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };

    yield* heapify(arr, i, 0, metrics, sortedIndices);
  }

  // Last element is sorted
  sortedIndices.push(0);

  yield {
    description: "SORTING COMPLETE",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { 
      active: [], 
      sortedIndices: arr.map((_, i) => i) 
    },
    metrics: { ...metrics }
  };
}

function* heapify(arr, n, i, metrics, sortedIndices) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Visualizing children
  const children = [];
  if (left < n) children.push(left);
  if (right < n) children.push(right);

  yield {
    description: "HEAPIFYING: CHECKING CHILDREN",
    activeCodeLine: 18,
    dataState: [...arr],
    pointers: { active: [i], secondary: children, sortedIndices: [...sortedIndices] },
    metrics: { ...metrics }
  };

  if (left < n) {
    metrics.comparisons++;
    yield {
      description: "COMPARING PARENT WITH LEFT CHILD",
      activeCodeLine: 24,
      dataState: [...arr],
      pointers: { active: [largest], secondary: [left], sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };
    if (arr[left].value > arr[largest].value) {
      largest = left;
    }
  }

  if (right < n) {
    metrics.comparisons++;
    yield {
      description: "COMPARING WITH RIGHT CHILD",
      activeCodeLine: 29,
      dataState: [...arr],
      pointers: { active: [largest], secondary: [right], sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };
    if (arr[right].value > arr[largest].value) {
      largest = right;
    }
  }

  if (largest !== i) {
    metrics.swaps++;
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    yield {
      description: "HEAP PROPERTY VIOLATED: SWAPPING",
      activeCodeLine: 35,
      dataState: [...arr],
      pointers: { active: [i, largest], writing: [i, largest], sortedIndices: [...sortedIndices] },
      metrics: { ...metrics }
    };

    yield* heapify(arr, n, largest, metrics, sortedIndices);
  }
}
