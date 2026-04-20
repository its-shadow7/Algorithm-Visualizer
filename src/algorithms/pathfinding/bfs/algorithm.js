export function* bfsGenerator(grid, startNode, targetNode) {
  const ROWS = grid.length;
  const COLS = grid[0].length;
  
  const queue = [{ row: startNode.row, col: startNode.col }];
  const visited = new Set();
  const previousNodes = new Map();
  const visitedKeysInOrder = [];

  const startKey = `${startNode.row}-${startNode.col}`;
  visited.add(startKey);

  yield {
    description: "INITIALIZING BFS QUEUE",
    activeCodeLine: 1,
    activeNode: null,
    frontier: [...queue],
    visited: [],
    path: []
  };

  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let found = false;

  while (queue.length > 0) {
    const current = queue.shift();
    
    // Safety check for wall (though start/target usually aren't walls)
    if (grid[current.row][current.col].type === 'WALL') continue;

    visitedKeysInOrder.push(`${current.row}-${current.col}`);

    yield {
      description: `EVALUATING NODE (${current.row}, ${current.col})`,
      activeCodeLine: 10,
      activeNode: { ...current },
      frontier: queue.map(n => ({ ...n })), // Deep copy queue
      visited: visitedKeysInOrder.map(k => {
        const [r, c] = k.split('-').map(Number);
        return { row: r, col: c };
      }),
      path: []
    };

    if (current.row === targetNode.row && current.col === targetNode.col) {
      found = true;
      break;
    }

    yield {
      description: "FETCHING NEIGHBORS",
      activeCodeLine: 16,
      activeNode: { ...current },
      frontier: queue.map(n => ({ ...n })),
      visited: visitedKeysInOrder.map(k => {
        const [r, c] = k.split('-').map(Number);
        return { row: r, col: c };
      }),
      path: []
    };

    for (const [dr, dc] of dirs) {
      const r = current.row + dr;
      const c = current.col + dc;

      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        const neighbor = grid[r][c];
        const key = `${r}-${c}`;

        if (!visited.has(key) && neighbor.type !== 'WALL') {
          visited.add(key);
          previousNodes.set(key, current);
          queue.push({ row: r, col: c });

          yield {
            description: `ADDING NEIGHBOR (${r}, ${c}) TO FRONTIER`,
            activeCodeLine: 21,
            activeNode: { ...current },
            frontier: queue.map(n => ({ ...n })),
            visited: visitedKeysInOrder.map(k => {
              const [r, c] = k.split('-').map(Number);
              return { row: r, col: c };
            }),
            path: []
          };
        }
      }
    }
  }

  if (found) {
    const path = [];
    let curr = previousNodes.get(`${targetNode.row}-${targetNode.col}`);
    
    yield {
      description: "TARGET FOUND! RECONSTRUCTING PATH",
      activeCodeLine: 12,
      activeNode: null,
      frontier: [],
      visited: visitedKeysInOrder.map(k => {
        const [r, c] = k.split('-').map(Number);
        return { row: r, col: c };
      }),
      path: []
    };

    while (curr) {
      if (curr.row === startNode.row && curr.col === startNode.col) break;
      path.unshift({ ...curr });
      curr = previousNodes.get(`${curr.row}-${curr.col}`);
      
      yield {
        description: "BACKTRACKING STEP",
        activeCodeLine: 12,
        activeNode: null,
        frontier: [],
        visited: visitedKeysInOrder.map(k => {
          const [r, c] = k.split('-').map(Number);
          return { row: r, col: c };
        }),
        path: path.map(n => ({ ...n }))
      };
    }
  }

  yield {
    description: found ? "PATHFINDING COMPLETE" : "NO PATH FOUND",
    activeCodeLine: 28,
    activeNode: null,
    frontier: [],
    visited: visitedKeysInOrder.map(k => {
      const [r, c] = k.split('-').map(Number);
      return { row: r, col: c };
    }),
    path: found ? previousNodes.get(`${targetNode.row}-${targetNode.col}`) ? [] : [] : [] // Placeholder logic for final path
  };
  
  // Re-yield the final state properly
  if (found) {
    const finalPath = [];
    let c = previousNodes.get(`${targetNode.row}-${targetNode.col}`);
    while (c && !(c.row === startNode.row && c.col === startNode.col)) {
      finalPath.unshift({...c});
      c = previousNodes.get(`${c.row}-${c.col}`);
    }
    yield {
      description: "SEARCH FINISHED",
      activeCodeLine: 28,
      activeNode: null,
      frontier: [],
      visited: visitedKeysInOrder.map(k => {
        const [r, c] = k.split('-').map(Number);
        return { row: r, col: c };
      }),
      path: finalPath
    };
  }
}
