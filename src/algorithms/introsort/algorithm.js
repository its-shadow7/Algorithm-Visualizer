export function* introSort(array) {
  const arr = [...array];
  const n = arr.length;
  const depthLimit = 2 * Math.floor(Math.log2(n));
  let comparisons = 0;
  let swaps = 0;

  yield {
    description: "INITIALIZING INTROSORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], pivot: null, sortedIndices: [] },
    metrics: { comparisons: 0, swaps: 0 }
  };

  yield* introsortLoop(0, n - 1, depthLimit);

  function* introsortLoop(low, high, depth) {
    const size = high - low + 1;

    // 1. Base Case: Insertion Sort for small segments
    if (size < 16) {
      yield* insertionSort(low, high);
      return;
    }

    // 2. Base Case: Heapsort for depth limit reached
    if (depth === 0) {
      yield* heapsort(low, high);
      return;
    }

    // 3. Quicksort Phase
    const pIdx = yield* partition(low, high);
    yield* introsortLoop(low, pIdx, depth - 1);
    yield* introsortLoop(pIdx + 1, high, depth - 1);
  }

  function* partition(low, high) {
    const pivotVal = arr[Math.floor((low + high) / 2)].value;
    let i = low - 1;
    let j = high + 1;

    while (true) {
      do {
        i++;
        comparisons++;
        yield {
          description: "QUICKSORT: SCANNING FROM LEFT",
          activeCodeLine: 10,
          dataState: [...arr],
          pointers: { active: [i], range: [low, high] },
          metrics: { comparisons, swaps }
        };
      } while (arr[i].value < pivotVal);

      do {
        j--;
        comparisons++;
        yield {
          description: "QUICKSORT: SCANNING FROM RIGHT",
          activeCodeLine: 12,
          dataState: [...arr],
          pointers: { active: [j], range: [low, high] },
          metrics: { comparisons, swaps }
        };
      } while (arr[j].value > pivotVal);

      if (i >= j) return j;

      swaps++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield {
        description: `QUICKSORT: SWAPPING arr[${i}] AND arr[${j}]`,
        activeCodeLine: 15,
        dataState: [...arr],
        pointers: { active: [i, j], range: [low, high] },
        metrics: { comparisons, swaps }
      };
    }
  }

  function* insertionSort(low, high) {
    for (let i = low + 1; i <= high; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= low) {
        comparisons++;
        yield {
          description: `SMALL CHUNK: INSERTION SORT SCAN [low=${low}, high=${high}]`,
          activeCodeLine: 20,
          dataState: [...arr],
          pointers: { active: [j, j + 1], range: [low, high] },
          metrics: { comparisons, swaps }
        };

        if (arr[j].value > key.value) {
          swaps++;
          [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
          j--;
        } else {
          break;
        }
      }
    }
  }

  function* heapsort(low, high) {
    const n = high - low + 1;

    // Build Max Heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield* heapify(low, n, i);
    }

    // Extraction
    for (let i = n - 1; i > 0; i--) {
      swaps++;
      [arr[low], arr[low + i]] = [arr[low + i], arr[low]];
      yield {
        description: "LIMIT REACHED: HEAPSORT EXTRACTION",
        activeCodeLine: 25,
        dataState: [...arr],
        pointers: { active: [low, low + i], range: [low, high] },
        metrics: { comparisons, swaps }
      };
      yield* heapify(low, i, 0);
    }
  }

  function* heapify(offset, n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      comparisons++;
      if (arr[offset + l].value > arr[offset + largest].value) largest = l;
      yield {
        description: "LIMIT REACHED: HEAPSORT HEAPIFY (LEFT CHILD)",
        activeCodeLine: 30,
        dataState: [...arr],
        pointers: { active: [offset + l, offset + largest], range: [offset, offset + n - 1] },
        metrics: { comparisons, swaps }
      };
    }

    if (r < n) {
      comparisons++;
      if (arr[offset + r].value > arr[offset + largest].value) largest = r;
      yield {
        description: "LIMIT REACHED: HEAPSORT HEAPIFY (RIGHT CHILD)",
        activeCodeLine: 32,
        dataState: [...arr],
        pointers: { active: [offset + r, offset + largest], range: [offset, offset + n - 1] },
        metrics: { comparisons, swaps }
      };
    }

    if (largest !== i) {
      swaps++;
      [arr[offset + i], arr[offset + largest]] = [arr[offset + largest], arr[offset + i]];
      yield {
        description: "LIMIT REACHED: HEAPSORT SWAP",
        activeCodeLine: 35,
        dataState: [...arr],
        pointers: { active: [offset + i, offset + largest], range: [offset, offset + n - 1] },
        metrics: { comparisons, swaps }
      };
      yield* heapify(offset, n, largest);
    }
  }

  yield {
    description: "INTROSORT COMPLETE",
    activeCodeLine: 40,
    dataState: [...arr],
    pointers: { active: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    metrics: { comparisons, swaps }
  };
}
