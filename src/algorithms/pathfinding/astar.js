/**
 * Pure Synchronous A* Search
 * Used for real-time sandbox mode.
 */

const manhattanDistance = (nodeA, nodeB) => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

export function calculateAStarSync(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const openSet = [];
  const visited = new Set();
  const start = grid[startNode.row][startNode.col];
  const target = grid[targetNode.row][targetNode.col];

  // Initialize scores
  const gScores = new Map();
  const fScores = new Map();
  const hScores = new Map();
  const previousNodes = new Map();

  const startKey = `${startNode.row}-${startNode.col}`;
  gScores.set(startKey, 0);
  const h = manhattanDistance(start, target);
  hScores.set(startKey, h);
  fScores.set(startKey, h);

  openSet.push(start);

  while (openSet.length > 0) {
    // 1. Priority Queue Logic (O(N) Smallest-Element-Find)
    let lowIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      const a = openSet[i];
      const b = openSet[lowIdx];
      const aKey = `${a.row}-${a.col}`;
      const bKey = `${b.row}-${b.col}`;
      const fDiff = fScores.get(aKey) - fScores.get(bKey);
      
      if (fDiff < 0) {
        lowIdx = i;
      } else if (fDiff === 0) {
        if (hScores.get(aKey) < hScores.get(bKey)) {
          lowIdx = i;
        }
      }
    }
    const current = openSet.splice(lowIdx, 1)[0];
    const currentKey = `${current.row}-${current.col}`;

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    if (current.type === 'WALL') continue;

    visitedNodesInOrder.push(current);

    if (current.row === targetNode.row && current.col === targetNode.col) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(previousNodes, current)
      };
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      if (neighbor.type === 'WALL' || visited.has(neighborKey)) continue;

      const stepCost = neighbor.type === 'WEIGHT' ? 5 : 1;
      const tentativeG = gScores.get(currentKey) + stepCost;
      const currentNeighborG = gScores.has(neighborKey) ? gScores.get(neighborKey) : Infinity;

      if (tentativeG < currentNeighborG) {
        if (neighborKey === startKey || neighborKey === currentKey) continue;
        previousNodes.set(neighborKey, current);
        gScores.set(neighborKey, tentativeG);
        const nh = manhattanDistance(neighbor, target);
        hScores.set(neighborKey, nh);
        fScores.set(neighborKey, tentativeG + nh);

        if (!openSet.find(n => n.row === neighbor.row && n.col === neighbor.col)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visitedNodesInOrder, shortestPath: [] };
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
  let count = 0;
  while (previousNodes.has(`${temp.row}-${temp.col}`) && count < 2000) {
    path.push(temp);
    const nextNode = previousNodes.get(`${temp.row}-${temp.col}`);
    if (`${temp.row}-${temp.col}` === `${nextNode.row}-${nextNode.col}`) break;
    temp = nextNode;
    count++;
  }
  return path;
}
