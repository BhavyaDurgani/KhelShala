# Product Requirements Document (PRD)
## Project Platform: KhelShala
## Game Title: Algorithm City (Data Structures & Algorithms Strategy Simulator)

---

## 1. Executive Summary & Vision
**Algorithm City** is an immersive, game-first Data Structures and Algorithms (DSA) learning simulator integrated into the **KhelShala** gamification portal.

Departing strictly from LeetCode, HackerRank, multiple-choice quizzes, or trivia questions, **Algorithm City** places the player in the shoes of a lead Systems Engineer inside a living virtual metropolis. To fix broken real-world infrastructure—from automated fulfillment warehouses to city metro transit networks—the player explores environments, diagnoses bottlenecks, writes algorithms in an in-world coding terminal, visualizes execution step-by-step, tests against $1,000,000+$ items, and optimizes Big-O time and space complexity.

> **Core Philosophy**: *"Algorithms are the hidden engine behind the world. You learn algorithms because you need them to fix broken systems."*
> **Strict Rule**: *ZERO Quizzes. ZERO Multiple-Choice Questions. 100% Real-world Interactive Environments, Coding, Visualization, and Scalability Performance Engineering.*

---

## 2. Key Features & System Requirements

### 2.1 Interactive Game Environments (World 1 MVP: Smart Warehouse)
- **Visual Environment**: A 3D/2.5D modeled warehouse featuring:
  - Warehouse aisles, multi-tier storage shelves, package crates.
  - Animated forklifts, conveyor belts, barcode scanners, delivery trucks, and workers.
  - Interactive engineering terminals, control rooms, and NPC staff.
- **Third-Person / Top-Down Exploration**:
  - The player walks around the environment, talks to NPCs (e.g. *Warehouse Supervisor Marcus*, *Senior Systems Engineer Sophia*), inspects physical package racks, and accesses terminals.

### 2.2 Core Game Loop
$$\text{EXPLORE} \rightarrow \text{OBSERVE} \rightarrow \text{DIAGNOSE} \rightarrow \text{CODE} \rightarrow \text{VISUALIZE} \rightarrow \text{SCALE TEST} \rightarrow \text{OPTIMIZE} \rightarrow \text{DEPLOY} \rightarrow \text{SEE RESULT}$$

### 2.3 Live Algorithm Visualization Engine
- Every algorithm written or selected by the player triggers a synchronized, real-time visual simulation in the game world:
  - **Linear Search $O(n)$**: Scanner moves package-by-package down the shelf, inspecting one item at a time.
  - **Binary Search $O(\log n)$**: Scanner calculates middle pivot, highlights candidate interval, and visually eliminates half of the warehouse shelves in a single pulse!
  - **Bubble / Merge / Quick Sort**: Packages physically rearrange on conveyor belts and shelves with pivot markers and swap animations.
  - **Queue & Priority Queue**: Delivery trucks and emergency shipments queue up in priority order.
  - **Trees & Graphs**: Organizational hierarchies and metro rail tracks traverse via BFS/DFS/Dijkstra highlights.

### 2.4 Big-O Scalability & Performance Profiler
- Correctness is only half the battle. Algorithms are benchmarked against scaling input tiers:
  - Tier 1: $10$ items (Initial test)
  - Tier 2: $1,000$ items (Standard load)
  - Tier 3: $100,000$ items (Heavy load)
  - Tier 4: $1,000,000$ items (Stress test)
- **System Overload Mechanics**:
  - If a player deploys an $O(n^2)$ algorithm at $1,000,000$ items, the system displays a dramatic red **"SYSTEM OVERLOAD - PROCESSING TIMEOUT (8.7s > 0.05s MAX)"** prompt!
  - The player must optimize to $O(n \log n)$ or $O(\log n)$ to restore the system.

### 2.5 In-World Coding Terminal & Multi-Language Sandbox
- Accessible via in-game computer terminals.
- Features:
  - Code Editor with syntax highlighting & auto-indent.
  - Supported Languages: JavaScript, TypeScript, C++ style logic.
  - Run, Debug, and Scale Test controls.
  - Real-time time complexity ($O(1), O(\log n), O(n), O(n \log n), O(n^2)$) and space complexity profiler.

### 2.6 Senior AI Engineer Mentor NPC
- Senior Systems Engineer NPC (**Sophia**) provides 3-tier Socratic progressive hints:
  - *Tier 1 (Socratic Question)*: Directs attention to repeated work or unsorted data.
  - *Tier 2 (Algorithmic Concept)*: Introduces the algorithmic technique (e.g. Divide & Conquer, Two Pointers).
  - *Tier 3 (Optimization Strategy)*: Explains how to implement target complexity.
- 100% free client-side execution.

### 2.7 Post-Mission Performance Report Card
- Summarizes:
  - Initial Algorithm vs Final Algorithm.
  - Initial Time Complexity ($O(n)$) vs Optimized Time Complexity ($O(\log n)$).
  - Execution Time Drop ($8.70\text{s} \rightarrow 0.02\text{s}$).
  - XP earned, Engineering Rank upgrade, and unlocked World Access Passes.

---

## 3. World Taxonomy (World 1 MVP + Roadmap)
- **World 1: The Smart Warehouse** (Arrays, Searching, Sorting, Two Pointers, Binary Search)
- **World 2: Logistics & Freight Terminal** (Queues, Stacks, Priority Queues, Hash Maps)
- **World 3: Corporate HQ Building** (Trees, Binary Search Trees, Heaps, Recursion)
- **World 4: Metro City Transit** (Graphs, BFS, DFS, Dijkstra Shortest Path, Minimum Spanning Tree)
- **World 5: Emergency Response Grid** (Greedy Algorithms, Graph Optimization, Priority Scheduling)
- **World 6: Industrial Energy Facility** (Dynamic Programming, Memoization, Resource Allocation)
