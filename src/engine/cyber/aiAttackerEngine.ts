import type { AttackGraph, AttackNode, CyberAttack, Sector } from '../../types/cyber';
import { getAvailableAttackNodes } from './attackGraphEngine';

export interface AIThreatDecision {
  selectedNode: AttackNode | null;
  utilityScore: number;
  generatedAttack: CyberAttack | null;
  reasoning: string;
}

export function evaluateAIAttackerDecision(
  attackGraph: AttackGraph,
  sectors: Sector[],
  attackerPersonaId: string
): AIThreatDecision {
  const availableNodes = getAvailableAttackNodes(attackGraph);

  if (availableNodes.length === 0) {
    return {
      selectedNode: null,
      utilityScore: 0,
      generatedAttack: null,
      reasoning: 'No viable attack vectors available. All paths blocked by Defender controls or waiting on prerequisites.',
    };
  }

  let bestNode: AttackNode | null = null;
  let maxUtility = -1;

  for (const node of availableNodes) {
    // Utility U = (SuccessProb * ImpactFactor) / (DetectionProb * TimeSeconds)
    const successProb = node.successProb;
    const detectionProb = Math.max(0.05, node.detectionProb);
    const time = Math.max(5, node.timeSeconds);
    const impactFactor = node.phase === 'IMPACT' ? 10 : node.phase === 'LATERAL_MOVE' ? 7 : node.phase === 'PRIV_ESC' ? 5 : 3;

    // Apply persona bonuses
    let personaModifier = 1.0;
    if (attackerPersonaId === 'phantom_x' && (node.phase === 'RECON' || node.phase === 'INITIAL_ACCESS')) {
      personaModifier = 1.35; // Stealth bonus
    } else if (attackerPersonaId === 'viper' && node.phase === 'IMPACT') {
      personaModifier = 1.5; // High impact ransomware bonus
    } else if (attackerPersonaId === 'insider_zero' && node.phase === 'PRIV_ESC') {
      personaModifier = 1.4; // Privileged insider bonus
    }

    const utility = ((successProb * impactFactor * personaModifier) / (detectionProb * (time / 10)));

    if (utility > maxUtility) {
      maxUtility = utility;
      bestNode = node;
    }
  }

  if (!bestNode) {
    return {
      selectedNode: null,
      utilityScore: 0,
      generatedAttack: null,
      reasoning: 'AI could not compute optimal attack node.',
    };
  }

  // Target a sector matching node or default to first sector
  const targetSector = sectors[0];

  const generatedAttack: CyberAttack = {
    id: `atk_${Date.now()}`,
    name: bestNode.name,
    type: bestNode.name,
    targetSectorId: targetSector ? targetSector.id : 'sec_0',
    severity: bestNode.phase === 'IMPACT' ? 'CRITICAL' : bestNode.phase === 'LATERAL_MOVE' ? 'HIGH' : 'MED',
    damagePerSec: bestNode.phase === 'IMPACT' ? 15 : 5,
    duration: bestNode.timeSeconds,
    detected: Math.random() < bestNode.detectionProb,
    attackNodeId: bestNode.id,
  };

  return {
    selectedNode: bestNode,
    utilityScore: Math.round(maxUtility * 100) / 100,
    generatedAttack,
    reasoning: `AI selected vector "${bestNode.name}" (Phase: ${bestNode.phase}, Utility: ${Math.round(maxUtility * 100) / 100}).`,
  };
}
