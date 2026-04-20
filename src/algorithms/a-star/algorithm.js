/**
 * A* Search Generator
 * Yields snapshots of the A* algorithm state for visualization.
 */

const manhattanDistance = (nodeA, nodeB) => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

export function* aStarGenerator(grid, startNode, targetNode) {
  const openSet = [{ ...grid[startNode.row][startNode.col], g: 0, h: manhattanDistance(startNode, targetNode), f: manhattanDistance(startNode, targetNode) }];
  const visited = new Set();
  const previousNodes = new Map();
  
  // Track gScores independently to avoid mutations on the main grid object within the generator
  const gScores = new Map();
  gScores.set(`${startNode.row}-${startNode.col}`, 0);

  let failsafe = 0;
  while (openSet.length > 0) {
    if (failsafe++ > 10000) break;
    // 1. Sort by fScore (Rule 1: Tie-breaker lowest h score)
    openSet.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      return a.h - b.h; // Tie-breaker: prioritize lower heuristic cost
    });

    const current = openSet.shift();
    const currentKey = `${current.row}-${current.col}`;
    
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    // Yield Active Evaluation
    yield {
      description: `Evaluating node at [${current.row}, ${current.col}] with f=${current.f.toFixed(1)}`,
      activeNode: { ...current },
      frontier: openSet.map(n => ({ ...n })),
      visited: Array.from(visited).map(key => {
        const [row, col] = key.split('-').map(Number);
        return { row, col };
      }),
      path: reconstructPath(previousNodes, current),
      activeCodeLine: 12
    };

    if (current.row === targetNode.row && current.col === targetNode.col) {
      const finalPath = reconstructPath(previousNodes, current);
      yield {
        description: "TARGET REACHED: Shortest path found via A*",
        activeNode: null,
        frontier: openSet.map(n => ({ ...n })),
        visited: Array.from(visited).map(key => {
          const [row, col] = key.split('-').map(Number);
          return { row, col };
        }),
        path: finalPath,
        activeCodeLine: 15
      };
      return;
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      if (visited.has(neighborKey) || neighbor.type === 'WALL') continue;

      const tentativeG = gScores.get(currentKey) + 1;
      const existingG = gScores.has(neighborKey) ? gScores.get(neighborKey) : Infinity;

      if (tentativeG < existingG) {
        previousNodes.set(neighborKey, current);
        gScores.set(neighborKey, tentativeG);
        
        const h = manhattanDistance(neighbor, targetNode);
        const f = tentativeG + h;
        
        const updatedNeighbor = { ...neighbor, g: tentativeG, h, f };
        
        // Update or add to openSet
        const existingIndex = openSet.findIndex(n => n.row === neighbor.row && n.col === neighbor.col);
        if (existingIndex > -1) {
          openSet[existingIndex] = updatedNeighbor;
        } else {
          openSet.push(updatedNeighbor);
        }

        yield {
          description: `Updating neighbor [${neighbor.row}, ${neighbor.col}]: f = ${tentativeG} + ${h} = ${f.toFixed(1)}`,
          activeNode: { ...current },
          frontier: openSet.map(n => ({ ...n })),
          visited: Array.from(visited).map(key => {
            const [row, col] = key.split('-').map(Number);
            return { row, col };
          }),
          path: reconstructPath(previousNodes, current),
          activeCodeLine: 34
        };
      }
    }
  }

  yield {
    description: "Search exhausted. No path found.",
    activeNode: null,
    frontier: [],
    visited: Array.from(visited).map(key => {
        const [row, col] = key.split('-').map(Number);
        return { row, col };
    }),
    path: [],
    activeCodeLine: 43
  };
}

function getNeighbors(grid, node) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

function reconstructPath(previousNodes, current) {
  const path = [];
  let temp = current;
  while (previousNodes.has(`${temp.row}-${temp.col}`)) {
    path.push(temp);
    temp = previousNodes.get(`${temp.row}-${temp.col}`);
  }
  return path;
}
