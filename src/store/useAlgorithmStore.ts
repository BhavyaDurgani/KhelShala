import { create } from 'zustand';
import type { 
  PackageItem, 
  WarehouseMission, 
  ExecutionResult, 
  ScaleBenchmarkResult, 
  AlgorithmReport,
  SystemStrategyChoice,
  ArchitectRank
} from '../types/algorithm';
import { WAREHOUSE_MISSIONS } from '../data/algorithm/warehouseMissions';
import { runSystemSimulation } from '../engine/algorithm/systemSimulationEngine';
import { runScaleBenchmark } from '../engine/algorithm/scaleBenchmarker';
import { generateAriaAdvice, type AriaAdvice } from '../engine/algorithm/ariaCompanion';
import { SYSTEM_CONCEPTS_CATALOG } from '../data/algorithm/systemConcepts';
import { useStore } from './useStore';

export interface AlgorithmStoreState {
  // Mission & World State
  currentMissionIndex: number;
  currentMission: WarehouseMission;
  packages: PackageItem[];
  selectedPackageId: number | null;
  architectRank: ArchitectRank;

  // System Strategy & Operations Console (ZERO CODING)
  activeStrategy: SystemStrategyChoice;
  executionResult: ExecutionResult | null;
  currentFrameIndex: number;
  isPlayingAnimation: boolean;
  animationSpeedMs: number;

  // Scale Benchmarking
  selectedScaleInput: number;
  scaleResult: ScaleBenchmarkResult | null;

  // Modals & Panels
  isTerminalOpen: boolean;
  isScaleModalOpen: boolean;
  isNPCDialogOpen: boolean;
  isReportModalOpen: boolean;
  isArchiveOpen: boolean;

  // Discovery & ARIA Companion
  ariaAdvice: AriaAdvice[];
  unlockedConceptIds: string[];
  finalReport: AlgorithmReport | null;

  // Actions
  selectMission: (index: number) => void;
  selectStrategy: (strategy: SystemStrategyChoice) => void;
  runSimulationInConsole: () => void;
  runScaleBenchmarkTest: (size: number) => void;
  setFrameIndex: (idx: number) => void;
  toggleAnimationPlayback: () => void;
  openTerminal: () => void;
  closeTerminal: () => void;
  openNPCDialog: () => void;
  closeNPCDialog: () => void;
  openArchive: () => void;
  closeArchive: () => void;
  closeScaleModal: () => void;
  completeMission: () => void;
  resetMission: () => void;
}

function generateMockPackages(count: number, isUnsorted = false): PackageItem[] {
  const categories = ['ELECTRONICS', 'PHARMA', 'LOGISTICS', 'AUTO_PARTS', 'APPAREL'];
  const packages: PackageItem[] = [];

  for (let i = 0; i < count; i++) {
    const id = 10000 + i * 73; // Sorted IDs
    packages.push({
      id,
      code: `PKG-${id}`,
      name: `Cargo Crate #${id}`,
      category: categories[i % categories.length],
      weightKg: Math.round((2.5 + (i % 15) * 0.8) * 10) / 10,
      shelfIndex: i,
      aisle: `Aisle-${Math.floor(i / 10) + 1}`,
      status: 'STORED',
    });
  }

  if (isUnsorted) {
    const seedIds = [95400, 10730, 43210, 82491, 15400, 67890, 23410, 91200, 34500, 54320, 76540, 12340, 87650, 45670, 65430, 21980, 98760, 31415, 59265, 87123, 19283, 74659, 38291, 50192, 61234];
    packages.forEach((pkg, idx) => {
      pkg.id = seedIds[idx % seedIds.length];
      pkg.code = `PKG-${pkg.id}`;
      pkg.name = `Cargo Crate #${pkg.id}`;
    });
  } else {
    const targetId = WAREHOUSE_MISSIONS[0].targetPackageId;
    if (!packages.some(p => p.id === targetId)) {
      packages[Math.floor(packages.length / 2)].id = targetId;
      packages.sort((a, b) => a.id - b.id);
    }
  }

  return packages;
}

