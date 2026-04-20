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
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra\'s Algorithm',
    category: 'Pathfinding',
    description: 'A versatile algorithm for finding the shortest paths between nodes in a graph. It evaluates routes by weight, guaranteeing the optimal path in weighted graphs with non-negative edges.',
    timeComplexity: 'O(E + V log V)',
    spaceComplexity: 'O(V)',
    href: '/pathfinding/dijkstra'
  },
  {
    id: 'a-star',
    title: 'A* Search',
    category: 'Pathfinding',
    description: 'An advanced pathfinding algorithm that uses heuristics to guide its search towards the target, making it significantly faster than standard algorithms while still guaranteeing the shortest path.',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    href: '/pathfinding/a-star'
  },
  {
    id: 'bst',
    title: 'Binary Search Tree',
    category: 'Trees',
    description: 'A deeply visual interactive engine that renders large randomized BSTs. Search for specific values to see real-time $O(\\log n)$ traversal visually tracing across the branches.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    href: '/trees/bst'
  },
  {
    id: 'radix-sort',
    title: 'Radix Sort',
    category: 'Sorting',
    description: 'A non-comparative integer sorting algorithm that avoids comparison by creating and distributing elements into buckets according to their digits (radix).',
    timeComplexity: 'O(d(n + k))',
    spaceComplexity: 'O(n + k)',
    href: '/sorting/radix-sort'
  },
  {
    id: 'timsort',
    title: 'Timsort [Python Internal]',
    category: 'Sorting',
    description: 'A hybrid, stable sorting algorithm derived from merge sort and insertion sort. It is the standard sorting algorithm used in Python and Java.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    href: '/sorting/timsort'
  },
  {
    id: 'dual-pivot-quick-sort',
    title: 'Dual-Pivot Quicksort [Java Internal]',
    category: 'Sorting',
    description: "The default sorting algorithm used by Java's Arrays.sort() for primitive data types. It uses two pivots to partition the array into three parts, offering superior performance to classic single-pivot Quicksort.",
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    href: '/sorting/dual-pivot-quick-sort'
  },
  {
    id: 'introsort',
    title: 'Introsort [C++ Internal]',
    category: 'Sorting',
    description: 'The standard sorting algorithm used by C++ std::sort. It begins with Quicksort for speed, but introspectively switches to Heapsort if the recursion depth exceeds a limit, guaranteeing O(n log n) worst-case performance.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    href: '/sorting/introsort'
  }
];
