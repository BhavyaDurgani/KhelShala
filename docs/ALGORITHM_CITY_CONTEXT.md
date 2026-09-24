# System Context & Algorithm Mechanics
## Platform: KhelShala
## Game Module: Algorithm City

---

## 1. Domain Model Overview

```
+-----------------------------------------------------------------------------------+
|                                 ENVIRONMENT                                       |
|  - World ID, Name, Description, Max Items, Unlocked Tiers                         |
|  - Zones (e.g. Aisle 1-5, High-Value Vault, Loading Docks, Conveyor Belts)       |
+-----------------------------------------------------------------------------------+
                                          |
                        +-----------------+-----------------+
                        |                                   |
                        v                                   v
             +---------------------+               +------------------+
             |       MISSION       |               |    NPC STAFF     |
             | - Goal / Challenge  |               | - Supervisor     |
             | - Target Package ID |               | - Senior Dev AI  |
             | - Target Complexity |               | - Dialogue Trees |
             +---------------------+               +------------------+
                        |                                   |
                        +-----------------+-----------------+
                                          |
                                          v
                               +---------------------+
                               |  CODING TERMINAL    |
                               | - User Code         |
                               | - Big-O Profiler    |
                               | - Execution Frames  |
                               +---------------------+
```

---

## 2. Big-O Complexity Calculation & Benchmarking
Algorithms written in the terminal are benchmarked across 4 scale tiers:
- Tier 1: $N = 10$ (Micro scale)
- Tier 2: $N = 1,000$ (Small scale)
- Tier 3: $N = 100,000$ (Medium scale)
- Tier 4: $N = 1,000,000$ (Massive enterprise scale)

### Mathematical Time Complexity Benchmarks:
1. **Constant Time $O(1)$**: $T(N) = c \approx 0.001\text{ms}$ across all tiers.
2. **Logarithmic Time $O(\log_2 N)$**:
   - $N = 1,000 \rightarrow \approx 10$ steps.
   - $N = 1,000,000 \rightarrow \approx 20$ steps ($0.02\text{ms}$).
3. **Linear Time $O(N)$**:
   - $N = 1,000 \rightarrow 1,000$ steps ($0.8\text{ms}$).
   - $N = 1,000,000 \rightarrow 1,000,000$ steps ($180\text{ms}$).
4. **Linearithmic Time $O(N \log_2 N)$**:
   - $N = 1,000,000 \rightarrow 20,000,000$ steps ($350\text{ms}$).
5. **Quadratic Time $O(N^2)$**:
   - $N = 10 \rightarrow 100$ steps.
   - $N = 1,000 \rightarrow 1,000,000$ steps ($150\text{ms}$).
   - $N = 1,000,000 \rightarrow 1,000,000,000,000$ steps ($> 12,000\text{s}$ - **SYSTEM OVERLOAD**).

---

## 3. Algorithm Visualizer Frame Pipeline
When code executes, the visualizer engine records step frames:
```typescript
interface ExecutionFrame {
  stepIndex: number;
  arrayState: number[];
  inspectedIndices: number[];
  eliminatedIndices: number[];
  pivotIndex?: number;
  highlightPackageId?: number;
  message: string;
}
```
During playback, Three.js 3D meshes update positions, color highlights, and scanner beams based on the active frame.

---

## 4. Senior AI Engineer Mentor Hints
Sophia (Senior Dev AI) uses a 3-tier Socratic pipeline:
- **Tier 1 (Socratic Question)**: "Notice how Linear Search checks package 1, then package 2, then package 3... Are we leveraging the fact that package IDs are sorted?"
- **Tier 2 (Algorithmic Concept)**: "If package IDs are sorted, we can use Divide & Conquer (Binary Search). Check the middle package. If the target ID is lower, eliminate the entire right half of the warehouse shelves!"
- **Tier 3 (Implementation Strategy)**: "Set `low = 0` and `high = n - 1`. While `low <= high`, calculate `mid = Math.floor((low + high) / 2)`. If `packages[mid].id === target`, return `mid`!"
