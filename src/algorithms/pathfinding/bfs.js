export function calculateBFSSync(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const shortestPath = [];
  
  if (!grid || !startNode || !targetNode) {
    return { visitedNodesInOrder, shortestPath };
  }

  const ROWS = grid.length;
  const COLS = grid[0].length;
  
  const queue = [{ row: startNode.row, col: startNode.col }];
  const visited = new Set();
  const previousNodes = new Map();

  const startKey = `${startNode.row}-${startNode.col}`;
  visited.add(startKey);

  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let found = false;

  let head = 0;
  while(head < queue.length) {
    const curr = queue[head++];
    
    if (grid[curr.row][curr.col].type === 'WALL') continue;
    
    // Do not mark start or target as 'visited' for coloring purposes if we want to keep them clean
    // but the engine just returns what was visited.
    visitedNodesInOrder.push(curr);

    if (curr.row === targetNode.row && curr.col === targetNode.col) {
      found = true;
      break;
    }

    for (const [dr, dc] of dirs) {
      const r = curr.row + dr;
      const c = curr.col + dc;
      
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        const neighbor = grid[r][c];
        const neighborKey = `${r}-${c}`;
        
        if (!visited.has(neighborKey) && neighbor.type !== 'WALL') {
          visited.add(neighborKey);
          previousNodes.set(neighborKey, curr);
          queue.push({ row: r, col: c });
        }
      }
    }
  }

  if (found) {
    let curr = previousNodes.get(`${targetNode.row}-${targetNode.col}`);
    while (curr) {
      if (curr.row === startNode.row && curr.col === startNode.col) break;
      shortestPath.unshift(curr);
      curr = previousNodes.get(`${curr.row}-${curr.col}`);
    }
  }

  return { visitedNodesInOrder, shortestPath };
}
