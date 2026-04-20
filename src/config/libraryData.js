export const libraryData = [
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Sorting',
    description: 'A divide and conquer algorithm that recursively breaks down a list into sublists until each sublist consists of a single element and merges those sublists in a manner that results in a sorted list.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    href: '/sorting/merge-sort'
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    category: 'Sorting',
    description: 'A highly efficient and prevalent sorting algorithm that partitions an array into two sub-arrays based on a pivot, then sorts the sub-arrays independently using recursion.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    href: '/sorting/quick-sort'
  },
  {
    id: 'heap-sort',
    title: 'Heap Sort',
    category: 'Sorting',
    description: 'A robust comparison-based sorting technique utilizing a Binary Heap data structure. It divides its input into a sorted and unsorted region, iteratively extracting the largest element.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    href: '/sorting/heap-sort'
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting',
    description: 'A fundamental sorting algorithm that repeatedly steps through the list, evaluates adjacent elements, and swaps them if they are in the wrong order until sorted.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    href: '/sorting/bubble-sort'
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    category: 'Sorting',
    description: 'An in-place comparison algorithm dividing the input list into a sorted sublist at the front and an unsorted sublist, repeatedly selecting the minimum from the unsorted section.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    href: '/sorting/selection-sort'
  },
  {
    id: 'bfs',
    title: 'Breadth-First Search',
    category: 'Pathfinding',
    description: 'A graph traversal algorithm that explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. Optimal for unweighted shortest paths.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    href: '/pathfinding/bfs'
  }
];
