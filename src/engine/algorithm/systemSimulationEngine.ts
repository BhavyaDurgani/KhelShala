import type { PackageItem, ExecutionResult, ExecutionFrame, SystemStrategyChoice } from '../../types/algorithm';

export function runSystemSimulation(
  strategy: SystemStrategyChoice,
  packages: PackageItem[],
  targetId: number,
  isSortingTask: boolean = false
): ExecutionResult {
  const frames: ExecutionFrame[] = [];
  const cumulativeEliminated = new Set<number>();
  let foundIndex = -1;
  let stepCount = 0;
  const N = packages.length;

  const targetIndex = packages.findIndex(p => p.id === targetId);
  const actualTargetIndex = targetIndex !== -1 ? targetIndex : Math.floor(N / 2);

  if (isSortingTask) {
    // -----------------------------------------------------------------------
    // SORTING SYSTEM SIMULATION (Conveyor Belt Priority Operations)
    // -----------------------------------------------------------------------
    if (strategy.complexity === 'O(N^2)') {
      // Bubble / Sequential Swap Strategy (High friction)
      const mockSwaps = Math.min(20, Math.floor((N * (N - 1)) / 4));
      for (let i = 0; i < mockSwaps; i++) {
        stepCount++;
        const idxA = (i * 2) % N;
        const idxB = (i * 2 + 1) % N;
        frames.push({
          stepIndex: stepCount,
          arrayState: packages.map(p => p.id),
          inspectedIndices: [idxA, idxB],
          eliminatedIndices: [],
          pivotIndex: idxA,
          highlightPackageId: packages[idxA]?.id,
          message: `Step ${stepCount}: High friction sequential swap Crate #${packages[idxA]?.id || '?'} ⇄ Crate #${packages[idxB]?.id || '?'}. Conveyor belt jammed at 64% capacity.`,
        });
      }
    } else {
      // Divide-and-Conquer Quick/Merge Sort Strategy (Smooth flow)
      const partitionSteps = Math.min(12, Math.ceil(N * Math.log2(N) / 4));
      for (let i = 0; i < partitionSteps; i++) {
        stepCount++;
        const pivot = Math.floor((i * N) / partitionSteps);
        frames.push({
          stepIndex: stepCount,
          arrayState: packages.map(p => p.id),
          inspectedIndices: [pivot],
          eliminatedIndices: [],
          pivotIndex: pivot,
          highlightPackageId: packages[pivot]?.id,
          message: `Step ${stepCount}: Priority partition sweep on Conveyor Belt. Pivot Crate #${packages[pivot]?.id} routed to express priority lane.`,
        });
      }
    }

    frames.push({
      stepIndex: stepCount + 1,
      arrayState: packages.map(p => p.id),
      inspectedIndices: [],
      eliminatedIndices: [],
      message: `Step ${stepCount + 1}: CONVEYOR BELT SORT COMPLETE! All cargo crates organized by priority with 0 bottlenecks.`,
    });

    const efficiencyScore = strategy.complexity === 'O(N^2)' ? 42 : 94;
    const throughput = strategy.complexity === 'O(N^2)' ? 1200 : 25000;
    const congestion = strategy.complexity === 'O(N^2)' ? 85 : 12;

    return {
      success: true,
      algorithmName: strategy.name,
      timeComplexity: strategy.complexity,
      spaceComplexity: 'O(1)',
      totalSteps: stepCount,
      executionTimeMs: strategy.processingTimeSec * 1000,
      foundIndex: 0,
      efficiencyScore,
      throughputItemsPerMin: throughput,
      workerCongestionPct: congestion,
      deliveryStatus: efficiencyScore >= 80 ? 'ON_TIME' : 'CRITICAL_OVERLOAD',
      underlyingConceptDiscovered: strategy.complexity === 'O(N^2)' ? 'Bubble Sort O(N^2)' : 'Divide & Conquer Merge / Quick Sort O(N log N)',
      frames,
    };
  } else {
    // -----------------------------------------------------------------------
    // SEARCH SYSTEM SIMULATION (Warehouse Fulfillment Lookup)
    // -----------------------------------------------------------------------
    if (strategy.id === 'strategy_manual_scan') {
      // Strategy A: Manual Sequential Inspection (Linear Search)
      for (let i = 0; i <= actualTargetIndex; i++) {
        stepCount++;
        const currentPkg = packages[i];
        const isMatch = i === actualTargetIndex;

        frames.push({
          stepIndex: stepCount,
          arrayState: packages.map(p => p.id),
          inspectedIndices: [i],
          eliminatedIndices: [],
          pivotIndex: i,
          highlightPackageId: currentPkg?.id,
          message: isMatch
            ? `Step ${stepCount}: MATCH FOUND! Target Package #${currentPkg.id} located at Shelf Index ${i} after checking every rack!`
            : `Step ${stepCount}: Worker manually checking Shelf Index ${i} (Crate #${currentPkg.id}). Not a match yet...`,
        });

        if (isMatch) foundIndex = i;
      }
    } else if (strategy.id === 'strategy_block_indexing') {
      // Strategy B: Sectional Block Partitioning (Chunk Indexing)
      const blockSize = Math.max(2, Math.floor(N / 5));
      let targetBlockStart = 0;

      // Step 1: Jump across block boundary markers
      for (let blockStart = 0; blockStart < N; blockStart += blockSize) {
        stepCount++;
        const boundaryPkg = packages[Math.min(blockStart, N - 1)];
        const isTargetInBlock = targetId <= boundaryPkg.id || (blockStart + blockSize >= N);

        frames.push({
          stepIndex: stepCount,
          arrayState: packages.map(p => p.id),
          inspectedIndices: [blockStart],
          eliminatedIndices: Array.from({ length: blockStart }, (_, k) => k),
          pivotIndex: blockStart,
          highlightPackageId: boundaryPkg?.id,
          message: isTargetInBlock
            ? `Step ${stepCount}: SECTIONAL BLOCK MATCH! Target Crate #${targetId} is bounded within Aisle Block [${blockStart}..${Math.min(blockStart + blockSize, N - 1)}]. Searching inside chunk...`
            : `Step ${stepCount}: Checking Aisle Block Boundary #${blockStart} (Crate #${boundaryPkg?.id}). Target is higher → Eliminating Block [0..${blockStart}]`,
        });

        if (isTargetInBlock) {
          targetBlockStart = blockStart;
          break;
        }
      }

      // Step 2: Linear scan within target block chunk
      const endBlock = Math.min(targetBlockStart + blockSize, N);
      for (let i = targetBlockStart; i < endBlock; i++) {
        stepCount++;
        const currentPkg = packages[i];
        const isMatch = i === actualTargetIndex || currentPkg.id === targetId;

        frames.push({
          stepIndex: stepCount,
          arrayState: packages.map(p => p.id),
          inspectedIndices: [i],
          eliminatedIndices: Array.from({ length: targetBlockStart }, (_, k) => k),
          pivotIndex: i,
          highlightPackageId: currentPkg?.id,
          message: isMatch
            ? `Step ${stepCount}: MATCH FOUND IN CHUNK! Target Package #${currentPkg.id} located at Rack Index ${i}!`
            : `Step ${stepCount}: Scanning inside target aisle block: Rack Index ${i} (Crate #${currentPkg?.id})...`,
        });

        if (isMatch) {
          foundIndex = i;
          break;
        }
      }
    } else {
      // Strategy C: Binary Half-Interval Elimination (Binary Search)
      let low = 0;
      let high = N - 1;

      while (low <= high) {
        stepCount++;
        const mid = Math.floor((low + high) / 2);
        const currentPkg = packages[mid];
        const isMatch = currentPkg.id === targetId || mid === actualTargetIndex;

        // Eliminate half the warehouse shelves
        if (currentPkg.id < targetId) {
          for (let k = low; k <= mid; k++) cumulativeEliminated.add(k);
          low = mid + 1;
        } else {
          for (let k = mid; k <= high; k++) cumulativeEliminated.add(k);
          high = mid - 1;
        }

        frames.push({
          stepIndex: stepCount,
          arrayState: packages.map(p => p.id),
          inspectedIndices: [mid],
          eliminatedIndices: Array.from(cumulativeEliminated),
          pivotIndex: mid,
          highlightPackageId: currentPkg?.id,
          message: isMatch
            ? `Step ${stepCount}: MATCH FOUND! Target Package #${currentPkg.id} located at Pivot Mid Index ${mid}!`
            : `Step ${stepCount}: Pivot Mid Index ${mid} (Crate #${currentPkg.id}). ${currentPkg.id < targetId ? 'Target is HIGHER → Eliminating left half [0..' + mid + ']' : 'Target is LOWER → Eliminating right half [' + mid + '..' + (N - 1) + ']'}`,
        });

        if (isMatch) {
          foundIndex = mid;
          break;
        }
      }
    }

    const efficiencyScore = strategy.id === 'strategy_binary_lookup' || strategy.complexity === 'O(log N)'
      ? 98
      : strategy.id === 'strategy_block_indexing'
      ? 68
      : 38;

    const throughput = strategy.id === 'strategy_binary_lookup' || strategy.complexity === 'O(log N)'
      ? 48000
      : strategy.id === 'strategy_block_indexing'
      ? 12500
      : 1500;

    const congestion = strategy.id === 'strategy_binary_lookup' || strategy.complexity === 'O(log N)'
      ? 8
      : strategy.id === 'strategy_block_indexing'
      ? 45
      : 92;

    const conceptDiscovered = strategy.id === 'strategy_binary_lookup' || strategy.complexity === 'O(log N)'
      ? 'Binary Search O(log N)'
      : strategy.id === 'strategy_block_indexing'
      ? 'Chunk Indexing / Jump Search O(√N)'
      : 'Linear Search O(N)';

    return {
      success: foundIndex !== -1,
      algorithmName: strategy.name,
      timeComplexity: strategy.complexity,
      spaceComplexity: 'O(1)',
      totalSteps: stepCount,
      executionTimeMs: strategy.processingTimeSec * 1000,
      foundIndex: foundIndex !== -1 ? foundIndex : actualTargetIndex,
      efficiencyScore,
      throughputItemsPerMin: throughput,
      workerCongestionPct: congestion,
      deliveryStatus: efficiencyScore >= 80 ? 'ON_TIME' : 'DELAYED',
      underlyingConceptDiscovered: conceptDiscovered,
      frames,
    };
  }
}
