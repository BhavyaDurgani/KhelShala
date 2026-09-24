export type GameRole = 'DEFENDER' | 'ATTACKER';
export type AssetCategory = 'SERVER' | 'DATABASE' | 'SCADA' | 'WORKSTATION' | 'USER_CREDENTIALS';
export type ControlCategory = 'PHYSICAL' | 'ADMINISTRATIVE' | 'NETWORK' | 'ENDPOINT' | 'SECOPS';
export type SectorStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type AttackPhase = 'RECON' | 'INITIAL_ACCESS' | 'PRIV_ESC' | 'LATERAL_MOVE' | 'IMPACT';
export type NodeStatus = 'LOCKED' | 'AVAILABLE' | 'EXECUTED' | 'BLOCKED';
export type DialogEmotion = 'SERIOUS' | 'CRITICAL' | 'CONFIDENT' | 'TACTICAL';

export interface CharacterOperative {
  id: string;
  name: string;
  title: string;
  role: GameRole;
  avatar: string;
  bio: string;
  passivePerkName: string;
  passivePerkDesc: string;
  tacticalAbilityName: string;
  tacticalAbilityDesc: string;
  cooldownSec: number;
  color: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number; // Monetary or Criticality value ($1,000 - $100,000)
  vulnerabilityLevel: number; // 0.0 to 1.0
  baseLikelihood: number; // 0.0 to 1.0
  currentLikelihood: number; // Calculated dynamically after controls
  impact: number; // Value * Vulnerability
  risk: number; // Likelihood * Impact
  sectorId: string;
}

export interface SecurityControl {
  id: string;
  name: string;
  category: ControlCategory;
  cost: number; // Financial cost ($)
  effectiveness: number; // Risk reduction factor (0.1 to 0.95)
  availabilityFriction: number; // Availability score penalty (0 to 15)
  confidentialityBonus: number; // Confidentiality score boost (0 to 25)
  integrityBonus: number; // Integrity score boost (0 to 25)
  affectedAssetTypes: AssetCategory[];
  description: string;
  iconName: string;
}

export interface Sector {
  id: string;
  name: string;
  code: string;
  category: string;
  health: number; // 0 to 100
  assets: Asset[];
  status: SectorStatus;
  x: number;
  y: number;
  z: number;
  deployedControlIds: string[];
}

export interface AttackNode {
  id: string;
  name: string;
  phase: AttackPhase;
  description: string;
  successProb: number; // Base probability 0.0 to 1.0
  detectionProb: number; // 0.0 to 1.0
  timeSeconds: number;
  prerequisites: string[]; // Node IDs required before unlocking
  mitigatedByControlIds: string[]; // Security control IDs that block this node
  status: NodeStatus;
  position3D: [number, number, number];
}

export interface AttackGraphEdge {
  source: string;
  target: string;
}

export interface AttackGraph {
  nodes: AttackNode[];
  edges: AttackGraphEdge[];
  currentStepId: string;
  objectiveNodeId: string;
}

export interface IncidentAction {
  id: string;
  name: string;
  cost: number;
  recoveryTimeSec: number;
  availabilityImpact: number;
  spreadReduction: number;
  dataLossReduction: number;
  description: string;
  iconName: string;
}

export interface CutsceneDialog {
  speakerName: string;
  avatar: string;
  text: string;
  emotion: DialogEmotion;
}

export interface LevelConfig {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  budget: number;
  maxTime: number;
  sectors: Sector[];
  attackGraph: AttackGraph;
  objectives: string[];
  introCutscene: CutsceneDialog[];
}

export interface MentorHint {
  tier: number;
  prompt: string;
  text: string;
  cost: number;
}

export interface CyberAttack {
  id: string;
  name: string;
  type: string;
  targetSectorId: string;
  severity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  damagePerSec: number;
  duration: number; // seconds remaining
  detected: boolean;
  attackNodeId?: string;
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'attack' | 'defense' | 'system' | 'incident' | 'mentor';
}

export interface SecurityReport {
  finalScore: number;
  rating: 'S' | 'A' | 'B' | 'C' | 'F';
  budgetUsed: number;
  budgetRemaining: number;
  confidentialityScore: number;
  integrityScore: number;
  availabilityScore: number;
  totalRiskReduced: number;
  successfulAttacksCount: number;
  mitigatedAttacksCount: number;
  hintsUsed: number;
  recommendations: string[];
}
