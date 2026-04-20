/**
 * Dijkstra's Algorithm Generator
 * Factoring in weighted traversal costs (Weight = 5).
 */

export function* dijkstraGenerator(grid, startNode, targetNode) {
  const distances = new Map();
  const previousNodes = new Map();
  const visited = new Set();
  
  // Initialize start node
  const startKey = `${startNode.row}-${startNode.col}`;
  distances.set(startKey, 0);
  
  const openSet = [{ ...grid[startNode.row][startNode.col], distance: 0 }];

  let failsafe = 0;
  while (openSet.length > 0) {
    if (failsafe++ > 10000) break;
    // 1. Priority Queue Logic (Sort by cumulative distance)
    openSet.sort((a, b) => a.distance - b.distance);
    const current = openSet.shift();
    const currentKey = `${current.row}-${current.col}`;

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    // Yield Active Evaluation
    yield {
      description: `Exploring node at [${current.row}, ${current.col}] with total distance ${current.distance}`,
      activeNode: { ...current },
      frontier: openSet.map(n => ({ ...n })),
      visited: Array.from(visited).map(key => {
        const [row, col] = key.split('-').map(Number);
        return { row, col };
      }),
      path: reconstructPath(previousNodes, current),
      activeCodeLine: 8
    };

    if (current.row === targetNode.row && current.col === targetNode.col) {
      const finalPath = reconstructPath(previousNodes, current);
      yield {
        description: "TARGET REACHED via Dijkstra's shortest path",
        activeNode: null,
        frontier: openSet.map(n => ({ ...n })),
        visited: Array.from(visited).map(key => {
          const [row, col] = key.split('-').map(Number);
          return { row, col };
        }),
        path: finalPath,
        activeCodeLine: 11
      };
      return;
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      if (visited.has(neighborKey) || neighbor.type === 'WALL') continue;

      // WEIGHT = 5, EMPTY = 1
      const stepCost = neighbor.type === 'WEIGHT' ? 5 : 1;
      const tentativeDistance = distances.get(currentKey) + stepCost;

      if (tentativeDistance < (distances.get(neighborKey) || Infinity)) {
        distances.set(neighborKey, tentativeDistance);
        previousNodes.set(neighborKey, current);
        
        const updatedNeighbor = { ...neighbor, distance: tentativeDistance };
        openSet.push(updatedNeighbor);

        yield {
          description: `Relaxing edge to [${neighbor.row}, ${neighbor.col}]: dist = ${tentativeDistance}`,
          activeNode: { ...current },
          frontier: openSet.map(n => ({ ...n })),
          visited: Array.from(visited).map(key => {
            const [row, col] = key.split('-').map(Number);
            return { row, col };
          }),
          path: reconstructPath(previousNodes, current),
          activeCodeLine: 18
        };
      }
    }
  }
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
