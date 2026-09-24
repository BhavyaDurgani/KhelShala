import type { ScaleBenchmarkResult, ComplexityTier } from '../../types/algorithm';

export function runScaleBenchmark(
  timeComplexity: ComplexityTier,
  inputSize: number
): ScaleBenchmarkResult {
  let simulatedTimeMs = 0;
  let simulatedSteps = 0;
  let status: 'PASSED' | 'OVERLOAD' | 'TIMEOUT' = 'PASSED';
  let message = '';

  if (timeComplexity === 'O(1)') {
    simulatedSteps = 1;
    simulatedTimeMs = 0.01;
    status = 'PASSED';
    message = `Benchmark PASSED in 0.01ms across ${inputSize.toLocaleString()} items.`;
  } else if (timeComplexity === 'O(log N)') {
    simulatedSteps = Math.round(Math.log2(inputSize));
    simulatedTimeMs = Math.round((simulatedSteps * 0.001) * 100) / 100 || 0.02;
    status = 'PASSED';
    message = `Benchmark PASSED! Processed ${inputSize.toLocaleString()} packages in only ${simulatedSteps} steps (${simulatedTimeMs}ms).`;
  } else if (timeComplexity === 'O(N)') {
    simulatedSteps = inputSize;
    simulatedTimeMs = Math.round((inputSize * 0.0087) * 100) / 100;

    if (inputSize >= 1000000) {
      status = 'OVERLOAD';
      message = `CRITICAL SYSTEM OVERLOAD! Linear Search O(N) took ${simulatedTimeMs.toFixed(2)}s on ${inputSize.toLocaleString()} items (Max Deadline: 0.05s). Delivery truck departed!`;
    } else {
      status = 'PASSED';
      message = `Benchmark PASSED in ${simulatedTimeMs}ms on ${inputSize.toLocaleString()} items. (Warning: Will overload at 1,000,000 items).`;
    }
  } else {
    // O(N^2) or higher
    simulatedSteps = inputSize * inputSize;
    simulatedTimeMs = Math.round((inputSize * inputSize * 0.0001) * 100) / 100;

    if (inputSize >= 1000) {
      status = 'OVERLOAD';
      message = `CRITICAL SYSTEM OVERLOAD! Quadratic O(N^2) generated ${simulatedSteps.toLocaleString()} operations. Processing freeze detected!`;
    } else {
      status = 'PASSED';
      message = `Benchmark PASSED in ${simulatedTimeMs}ms on ${inputSize.toLocaleString()} items.`;
    }
  }

  return {
    inputSize,
    executionTimeMs: simulatedTimeMs,
    stepsCount: simulatedSteps,
    status,
    message,
  };
}
