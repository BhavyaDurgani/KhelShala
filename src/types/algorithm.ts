export type PackageStatus = 'STORED' | 'INSPECTING' | 'ELIMINATED' | 'FOUND' | 'SHIPPED';
export type AlgorithmType = 'LINEAR_SEARCH' | 'BINARY_SEARCH' | 'BUBBLE_SORT' | 'MERGE_SORT' | 'QUICK_SORT' | 'TWO_POINTERS';
export type ComplexityTier = 'O(1)' | 'O(log N)' | 'O(N)' | 'O(N log N)' | 'O(N^2)';
export type ArchitectRank = 'Novice Operator' | 'Systems Operator' | 'Infrastructure Planner' | 'Systems Engineer' | 'City Systems Architect';

export interface PackageItem {
  id: number;
  code: string;
  name: string;
  category: string;
  weightKg: number;
  shelfIndex: number;
  aisle: string;
  status: PackageStatus;
}

export interface ExecutionFrame {
  stepIndex: number;
  arrayState: number[];
  inspectedIndices: number[];
  eliminatedIndices: number[];
  pivotIndex?: number;
  highlightPackageId?: number;
  message: string;
}

export interface SystemStrategyChoice {
  id: string;
  name: string;
  description: string;
  complexity: ComplexityTier;
  processingTimeSec: number;
  resourceCostDollar: number;
  workerCongestionPct: number;
  scalabilityRating: 'Low' | 'Medium' | 'High' | 'Extreme';
  tradeoffs: string[];
}

export interface ExecutionResult {
  success: boolean;
  algorithmName: string;
  timeComplexity: ComplexityTier;
  spaceComplexity: ComplexityTier;
  totalSteps: number;
  executionTimeMs: number;
  foundIndex: number;
  efficiencyScore: number; // 0% - 100%
  throughputItemsPerMin: number;
  workerCongestionPct: number;
  deliveryStatus: 'ON_TIME' | 'DELAYED' | 'CRITICAL_OVERLOAD';
  underlyingConceptDiscovered: string;
  error?: string;
  frames: ExecutionFrame[];
}

export interface ScaleBenchmarkResult {
  inputSize: number;
  executionTimeMs: number;
  stepsCount: number;
  status: 'PASSED' | 'OVERLOAD' | 'TIMEOUT';
  message: string;
}

export interface WarehouseMission {
  id: string;
  worldId: string;
  title: string;
  subtitle: string;
  problemStatement: string;
  targetPackageId: number;
  inputSizes: number[];
  requiredComplexity: ComplexityTier;
  strategies: SystemStrategyChoice[];
  solutionHint: string;
}

export interface NPCCharacter {
  id: string;
  name: string;
  title: string;
  avatar: string;
  greeting: string;
  role: 'SUPERVISOR' | 'SYSTEMS_AI_ARIA' | 'LOGISTICS_LEAD' | 'SENIOR_DEV_AI';
  dialogue: string[];
}

export interface DiscoveredConcept {
  id: string;
  title: string;
  dsaTerm: string;
  description: string;
  realWorldExample: string;
  visualizationType: string;
  unlockedAt: string;
  iconName: string;
}

export interface AlgorithmReport {
  missionId: string;
  algorithmName: string;
  initialComplexity: ComplexityTier;
  finalComplexity: ComplexityTier;
  initialTimeMs: number;
  finalTimeMs: number;
  itemsProcessed: number;
  xpEarned: number;
  efficiencyScore: number;
  recommendations: string[];
  conceptDiscovered: DiscoveredConcept;
}
