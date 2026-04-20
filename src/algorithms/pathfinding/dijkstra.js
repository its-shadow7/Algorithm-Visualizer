/**
 * Synchronous Dijkstra's Algorithm
 * Used for real-time sandbox interaction.
 */

export function calculateDijkstraSync(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const distances = new Map();
  const previousNodes = new Map();
  const openSet = [];
  const visited = new Set();

  const startKey = `${startNode.row}-${startNode.col}`;
  distances.set(startKey, 0);

  const start = grid[startNode.row][startNode.col];
  openSet.push({ ...start, distance: 0 });

  let failsafe = 0;
  while (openSet.length > 0) {
    if (failsafe++ > 10000) break;
    // 1. Priority Queue Logic (O(N) Smallest-Element-Find)
    let lowIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].distance < openSet[lowIdx].distance) lowIdx = i;
    }
    const current = openSet.splice(lowIdx, 1)[0];
    const currentKey = `${current.row}-${current.col}`;

    // Visited Guard
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    if (current.type === 'WALL') continue;
    
    // Check if we've already found a shorter path to this node
    if (current.distance > (distances.get(currentKey) || Infinity)) continue;

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
      const tentativeDistance = distances.get(currentKey) + stepCost;

      if (tentativeDistance < (distances.get(neighborKey) || Infinity)) {
        // Parent-Pointer Guard: Never point start to anything, never point to self
        if (neighborKey === startKey || neighborKey === currentKey) continue;
        distances.set(neighborKey, tentativeDistance);
        previousNodes.set(neighborKey, current);
        openSet.push({ ...neighbor, distance: tentativeDistance });
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
