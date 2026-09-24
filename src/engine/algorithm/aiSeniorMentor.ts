import type { WarehouseMission, ComplexityTier } from '../../types/algorithm';

export interface SocraticHint {
  tier: number;
  prompt: string;
  text: string;
}

export function generateSeniorDevHints(
  mission: WarehouseMission,
  _userComplexity: ComplexityTier,
  _inputSize: number
): SocraticHint[] {
  if (mission.id === 'mission_wh_1') {
    return [
      {
        tier: 1,
        prompt: 'Socratic Observation',
        text: 'Notice how your current Linear Search algorithm checks Package 1, then Package 2, then Package 3... Are we taking advantage of the fact that the warehouse packages are ALREADY sorted by ID?',
      },
      {
        tier: 2,
        prompt: 'Algorithmic Strategy',
        text: 'Because package IDs are sorted, we can use Divide & Conquer (Binary Search)! Check the middle package. If target ID #82491 is lower, we can immediately eliminate the entire right half of the warehouse shelves in 1 step.',
      },
      {
        tier: 3,
        prompt: 'Implementation Formula',
        text: 'Initialize `low = 0` and `high = packages.length - 1`. Inside a `while (low <= high)` loop, compute `mid = Math.floor((low + high) / 2)`. If `packages[mid].id === targetId`, return `mid`! Otherwise adjust `low` or `high`.',
      },
    ];
  }

  return [
    {
      tier: 1,
      prompt: 'Performance Analysis',
      text: 'Your current solution algorithm requires checking pairs repeatedly. Can we divide the dataset into smaller partitions?',
    },
    {
      tier: 2,
      prompt: 'Complexity Goal',
      text: 'To process items at scale without system overload, aim for O(N log N) time complexity using Quick Sort or Merge Sort.',
    },
    {
      tier: 3,
      prompt: 'Optimization Guide',
      text: 'Partition the array around a pivot element, recursively sorting elements less than and greater than the pivot.',
    },
  ];
}
