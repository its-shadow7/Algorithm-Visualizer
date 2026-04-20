/**
 * Generator for Binary Search Tree Search.
 * 
 * @param {Object} root - The current tree root
 * @param {number} targetValue - Value to search for
 */
export function* bstSearch(root, targetValue) {
  const visitedPath = [];
  let current = root;

  while (true) {
    yield { 
      type: 'SEARCHING', 
      nodeId: current ? current.id : null, 
      visitedPath: [...visitedPath],
      activeLine: 2,
      description: `Checking if node is null...`
    };

    if (!current) {
      yield {
        type: 'NOT_FOUND',
        nodeId: null,
        visitedPath: [...visitedPath],
        activeLine: 3,
        description: `Reached empty spot. Value ${targetValue} is not in the tree.`
      };
      return;
    }

    visitedPath.push(current.id);

    yield {
      type: 'COMPARE',
      nodeId: current.id,
      visitedPath: [...visitedPath],
      activeLine: 6,
      description: `Is ${targetValue} equal to ${current.value}?`
    };

    if (targetValue === current.value) {
      yield {
        type: 'FOUND',
        nodeId: current.id,
        visitedPath: [...visitedPath],
        activeLine: 7,
        description: `Target ${targetValue} found!`
      };
      return;
    } 
    
    yield {
      type: 'COMPARE',
      nodeId: current.id,
      visitedPath: [...visitedPath],
      activeLine: 8,
      description: `Is ${targetValue} less than ${current.value}?`
    };

    if (targetValue < current.value) {
      yield {
        type: 'SEARCH_LEFT',
        nodeId: current.id,
        visitedPath: [...visitedPath],
        activeLine: 9,
        description: `${targetValue} < ${current.value}. Searching left subtree...`
      };
      current = current.left;
    } else {
      yield {
        type: 'SEARCH_RIGHT',
        nodeId: current.id,
        visitedPath: [...visitedPath],
        activeLine: 11,
        description: `${targetValue} > ${current.value}. Searching right subtree...`
      };
      current = current.right;
    }
  }
}
