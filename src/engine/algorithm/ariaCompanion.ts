import type { WarehouseMission } from '../../types/algorithm';

export interface AriaAdvice {
  tier: number;
  type: 'OBSERVATION' | 'GUIDED_INQUIRY' | 'STRATEGY_HINT' | 'CONCEPT_REVEAL';
  title: string;
  message: string;
}

export function generateAriaAdvice(
  mission: WarehouseMission,
  _currentComplexity?: string,
  _efficiencyScore?: number
): AriaAdvice[] {
  if (mission.id === 'mission_wh_1') {
    return [
      {
        tier: 1,
        type: 'OBSERVATION',
        title: 'PHYSICAL BOTTLENECK OBSERVATION',
        message: 'Forklift operators are currently checking shelf racks one by one from left to right. When volume hits 50,000 packages, searching linearly takes 8.7 seconds per item, causing express delivery trucks to depart late.',
      },
      {
        tier: 2,
        type: 'GUIDED_INQUIRY',
        title: 'STRATEGIC SYSTEM QUESTION',
        message: 'The packages are already ordered on the main shelves by ID. If crate #82491 is higher than crate #25000 at the midpoint of the warehouse, do we really need to inspect rows 1 through 25,000?',
      },
      {
        tier: 3,
        type: 'STRATEGY_HINT',
        title: 'SYSTEM ARCHITECT CONFIGURATION',
        message: 'Open your Barcode Operations Console and configure Strategy C: Binary Half-Interval Elimination. By jumping directly to the middle index and eliminating half the uninspected shelves at every step, warehouse lookup time drops from 8,700ms down to 0.02ms!',
      },
      {
        tier: 4,
        type: 'CONCEPT_REVEAL',
        title: 'CONCEPT DISCOVERED: BINARY SEARCH O(log N)',
        message: 'By repeatedly eliminating half of the remaining search space, you unlocked Binary Search. On 1,000,000 items, instead of 1,000,000 checks, it takes at most 20 checks!',
      },
    ];
  } else {
    return [
      {
        tier: 1,
        type: 'OBSERVATION',
        title: 'CONVEYOR BELT BOTTLENECK',
        message: 'Incoming priority crates are jamming the central conveyor belt. Sequential pairwise sorting (Bubble Sort O(N^2)) creates massive backlogs when crate volume exceeds 10,000 items.',
      },
      {
        tier: 2,
        type: 'GUIDED_INQUIRY',
        title: 'STRATEGIC PARTITIONING QUESTION',
        message: 'What if we divide the conveyor stream into high-priority and low-priority sub-lanes using a pivot crate, rather than swapping adjacent crates one by one?',
      },
      {
        tier: 3,
        type: 'STRATEGY_HINT',
        title: 'SYSTEM ARCHITECT CONFIGURATION',
        message: 'Configure Strategy B: Priority Divide-and-Conquer Partitioning in your Conveyor Operations Console to achieve O(N log N) linearithmic throughput with zero conveyor jams!',
      },
      {
        tier: 4,
        type: 'CONCEPT_REVEAL',
        title: 'CONCEPT DISCOVERED: MERGE / QUICK SORT O(N log N)',
        message: 'Divide and conquer breaks down massive unsorted streams into manageable halves, reducing sorting complexity from O(N^2) down to O(N log N).',
      },
    ];
  }
}
