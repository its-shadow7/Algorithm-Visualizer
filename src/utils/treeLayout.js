/**
 * Calculates physical coordinates for a Binary Tree.
 * Returns a flat array of nodes with coordinates and child relationships.
 * 
 * @param {Object} root - The tree root { value, left, right, id }
 * @param {number} canvasWidth - Total available width
 * @param {number} startY - Y coordinate of the root
 */
export function calculateTreeLayout(root, canvasWidth, startY = 80) {
  if (!root) return [];

  const nodes = [];
  const levelHeight = 80;

  function traverse(node, x, y, depth, parentId = null) {
    if (!node) return;

    // Calculate offset for children based on depth
    // Root (depth 0) children get 1/4 of total width offset
    // Level 1 children get 1/8, etc.
    const hOffset = canvasWidth / Math.pow(2, depth + 2);

    const currentNode = {
      id: node.id,
      value: node.value,
      x,
      y,
      depth,
      parentId,
      leftChildId: node.left ? node.left.id : null,
      rightChildId: node.right ? node.right.id : null
    };

    nodes.push(currentNode);

    if (node.left) {
      traverse(node.left, x - hOffset, y + levelHeight, depth + 1, node.id);
    }
    if (node.right) {
      traverse(node.right, x + hOffset, y + levelHeight, depth + 1, node.id);
    }
  }

  traverse(root, canvasWidth / 2, startY, 0);
  return nodes;
}
