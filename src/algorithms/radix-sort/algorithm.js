export function* radixSort(array) {
  const arr = [...array];
  const n = arr.length;
  
  // Find the maximum number to know number of digits
  let max = Math.max(...arr.map(item => item.value));
  let exp = 1;
  let swaps = 0;

  yield {
    description: "INITIALIZING RADIX SORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], sortedIndices: [] },
    metrics: { comparisons: 0, swaps: 0 }
  };

  while (Math.floor(max / exp) > 0) {
    const digitLabel = exp === 1 ? "ONES" : exp === 10 ? "TENS" : "HUNDREDS";
    const buckets = Array.from({ length: 10 }, () => []);

    // 1. Bucketing Phase (with Float Protection)
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(Math.floor(arr[i].value) / exp) % 10;
      buckets[digit].push(arr[i]);

      yield {
        description: `EVALUATING ${digitLabel} DIGIT: ${digit}`,
        activeCodeLine: 10,
        dataState: [...arr],
        pointers: { active: [i], sortedIndices: [] },
        metrics: { comparisons: 0, swaps }
      };
    }

    // 2. Reconstruction Phase (Reference Safe Swapping)
    let idx = 0;
    for (let b = 0; b < 10; b++) {
      for (let item of buckets[b]) {
        // Find current position of the target item to perform a swap
        const currentPos = arr.indexOf(item);
        
        if (currentPos !== idx) {
          [arr[idx], arr[currentPos]] = [arr[currentPos], arr[idx]];
          swaps++; 
        }
        
        yield {
          description: `EXTRACTING FROM BUCKET ${b} TO POSITION ${idx}`,
          activeCodeLine: 20,
          dataState: [...arr],
          pointers: { active: [idx], sortedIndices: [] },
          metrics: { comparisons: 0, swaps }
        };
        idx++;
      }
    }

    exp *= 10;
  }

  yield {
    description: "RADIX SORT COMPLETE",
    activeCodeLine: 28,
    dataState: [...arr],
    pointers: { active: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    metrics: { comparisons: 0, swaps }
  };
}
