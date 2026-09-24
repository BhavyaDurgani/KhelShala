# Technical Stack & Architecture Document
## Platform: KhelShala
## Game Module: Algorithm City (DSA Interactive Strategy Game)

---

## 1. Core Architecture Overview
**Algorithm City** is built as an isolated, modular game suite hosted within the **KhelShala** gamification portal (`/games/algorithm-city` or via `GameLauncher.tsx`).

```
+-----------------------------------------------------------------------+
|                         KHELSHALA PLATFORM HUB                        |
|  - Router & Layout (Navbar, User Profile, Global Achievements, XP)   |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                 ALGORITHM CITY GAME MODULE CONTAINER                  |
|         React 19 Components + Algorithm Store (`useAlgorithmStore`)   |
+-----------------------------------------------------------------------+
        |                          |                         |
        v                          v                         v
+---------------+        +------------------+       +-------------------+
| SIMULATION    |        | VISUALIZATION    |       | IN-WORLD TERMINAL |
| ENGINE        |        | ENGINE           |       | Code Execution &  |
| Package Search|        | Step-by-Step 3D/ |       | Big-O Profiler    |
| & Sorting     |        | Canvas Animator  |       | Sandbox           |
+---------------+        +------------------+       +-------------------+
        |                          |                         |
        +--------------------------+-------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    SENIOR AI ENGINEER MENTOR NPC                      |
|           Context-Aware Socratic Progressive Hint Engine             |
+-----------------------------------------------------------------------+
```

---

## 2. Technical Stack Specifications

- **UI & Components**: React 19, Lucide React Icons, Tailwind CSS v4.
- **Visual Scene & Rendering**: Three.js / HTML5 Canvas 3D rendering of Warehouse shelves, forklift bots, package crates, conveyor belts, scanner lasers, and search interval elimination highlights.
- **State Management**: Zustand v5 (`useAlgorithmStore` & global `useStore`).
- **In-World Code Terminal Sandbox**: Built-in AST / JavaScript interpreter parsing user code, evaluating loop bounds, and profiling time complexity ($O(1), O(\log n), O(n), O(n \log n), O(n^2)$) and memory usage.
- **Cost**: **$0.00** (100% Free, Open Source, pure client-side execution).

---

## 3. Directory & File Structure

```
src/
├── components/
│   └── game/
│       ├── AlgorithmCityGame.tsx         # KhelShala Game Launcher Wrapper
│       └── algorithm/                     # Algorithm City Game Suite
│           ├── AlgorithmCityMain.tsx      # Main Container & World View
│           ├── Warehouse3DCanvas.tsx      # Three.js 3D Warehouse Environment Visualizer
│           ├── InWorldTerminalModal.tsx   # Code Editor, Sandbox Execution & Big-O Profiler
│           ├── AlgorithmVisualizerBar.tsx # Step-by-Step Search/Sort Animation Controller
│           ├── NPCDialogModal.tsx         # Senior Dev Sophia & Warehouse Supervisor Dialogue
│           ├── ScaleTestModal.tsx         # 10 to 1,000,000 Item Stress Test Suite
│           └── MissionReportModal.tsx     # Post-Mission Performance Report Card
├── engine/
│   └── algorithm/                         # Algorithm City Pure TS Engines
│       ├── warehouse3D.ts                 # Three.js 3D Warehouse Scene Controller
│       ├── algorithmRunner.ts             # Safe JS Code Sandbox & Big-O Profiler
│       ├── algorithmVisualizer.ts         # Step-by-Step State Frame Recorder
│       ├── scaleBenchmarker.ts            # Performance Benchmark Engine (10 to 1M items)
│       └── aiSeniorMentor.ts              # Socratic Senior Engineer Hint Generator
├── data/
│   └── algorithm/                         # Data Catalogs
│       ├── warehouseMissions.ts           # Warehouse Level Missions & Package Data
│       └── npcDialogues.ts                # NPC Character Dialogue Trees
├── store/
│   └── useAlgorithmStore.ts               # Algorithm City Dedicated State Store
└── types/
    └── algorithm.ts                       # Algorithm City TypeScript Domain Interfaces
```
