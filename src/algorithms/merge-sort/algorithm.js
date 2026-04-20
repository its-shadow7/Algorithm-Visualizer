export function* mergeSort(array) {
  const arr = [...array];
  const n = arr.length;
  let metrics = { comparisons: 0, swaps: 0 };

  yield {
    step: 0,
    description: "INITIALIZING MERGE SORT",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { active: [], range: null, writing: [], sortedIndices: [] },
    metrics: { ...metrics }
  };

  yield* sort(arr, 0, n - 1, metrics);

  yield {
    description: "SORTING COMPLETE",
    activeCodeLine: 1,
    dataState: [...arr],
    pointers: { 
      active: [], 
      range: null, 
      writing: [], 
      sortedIndices: arr.map((_, i) => i) 
    },
    metrics: { ...metrics }
  };
}

function* sort(arr, left, right, metrics) {
  if (left >= right) {
    yield {
      description: "BASE CASE REACHED",
      activeCodeLine: 2,
      dataState: [...arr],
      pointers: { range: [left, right], active: [], sortedIndices: [] },
      metrics: { ...metrics }
    };
    return;
  }
  
  const mid = Math.floor((left + right) / 2);
  
  yield {
    description: `DIVIDING ARRAY: [${left}...${right}]`,
    activeCodeLine: 4,
    dataState: [...arr],
    pointers: { range: [left, right], active: [], sortedIndices: [] },
    metrics: { ...metrics }
  };

  yield { description: "RECURSIVE CALL: LEFT HALF", activeCodeLine: 5, dataState: [...arr], pointers: { range: [left, right] }, metrics: { ...metrics } };
  yield* sort(arr, left, mid, metrics);

  yield { description: "RECURSIVE CALL: RIGHT HALF", activeCodeLine: 6, dataState: [...arr], pointers: { range: [left, right] }, metrics: { ...metrics } };
  yield* sort(arr, mid + 1, right, metrics);
  
  yield { description: "PREPARING TO MERGE", activeCodeLine: 7, dataState: [...arr], pointers: { range: [left, right] }, metrics: { ...metrics } };
  yield* merge(arr, left, mid, right, metrics);
}

function* merge(arr, left, mid, right, metrics) {
  let leftArr = arr.slice(left, mid + 1);
  let rightArr = arr.slice(mid + 1, right + 1);
  
  yield { description: "SLICING SUB-ARRAYS", activeCodeLine: 11, dataState: [...arr], pointers: { range: [left, right] }, metrics: { ...metrics } };

  let i = 0, j = 0, k = left;

  // Helper to prevent React Key duplication crash during in-place overwrite
  const getVisualState = (currI, currJ, currK) => {
    const visualArr = [...arr];
    let m = currK;
    for (let x = currI; x < leftArr.length; x++) visualArr[m++] = leftArr[x];
    for (let x = currJ; x < rightArr.length; x++) visualArr[m++] = rightArr[x];
    return visualArr;
  };
  
  while (i < leftArr.length && j < rightArr.length) {
    metrics.comparisons++;
    
    yield {
      description: `COMPARING: ${leftArr[i].value} AND ${rightArr[j].value}`,
      activeCodeLine: 16,
      dataState: getVisualState(i, j, k),
      pointers: { 
        range: [left, right],
        active: [left + i, mid + 1 + j] 
      },
      metrics: { ...metrics }
    };

    if (leftArr[i].value <= rightArr[j].value) {
      arr[k] = leftArr[i++];
      metrics.swaps++;
      yield {
        description: "WRITING VALUE FROM LEFT",
        activeCodeLine: 17,
        dataState: getVisualState(i, j, k + 1),
        pointers: { range: [left, right], writing: [k] },
        metrics: { ...metrics }
      };
    } else {
      arr[k] = rightArr[j++];
      metrics.swaps++;
      yield {
        description: "WRITING VALUE FROM RIGHT",
        activeCodeLine: 19,
        dataState: getVisualState(i, j, k + 1),
        pointers: { range: [left, right], writing: [k] },
        metrics: { ...metrics }
      };
    }
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i++];
    metrics.swaps++;
    yield {
      description: "FLUSHING REMAINING LEFT HALF",
      activeCodeLine: 23,
      dataState: getVisualState(i, j, k + 1),
      pointers: { range: [left, right], writing: [k] },
      metrics: { ...metrics }
    };
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j++];
    metrics.swaps++;
    yield {
      description: "FLUSHING REMAINING RIGHT HALF",
      activeCodeLine: 24,
      dataState: getVisualState(i, j, k + 1),
      pointers: { range: [left, right], writing: [k] },
      metrics: { ...metrics }
    };
    k++;
  }
}
