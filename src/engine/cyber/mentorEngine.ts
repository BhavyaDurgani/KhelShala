import type { LevelConfig, Sector, SecurityControl, MentorHint } from '../../types/cyber';

export function generateSocraticHints(
  _level: LevelConfig,
  sectors: Sector[],
  budgetRemaining: number,
  _controlsCatalog: SecurityControl[]
): MentorHint[] {
  // Find sector with highest unmitigated risk
  let highestRiskSector = sectors[0];
  let maxRisk = -1;

  for (const s of sectors) {
    let sRisk = 0;
    for (const a of s.assets) {
      sRisk += a.risk;
    }
    if (sRisk > maxRisk) {
      maxRisk = sRisk;
      highestRiskSector = s;
    }
  }

  const unmitigatedAsset = highestRiskSector?.assets[0];

  return [
    {
      tier: 1,
      prompt: 'High-Level Assessment',
      text: `Observe sector "${highestRiskSector?.name}". Which type of traffic or access controls currently leave asset "${unmitigatedAsset?.name}" exposed?`,
      cost: 50,
    },
    {
      tier: 2,
      prompt: 'Defense Concept',
      text: `To protect "${unmitigatedAsset?.name}", consider a security control that filters network packets, enforces authentication, or prevents lateral movement between VLANs.`,
      cost: 100,
    },
    {
      tier: 3,
      prompt: 'Actionable Recommendation',
      text: `We recommend deploying "${budgetRemaining >= 3000 ? 'Next-Gen Perimeter Firewall (NGFW)' : 'Multi-Factor Authentication (MFA)'}" or "Zero-Trust Network Segmentation" on ${highestRiskSector?.name} to reduce likelihood.`,
      cost: 150,
    },
  ];
}
