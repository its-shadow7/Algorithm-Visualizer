export function* dualPivotQuickSort(array) {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  yield {
    description: "INITIALIZING DUAL-PIVOT QUICKSORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], pivot: [], sortedIndices: [] },
    metrics: { comparisons: 0, swaps: 0 }
  };

  yield* sort(arr, 0, n - 1);

  function* sort(arr, low, high) {
    if (low < high) {
      // Choose and partition
      const p = yield* partition(arr, low, high);
      const lp = p[0];
      const rp = p[1];

      // Recursively sort the three partitions
      yield* sort(arr, low, lp - 1);
      yield* sort(arr, lp + 1, rp - 1);
      yield* sort(arr, rp + 1, high);
    } else if (low === high) {
       // Mark single element as sorted
       yield {
          description: "PARTITION TERMINATED",
          activeCodeLine: 12,
          dataState: [...arr],
          pointers: { active: [], pivot: [], sortedIndices: [low] },
          metrics: { comparisons, swaps }
        };
    }
  }

  function* partition(arr, low, high) {
    comparisons++;
    if (arr[low].value > arr[high].value) {
      swaps++;
      [arr[low], arr[high]] = [arr[high], arr[low]];
      
      yield {
        description: "ENSURING P1 < P2: SWAPPING OUTER BOUNDS",
        activeCodeLine: 3,
        dataState: [...arr],
        pointers: { active: [low, high], pivot: [low, high], range: [low, high] },
        metrics: { comparisons, swaps }
      };
    }

    let p1 = arr[low].value;
    let p2 = arr[high].value;

    let lt = low + 1;
    let gt = high - 1;
    let k = low + 1;

    while (k <= gt) {
      comparisons++;
      if (arr[k].value < p1) {
        swaps++;
        [arr[k], arr[lt]] = [arr[lt], arr[k]];
        
        yield {
          description: `Element < P1: Swapping to left partition [lt=${lt}]`,
          activeCodeLine: 6,
          dataState: [...arr],
          pointers: { active: [k, lt], pivot: [low, high], range: [low, high] },
          metrics: { comparisons, swaps }
        };
        lt++;
      } else if (arr[k].value >= p2) {
        comparisons++;
        while (arr[gt].value > p2 && k < gt) {
          comparisons++;
          gt--;
          yield {
            description: "SCANNING FOR GREATER ELEMENTS (gt--)",
            activeCodeLine: 8,
            dataState: [...arr],
            pointers: { active: [k, gt], pivot: [low, high], range: [low, high] },
            metrics: { comparisons, swaps }
          };
        }
        
        swaps++;
        [arr[k], arr[gt]] = [arr[gt], arr[k]];
        
        yield {
          description: `Element > P2: Swapping to right partition [gt=${gt}]`,
          activeCodeLine: 9,
          dataState: [...arr],
          pointers: { active: [k, gt], pivot: [low, high], range: [low, high] },
          metrics: { comparisons, swaps }
        };
        gt--;
        
        comparisons++;
        if (arr[k].value < p1) {
          swaps++;
          [arr[k], arr[lt]] = [arr[lt], arr[k]];
          yield {
            description: `Swapped element < P1: Moving to left partition [lt=${lt}]`,
            activeCodeLine: 10,
            dataState: [...arr],
            pointers: { active: [k, lt], pivot: [low, high], range: [low, high] },
            metrics: { comparisons, swaps }
          };
          lt++;
        }
      }
      k++;
    }

    lt--;
    gt++;

    // Swapping pivots to their final positions
    swaps += 2;
    [arr[low], arr[lt]] = [arr[lt], arr[low]];
    [arr[high], arr[gt]] = [arr[gt], arr[high]];

    yield {
      description: "PLACING PIVOTS TO FINAL LOCATIONS",
      activeCodeLine: 15,
      dataState: [...arr],
      pointers: { active: [lt, gt], pivot: [lt, gt], range: [low, high] },
      metrics: { comparisons, swaps }
    };

    return [lt, gt];
  }

  yield {
    description: "DUAL-PIVOT QUICKSORT COMPLETE",
    activeCodeLine: 20,
    dataState: [...arr],
    pointers: { active: [], pivot: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    metrics: { comparisons, swaps }
  };
}
