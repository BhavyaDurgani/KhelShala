import type { AttackGraph, AttackNode, NodeStatus } from '../../types/cyber';

export function updateAttackGraphStatuses(attackGraph: AttackGraph, deployedControlIds: string[]): AttackGraph {
  const updatedNodes: AttackNode[] = attackGraph.nodes.map(node => {
    // Check if any active defender control mitigates this node
    const isMitigated = node.mitigatedByControlIds.some(ctrlId => deployedControlIds.includes(ctrlId));

    if (isMitigated) {
      return { ...node, status: 'BLOCKED' as NodeStatus };
    }

    // Check if node is already executed
    if (node.status === 'EXECUTED') {
      return node;
    }

    // Check prerequisites
    const prereqsMet = node.prerequisites.every(prereqId => {
      const parent = attackGraph.nodes.find(n => n.id === prereqId);
      return parent && parent.status === 'EXECUTED';
    });

    if (node.prerequisites.length === 0 || prereqsMet) {
      return { ...node, status: 'AVAILABLE' as NodeStatus };
    }

    return { ...node, status: 'LOCKED' as NodeStatus };
  });

  return {
    ...attackGraph,
    nodes: updatedNodes,
  };
}

export function getAvailableAttackNodes(attackGraph: AttackGraph): AttackNode[] {
  return attackGraph.nodes.filter(n => n.status === 'AVAILABLE');
}

export function isObjectiveBreached(attackGraph: AttackGraph): boolean {
  const objectiveNode = attackGraph.nodes.find(n => n.id === attackGraph.objectiveNodeId);
  return objectiveNode ? objectiveNode.status === 'EXECUTED' : false;
}
