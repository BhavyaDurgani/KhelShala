import type { Asset, Sector, SecurityControl, CyberAttack } from '../../types/cyber';

export interface CIAScoreResult {
  confidentiality: number; // 0 - 100
  integrity: number; // 0 - 100
  availability: number; // 0 - 100
  ciaBalanceScore: number; // 0 - 100 (higher when C, I, A are close to equilibrium)
  totalRisk: number;
  totalRiskReduced: number;
  operationalFrictionPenalty: number;
}

export function calculateAssetRisk(asset: Asset, sectorControlIds: string[], controlsCatalog: SecurityControl[]): { likelihood: number; risk: number } {
  const activeControls = controlsCatalog.filter(c => sectorControlIds.includes(c.id) && c.affectedAssetTypes.includes(asset.category));

  // Risk = Likelihood * Impact
  // Each effective control reduces likelihood: Likelihood_new = Likelihood_base * (1 - effectiveness)
  let currentLikelihood = asset.baseLikelihood;
  for (const ctrl of activeControls) {
    currentLikelihood *= (1 - ctrl.effectiveness);
  }

  // Ensure bounds
  currentLikelihood = Math.max(0.01, Math.min(1.0, currentLikelihood));
  const risk = Math.round(currentLikelihood * asset.impact);

  return {
    likelihood: currentLikelihood,
    risk,
  };
}

export function calculateSectorRisk(sector: Sector, controlsCatalog: SecurityControl[]): { sectorRisk: number; baseRisk: number } {
  let sectorRisk = 0;
  let baseRisk = 0;

  for (const asset of sector.assets) {
    const { risk } = calculateAssetRisk(asset, sector.deployedControlIds, controlsCatalog);
    const baseAssetRisk = Math.round(asset.baseLikelihood * asset.impact);
    sectorRisk += risk;
    baseRisk += baseAssetRisk;
  }

  return { sectorRisk, baseRisk };
}

export function calculateTotalEnvironmentRisk(sectors: Sector[], controlsCatalog: SecurityControl[]): { totalRisk: number; maxPossibleRisk: number } {
  let totalRisk = 0;
  let maxPossibleRisk = 0;

  for (const sector of sectors) {
    const { sectorRisk, baseRisk } = calculateSectorRisk(sector, controlsCatalog);
    totalRisk += sectorRisk;
    maxPossibleRisk += baseRisk;
  }

  return { totalRisk, maxPossibleRisk };
}

export function calculateCIAScores(sectors: Sector[], controlsCatalog: SecurityControl[], activeAttacks: CyberAttack[]): CIAScoreResult {
  let confidentialityBonus = 0;
  let integrityBonus = 0;
  let frictionPenalty = 0;

  let totalDeployedControls = 0;

  // Flatten all deployed controls across sectors
  for (const sector of sectors) {
    for (const ctrlId of sector.deployedControlIds) {
      const ctrl = controlsCatalog.find(c => c.id === ctrlId);
      if (ctrl) {
        confidentialityBonus += ctrl.confidentialityBonus;
        integrityBonus += ctrl.integrityBonus;
        frictionPenalty += ctrl.availabilityFriction;
        totalDeployedControls++;
      }
    }
  }

  // Base CIA scores baseline 60
  let confidentiality = Math.min(100, Math.max(10, 60 + confidentialityBonus));
  let integrity = Math.min(100, Math.max(10, 60 + integrityBonus));
  let availability = Math.min(100, Math.max(10, 100 - frictionPenalty));

  // Deduct for active attacks
  for (const attack of activeAttacks) {
    if (attack.severity === 'CRITICAL') {
      availability = Math.max(5, availability - 25);
      integrity = Math.max(5, integrity - 20);
      confidentiality = Math.max(5, confidentiality - 15);
    } else if (attack.severity === 'HIGH') {
      availability = Math.max(10, availability - 15);
      integrity = Math.max(10, integrity - 10);
    } else if (attack.severity === 'MED') {
      availability = Math.max(15, availability - 8);
    }
  }

  // Round values
  confidentiality = Math.round(confidentiality);
  integrity = Math.round(integrity);
  availability = Math.round(availability);

  // CIA Balance formula: 100 - standard deviation of (C, I, A) * 1.5
  const mean = (confidentiality + integrity + availability) / 3;
  const variance = ((confidentiality - mean) ** 2 + (integrity - mean) ** 2 + (availability - mean) ** 2) / 3;
  const stdDev = Math.sqrt(variance);
  const ciaBalanceScore = Math.max(0, Math.min(100, Math.round(100 - (stdDev * 1.2))));

  const { totalRisk, maxPossibleRisk } = calculateTotalEnvironmentRisk(sectors, controlsCatalog);
  const totalRiskReduced = Math.max(0, maxPossibleRisk - totalRisk);

  return {
    confidentiality,
    integrity,
    availability,
    ciaBalanceScore,
    totalRisk,
    totalRiskReduced,
    operationalFrictionPenalty: frictionPenalty,
  };
}
