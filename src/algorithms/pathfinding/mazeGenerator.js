/**
 * Procedural Maze Generation using Recursive Backtracking (DFS)
 * Carves a maze by stepping 2 units and removing walls in between.
 */

export function* recursiveBacktracker(initialGrid, startNode, targetNode) {
  const ROWS = initialGrid.length;
  const COLS = initialGrid[0].length;

  // 1. Initial State: Fill grid with WALLS (keep Start/Target safe)
  const grid = initialGrid.map(row => row.map(node => ({
    ...node,
    type: (node.type === 'START' || node.type === 'TARGET') ? node.type : 'WALL'
  })));

  // Pick a starting carving point (guaranteed to be odd to align with step-by-2)
  const start = [1, 1];
  const stack = [start];
  grid[1][1].type = 'EMPTY';

  const getUnvisitedNeighbors = (r, c) => {
    const neighbors = [];
    // Up, Down, Left, Right (2 units away)
    const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      // Treat outer row/col as unbreakable border (Stay within 1..ROWS-2, 1..COLS-2)
      if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1) {
        if (grid[nr][nc].type === 'WALL') {
          neighbors.push([nr, nc]);
        }
      }
    }
    return neighbors;
  };

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    
    // Set current node as CARVING for visual feedback
    const originalType = grid[r][c].type;
    grid[r][c].type = 'CARVING';

    yield {
      description: `Carving maze at [${r}, ${c}]`,
      grid: grid.map(row => row.map(node => ({ ...node }))), // Deep copy for timeline safety
      activeCodeLine: 10 // Mock line if needed
    };

    // Revert type back to EMPTY for the next steps
    grid[r][c].type = originalType === 'START' || originalType === 'TARGET' ? originalType : 'EMPTY';

    const neighbors = getUnvisitedNeighbors(r, c);

    if (neighbors.length > 0) {
      // Pick random neighbor
      const [nr, nc] = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Carve through the cell in between
      const intermediateR = (r + nr) / 2;
      const intermediateC = (c + nc) / 2;
      
      if (grid[intermediateR][intermediateC].type !== 'START' && grid[intermediateR][intermediateC].type !== 'TARGET') {
        grid[intermediateR][intermediateC].type = 'EMPTY';
      }

      grid[nr][nc].type = 'EMPTY';
      stack.push([nr, nc]);
    } else {
      stack.pop();
    }
  }

  // Post-Processing Connectivity Patch
  const ensureConnected = (node) => {
    const { row: r, col: c } = node;
    const adjacent = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
    
    let isSurrounded = true;
    const breakableWalls = [];

    for (const [nr, nc] of adjacent) {
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (grid[nr][nc].type !== 'WALL') {
          isSurrounded = false;
        } else if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1) {
          // Only break inner walls to prevent breaking the outer maze boundary
          breakableWalls.push([nr, nc]);
        }
      }
    }

    if (isSurrounded && breakableWalls.length > 0) {
      // Forcefully smash one wall to guarantee a connection
      const [br, bc] = breakableWalls[0];
      grid[br][bc].type = 'EMPTY';
    }
  };

  ensureConnected(startNode);
  ensureConnected(targetNode);

  // Final yield: The complete maze
  yield {
     description: "Maze Generation Complete: Freeing Start and Target nodes",
     grid: grid.map(row => row.map(node => ({ ...node }))),
     isFinished: true
  };
}
