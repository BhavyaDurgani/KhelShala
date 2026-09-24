import type { IncidentAction, CyberAttack, Sector } from '../../types/cyber';

export interface IRActionResult {
  updatedAttacks: CyberAttack[];
  updatedSectors: Sector[];
  budgetDeducted: number;
  message: string;
}

export function executeIRAction(
  action: IncidentAction,
  targetAttack: CyberAttack,
  sectors: Sector[],
  activeAttacks: CyberAttack[],
  currentBudget: number
): IRActionResult {
  if (currentBudget < action.cost) {
    return {
      updatedAttacks: activeAttacks,
      updatedSectors: sectors,
      budgetDeducted: 0,
      message: `Insufficient budget to execute IR action "${action.name}". Required: $${action.cost}.`,
    };
  }

  // Deduct damage and duration or remove attack based on spreadReduction
  const updatedAttacks = activeAttacks.map(atk => {
    if (atk.id === targetAttack.id) {
      const remainingDuration = Math.max(0, Math.round(atk.duration * (1 - action.spreadReduction)));
      return {
        ...atk,
        duration: remainingDuration,
        damagePerSec: Math.max(0, Math.round(atk.damagePerSec * (1 - action.dataLossReduction))),
      };
    }
    return atk;
  }).filter(atk => atk.duration > 0);

  // Update target sector status
  const updatedSectors = sectors.map(sec => {
    if (sec.id === targetAttack.targetSectorId) {
      return {
        ...sec,
        health: Math.min(100, sec.health + 15),
        status: 'NORMAL' as const,
      };
    }
    return sec;
  });

  return {
    updatedAttacks,
    updatedSectors,
    budgetDeducted: action.cost,
    message: `IR Action "${action.name}" executed successfully! Reduced breach spread by ${Math.round(action.spreadReduction * 100)}%.`,
  };
}
