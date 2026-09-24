import type { Sector, SecurityControl, CyberAttack } from '../../types/cyber';
import { SECURITY_CONTROLS_CATALOG } from '../../data/cyber/securityControls';
import { INCIDENT_ACTIONS } from '../../data/cyber/incidentActions';

export interface AIDefenderDecision {
  actionType: 'DEPLOY_CONTROL' | 'TRIGGER_IR' | 'IDLE';
  targetSectorId?: string;
  deployedControl?: SecurityControl;
  irActionId?: string;
  reasoning: string;
}

export function evaluateAIDefenderDecision(
  sectors: Sector[],
  activeAttacks: CyberAttack[],
  currentBudget: number
): AIDefenderDecision {
  // 1. Priority 1: Handle active detected attacks via Incident Response
  const criticalAttack = activeAttacks.find(a => a.detected);
  if (criticalAttack) {
    const affordableIR = INCIDENT_ACTIONS.filter(a => currentBudget >= a.cost);
    if (affordableIR.length > 0) {
      // Pick best IR action (highest spread reduction)
      const bestIR = affordableIR.reduce((prev, curr) => (curr.spreadReduction > prev.spreadReduction ? curr : prev));
      return {
        actionType: 'TRIGGER_IR',
        targetSectorId: criticalAttack.targetSectorId,
        irActionId: bestIR.id,
        reasoning: `AI Defender activated IR Action "${bestIR.name}" to contain active attack "${criticalAttack.name}".`,
      };
    }
  }

  // 2. Priority 2: Deploy preventive security controls on highest-risk sector
  let highestRiskSector: Sector | null = null;
  let maxRisk = -1;

  for (const s of sectors) {
    const sRisk = s.assets.reduce((sum, a) => sum + a.risk, 0);
    if (sRisk > maxRisk) {
      maxRisk = sRisk;
      highestRiskSector = s;
    }
  }

  if (highestRiskSector) {
    // Find un-deployed controls the AI can afford
    const availableControls = SECURITY_CONTROLS_CATALOG.filter(
      ctrl => currentBudget >= ctrl.cost && !highestRiskSector!.deployedControlIds.includes(ctrl.id)
    );

    if (availableControls.length > 0) {
      // Prioritize high effectiveness network/endpoint controls
      const bestCtrl = availableControls.reduce((prev, curr) => (curr.effectiveness > prev.effectiveness ? curr : prev));
      return {
        actionType: 'DEPLOY_CONTROL',
        targetSectorId: highestRiskSector.id,
        deployedControl: bestCtrl,
        reasoning: `AI Defender deployed "${bestCtrl.name}" on ${highestRiskSector.name} to mitigate $${maxRisk.toLocaleString()} sector risk.`,
      };
    }
  }

  return {
    actionType: 'IDLE',
    reasoning: 'AI Defender monitoring security baseline. Budget conserved for threat escalation.',
  };
}
