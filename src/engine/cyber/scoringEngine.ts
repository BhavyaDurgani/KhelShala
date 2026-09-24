import type { SecurityReport, LevelConfig } from '../../types/cyber';

export function calculateEndLevelSecurityReport(
  _level: LevelConfig,
  budgetUsed: number,
  budgetRemaining: number,
  confidentiality: number,
  integrity: number,
  availability: number,
  totalRiskReduced: number,
  successfulAttacksCount: number,
  mitigatedAttacksCount: number,
  hintsUsed: number
): SecurityReport {
  // Score components
  const ciaAvg = (confidentiality + integrity + availability) / 3;
  const riskReductionScore = Math.min(100, Math.round((totalRiskReduced / 1000) * 10));
  const attackPreventionScore = Math.max(0, 100 - (successfulAttacksCount * 25) + (mitigatedAttacksCount * 15));
  const hintPenalty = hintsUsed * 30;

  const rawScore = Math.max(0, Math.round((ciaAvg * 0.4) + (riskReductionScore * 0.3) + (attackPreventionScore * 0.3) - hintPenalty));
  const finalScore = Math.min(1000, rawScore * 10);

  let rating: 'S' | 'A' | 'B' | 'C' | 'F' = 'C';
  if (finalScore >= 850) rating = 'S';
  else if (finalScore >= 700) rating = 'A';
  else if (finalScore >= 550) rating = 'B';
  else if (finalScore >= 400) rating = 'C';
  else rating = 'F';

  const recommendations: string[] = [];
  if (confidentiality < 70) {
    recommendations.push('Enforce Multi-Factor Authentication and AES-256 Data Encryption to prevent unauthorized data access.');
  }
  if (integrity < 70) {
    recommendations.push('Deploy Air-Gapped Immutable Backups and EDR agent monitoring to prevent ransomware tampering.');
  }
  if (availability < 70) {
    recommendations.push('Balance operational security friction; avoid excessive protocol blocking without high-throughput NGFW.');
  }
  if (successfulAttacksCount > 0) {
    recommendations.push('Strengthen initial access layers (Security Awareness Training & Vulnerability Scanning) to halt attacks at Recon phase.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Outstanding SecOps execution! Perfect defense-in-depth posture maintained across all sectors.');
  }

  return {
    finalScore,
    rating,
    budgetUsed,
    budgetRemaining,
    confidentialityScore: confidentiality,
    integrityScore: integrity,
    availabilityScore: availability,
    totalRiskReduced,
    successfulAttacksCount,
    mitigatedAttacksCount,
    hintsUsed,
    recommendations,
  };
}
