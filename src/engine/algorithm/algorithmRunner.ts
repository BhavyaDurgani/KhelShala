import type { PackageItem, ExecutionResult, ExecutionFrame, ComplexityTier } from '../../types/algorithm';

export function runPackageSearchAlgorithm(
  userCode: string,
  packages: PackageItem[],
  targetId: number
): ExecutionResult {
  const startTime = performance.now();
  const frames: ExecutionFrame[] = [];
  const cumulativeEliminated = new Set<number>();
  let foundIndex = -1;
  let stepCount = 0;
  let swapCount = 0;
  const maxSteps = 2500; // Safeguard against infinite loops

  const accessedIndices: number[] = [];

  try {
    // 1. Clean code: strip C++/TS-like syntax (e.g. int low = 0 -> let low = 0)
    const executableCode = userCode
      .replace(/\bint\s+/g, 'let ')
      .replace(/\bfloat\s+/g, 'let ')
      .replace(/\bdouble\s+/g, 'let ')
      .replace(/\bauto\s+/g, 'let ');

    const codeWithoutComments = userCode.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').toLowerCase();
    const isSortingTask = codeWithoutComments.includes('sort') || codeWithoutComments.includes('swap') || codeWithoutComments.includes('temp');

    // Working clone of packages array
    const workingPackages = packages.map(p => ({ ...p }));

    // 2. Wrap packages array in an instrumented Proxy
    const proxyPackages = new Proxy(workingPackages, {
      get(target, prop) {
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
          const idx = Number(prop);
          if (idx >= 0 && idx < target.length) {
            stepCount++;
            if (stepCount > maxSteps) {
              throw new Error(`Infinite Loop Warning: Code executed over ${maxSteps} operations without terminating.`);
            }

            const currentPkg = target[idx];
            const isMatch = currentPkg.id === targetId;

            if (!isSortingTask) {
              // Track range elimination ONLY if binary search pattern jumps (diff > 1)
              if (accessedIndices.length > 0) {
                const prevIdx = accessedIndices[accessedIndices.length - 1];
                if (Math.abs(idx - prevIdx) > 1) {
                  if (idx > prevIdx) {
                    for (let k = 0; k < idx; k++) {
                      if (target[k].id !== targetId) cumulativeEliminated.add(k);
                    }
                  } else if (idx < prevIdx) {
                    for (let k = idx + 1; k < target.length; k++) {
                      if (target[k].id !== targetId) cumulativeEliminated.add(k);
                    }
                  }
                }
              }
            }

            accessedIndices.push(idx);

            // Record execution frame
            frames.push({
              stepIndex: stepCount,
              arrayState: target.map(p => p.id),
              inspectedIndices: [idx],
              eliminatedIndices: Array.from(cumulativeEliminated),
              pivotIndex: idx,
              highlightPackageId: currentPkg?.id,
              message: isSortingTask
                ? `Step ${stepCount}: Inspecting Crate #${currentPkg?.id || '?' } at Index ${idx} on Conveyor Belt.`
                : isMatch
                  ? `Step ${stepCount}: MATCH FOUND! Target Package #${currentPkg.id} located at Shelf Index ${idx}!`
                  : `Step ${stepCount}: Inspected Shelf Index ${idx} (Package #${currentPkg.id}). ${currentPkg.id < targetId ? 'Target is HIGHER →' : 'Target is LOWER →'}`,
            });

            if (isMatch) {
              foundIndex = idx;
            }
          }
        }
        return Reflect.get(target, prop);
      },

      set(target, prop, value) {
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
          const idx = Number(prop);
          if (idx >= 0 && idx < target.length) {
            swapCount++;
            target[idx] = value;
            frames.push({
              stepIndex: stepCount + 1,
              arrayState: target.map(p => p.id),
              inspectedIndices: [idx],
              eliminatedIndices: [],
              pivotIndex: idx,
              highlightPackageId: value?.id,
              message: `Step ${stepCount + 1}: Reordered Crate #${value?.id || '?'} to Index ${idx} on Conveyor Belt.`,
            });
          }
        }
        return Reflect.set(target, prop, value);
      }
    });

    // 3. Dynamic Real-Time Execution of user function
    const runSandbox = new Function('packages', 'targetId', `
      ${executableCode}
      if (typeof sortPackages === 'function') {
        return sortPackages(packages);
      } else if (typeof quickSort === 'function') {
        return quickSort(packages);
      } else if (typeof mergeSort === 'function') {
        return mergeSort(packages);
      } else if (typeof bubbleSort === 'function') {
        return bubbleSort(packages);
      } else if (typeof sort === 'function') {
        return sort(packages);
      } else if (typeof findPackage === 'function') {
        return findPackage(packages, targetId);
      } else if (typeof binarySearch === 'function') {
        return binarySearch(packages, targetId);
      } else if (typeof search === 'function') {
        return search(packages, targetId);
      } else {
        throw new Error("Missing entry function. Define 'sortPackages(packages)' for sorting or 'findPackage(packages, targetId)' for search.");
      }
    `);

    const returnVal = runSandbox(proxyPackages, targetId);
    const endTime = performance.now();

    // Verify foundIndex from returnVal
    let isCorrectMatch = false;
    if (typeof returnVal === 'number' && returnVal >= 0 && returnVal < packages.length) {
      if (packages[returnVal].id === targetId) {
        foundIndex = returnVal;
        isCorrectMatch = true;
      }
    }

    // AST Structure Analysis for Binary Search Divide-and-Conquer
    const hasBinarySearchStructure =
      codeWithoutComments.includes('mid') &&
      (codeWithoutComments.includes('floor') || codeWithoutComments.includes('trunc') || codeWithoutComments.includes('>>') || codeWithoutComments.includes('/ 2') || codeWithoutComments.includes('/2')) &&
      (codeWithoutComments.includes('low') || codeWithoutComments.includes('l') || codeWithoutComments.includes('left')) &&
      (codeWithoutComments.includes('high') || codeWithoutComments.includes('r') || codeWithoutComments.includes('right'));

    // Empirical Worst-Case Benchmark on N=100 array
    let benchmarkSteps = 0;
    let benchmarkSuccess = false;
    try {
      const benchPkgs = Array.from({ length: 100 }, (_, i) => ({ id: 1000 + i * 10 }));
      const lastTargetId = benchPkgs[99].id; // Target at index 99 (worst case)
      const benchProxy = new Proxy(benchPkgs, {
        get(t, p) {
          if (typeof p === 'string' && !isNaN(Number(p))) benchmarkSteps++;
          return Reflect.get(t, p);
        }
      });
      const bRes = runSandbox(benchProxy, lastTargetId);
      if (bRes === 99 || benchPkgs[bRes]?.id === lastTargetId) {
        benchmarkSuccess = true;
      }
    } catch {
      // Ignore benchmark errors
    }

    const N = packages.length;
    let timeComplexity: ComplexityTier = 'O(N)';
    let algorithmName = 'Linear Search O(N)';

    if (isSortingTask) {
      if (stepCount + swapCount > N * Math.ceil(Math.log2(N)) + 20) {
        timeComplexity = 'O(N^2)';
        algorithmName = 'Bubble Sort O(N^2)';
      } else {
        timeComplexity = 'O(N log N)';
        algorithmName = 'Quick / Merge Sort O(N log N)';
      }
    } else {
      // Search Task Complexity Classification
      if (hasBinarySearchStructure && benchmarkSteps > 0 && benchmarkSteps <= 10 && benchmarkSuccess) {
        timeComplexity = 'O(log N)';
        algorithmName = 'Binary Search O(log N)';
      } else {
        timeComplexity = 'O(N)';
        algorithmName = 'Linear Search O(N)';
      }
    }

    // Add correctness check warning frame if target didn't match
    if (!isSortingTask && typeof returnVal === 'number' && returnVal >= 0 && returnVal < packages.length && packages[returnVal].id !== targetId) {
      frames.push({
        stepIndex: stepCount + 1,
        arrayState: packages.map(p => p.id),
        inspectedIndices: [returnVal],
        eliminatedIndices: [],
        message: `⚠️ LOGIC ERROR: Code returned Index ${returnVal} (Package #${packages[returnVal].id}), which does NOT match Target Package #${targetId}!`,
      });
    }

    const totalOps = stepCount + swapCount;
    const efficiency = timeComplexity === 'O(log N)' ? 98 : ((timeComplexity as string) === 'O(1)' ? 100 : (timeComplexity === 'O(N)' ? 65 : 40));

    return {
      success: isSortingTask ? true : isCorrectMatch,
      algorithmName,
      timeComplexity,
      spaceComplexity: 'O(1)',
      totalSteps: totalOps,
      executionTimeMs: Math.max(0.01, Math.round((endTime - startTime) * 100) / 100),
      foundIndex: isSortingTask ? 0 : (foundIndex !== -1 ? foundIndex : (accessedIndices[accessedIndices.length - 1] ?? -1)),
      efficiencyScore: efficiency,
      throughputItemsPerMin: Math.round(60000 / Math.max(1, totalOps)),
      workerCongestionPct: timeComplexity === 'O(log N)' ? 5 : 45,
      deliveryStatus: efficiency > 80 ? 'ON_TIME' : 'DELAYED',
      underlyingConceptDiscovered: timeComplexity === 'O(log N)' ? 'Binary Search Divide-and-Conquer' : 'Linear Sequential Inspection',
      frames: frames.length > 0 ? frames : [{
        stepIndex: 1,
        arrayState: packages.map(p => p.id),
        inspectedIndices: [],
        eliminatedIndices: [],
        message: 'Code executed with 0 array operations.',
      }],
    };
  } catch (err: unknown) {
    const endTime = performance.now();
    const errorMsg = err instanceof Error ? err.message : String(err);

    return {
      success: false,
      algorithmName: 'Execution Error',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      totalSteps: stepCount,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      foundIndex: -1,
      efficiencyScore: 0,
      throughputItemsPerMin: 0,
      workerCongestionPct: 100,
      deliveryStatus: 'CRITICAL_OVERLOAD',
      underlyingConceptDiscovered: 'Runtime Exception',
      error: errorMsg,
      frames: frames.length > 0 ? frames : [{
        stepIndex: 1,
        arrayState: packages.map(p => p.id),
        inspectedIndices: [],
        eliminatedIndices: [],
        message: `COMPILATION / RUNTIME ERROR: ${errorMsg}`,
      }],
    };
  }
}