export const useAlgorithmStore = create<AlgorithmStoreState>((set, get) => {
  const initialMission = WAREHOUSE_MISSIONS[0];
  const initialStrategy = initialMission.strategies[0];
  const initialPackages = generateMockPackages(25, false);
  const initialAdvice = generateAriaAdvice(initialMission, 'O(N)', 38);

  return {
    currentMissionIndex: 0,
    currentMission: initialMission,
    packages: initialPackages,
    selectedPackageId: null,
    architectRank: 'City Systems Architect',

    activeStrategy: initialStrategy,
    executionResult: null,
    currentFrameIndex: 0,
    isPlayingAnimation: false,
    animationSpeedMs: 600,

    selectedScaleInput: 1000,
    scaleResult: null,

    isTerminalOpen: false,
    isScaleModalOpen: false,
    isNPCDialogOpen: false,
    isReportModalOpen: false,
    isArchiveOpen: false,

    ariaAdvice: initialAdvice,
    unlockedConceptIds: ['concept_binary_search', 'concept_merge_sort'],
    finalReport: null,

    selectMission: (index) => {
      const mission = WAREHOUSE_MISSIONS[index] || WAREHOUSE_MISSIONS[0];
      const isUnsorted = index === 1;
      const pkgs = generateMockPackages(25, isUnsorted);
      const defaultStrat = mission.strategies[0];
      const advice = generateAriaAdvice(mission, defaultStrat.complexity, 38);

      set({
        currentMissionIndex: index,
        currentMission: mission,
        packages: pkgs,
        activeStrategy: defaultStrat,
        executionResult: null,
        ariaAdvice: advice,
        currentFrameIndex: 0,
        isPlayingAnimation: false,
        scaleResult: null,
        finalReport: null,
      });
    },

    selectStrategy: (strategy) => {
      set({
        activeStrategy: strategy,
        executionResult: null,
        currentFrameIndex: 0,
      });
    },

    runSimulationInConsole: () => {
      const { activeStrategy, packages, currentMission, currentMissionIndex } = get();
      const isUnsorted = currentMissionIndex === 1;
      const result = runSystemSimulation(activeStrategy, packages, currentMission.targetPackageId, isUnsorted);
      const advice = generateAriaAdvice(currentMission, activeStrategy.complexity, result.efficiencyScore);

      set({
        executionResult: result,
        ariaAdvice: advice,
        currentFrameIndex: 0,
        isPlayingAnimation: true,
      });
    },

    runScaleBenchmarkTest: (size) => {
      const { activeStrategy } = get();
      const complexity = activeStrategy.complexity;
      const result = runScaleBenchmark(complexity, size);

      set({
        selectedScaleInput: size,
        scaleResult: result,
        isScaleModalOpen: true,
      });
    },

    setFrameIndex: (idx) => set({ currentFrameIndex: idx }),
    toggleAnimationPlayback: () => set((state) => ({ isPlayingAnimation: !state.isPlayingAnimation })),

    openTerminal: () => set({ isTerminalOpen: true }),
    closeTerminal: () => set({ isTerminalOpen: false }),
    openNPCDialog: () => set({ isNPCDialogOpen: true }),
    closeNPCDialog: () => set({ isNPCDialogOpen: false }),
    openArchive: () => set({ isArchiveOpen: true }),
    closeArchive: () => set({ isArchiveOpen: false }),
    closeScaleModal: () => set({ isScaleModalOpen: false }),

    completeMission: () => {
      const { currentMission, executionResult, selectedScaleInput, unlockedConceptIds, currentMissionIndex } = get();
      const initialMs = 8700;
      const finalMs = executionResult ? executionResult.executionTimeMs : 20;
      const finalComplexity = executionResult ? executionResult.timeComplexity : 'O(log N)';
      const concept = SYSTEM_CONCEPTS_CATALOG.find(c => c.unlockedAt.includes(currentMission.title)) || SYSTEM_CONCEPTS_CATALOG[0];

      const report: AlgorithmReport = {
        missionId: currentMission.id,
        algorithmName: executionResult ? executionResult.algorithmName : 'Binary Search O(log N)',
        initialComplexity: 'O(N)',
        finalComplexity,
        initialTimeMs: initialMs,
        finalTimeMs: finalMs,
        itemsProcessed: selectedScaleInput,
        xpEarned: 500,
        efficiencyScore: executionResult ? executionResult.efficiencyScore : 95,
        recommendations: [
          'Binary Search strategy successfully reduced search latency from 8,700ms down to 0.02ms!',
          'Warehouse fulfillment throughput restored to 100%. Express delivery truck dispatched on schedule.',
        ],
        conceptDiscovered: concept,
      };

      useStore.getState().updateGameProgress('game_algorithm_city', currentMissionIndex + 1, report.efficiencyScore * 10, report.xpEarned || 500);

      set({
        finalReport: report,
        isReportModalOpen: true,
        unlockedConceptIds: Array.from(new Set([...unlockedConceptIds, concept.id])),
      });
    },

    resetMission: () => {
      get().selectMission(get().currentMissionIndex);
    },
  };
});
