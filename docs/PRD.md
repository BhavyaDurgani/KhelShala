# Product Requirements Document (PRD)
## Project Platform: KhelShala
### Tagline: Gamified Interactive Engineering Simulation Portal
#### Event / Scope: Production Educational Platform / Smart India Hackathon (SIH)

---

## 1. Executive Summary & Product Vision

**KhelShala** is an immersive, gamified educational platform that replaces static quizzes and plain markdown documentation with **interactive WebGL 3D environments, real-time code execution sandboxes, dynamic strategy simulations, and AI-driven Socratic mentoring**.

> **Core Philosophy**: *"Every engineering decision has a trade-off, and every unmonitored system has a consequence."*  
> **Open-Source Guarantee**: *100% Free & Open-Source. Runs entirely client-side with zero required API keys, paid cloud backends, or hidden subscription fees.*

---

## 2. Core Platform Capabilities & Modules

### 2.1 Technology Track Architecture
KhelShala delivers specialized interactive simulation modules across 5 core engineering technology domains:
1. **Cybersecurity & Network Defense** (`cybersecurity`)
2. **Software Engineering & DSA** (`software_engineering`)
3. **AI & Data Engineering** (`ai_data_engineering`)
4. **Cloud & DevOps Architecture** (`cloud_devops`)
5. **Robotics & Autonomous Systems** (`robotics`)

---

### 2.2 Playable Character Operatives & Personas
- **DEFENDER OPERATIVES**:
  - **Commander Alex Vance (CISO)**: Passive Perk - 15% discount on SOC & SIEM deployments; Tactical Ability: *Emergency Budget Injection (+$2,500)*.
  - **Maya Patel (Lead IR Specialist)**: Passive Perk - 25% faster incident recovery time; Tactical Ability: *Rapid Quarantine Burst*.
  - **Dr. Evelyn Reed (Cryptographer & Compliance)**: Passive Perk - +20% Integrity resilience; Tactical Ability: *Immutable Vault Shield*.
- **ATTACKER PERSONAS**:
  - **Phantom_X (Nation-State APT Operator)**: Stealth-focused, excels at zero-day exploits & lateral movement.
  - **Viper (Ransomware Syndicate Lead)**: High-impact double-extortion ransomware payloads.
  - **Insider Zero (Disgruntled Employee)**: High initial access success, low initial detection probability.

---

### 2.3 Interactive 3D WebGL Visualization Engine (Three.js)
- **Real-Time WebGL Visualizers**:
  - **Cyber City**: 3D municipal sector complexes (Power Grid, Financial Exchange, Smart Transit, Healthcare Vaults), animated operative patrols, holographic laser firewalls, 3D attack graph beams.
  - **Algorithm City**: 3D fulfillment warehouse shelves, conveyor belt packages, 3D step-by-step array index pointers (`high`, `low`, `mid`), scanner beams.
- **Dynamic Crisis Scene Lighting**:
  - **Normal State**: Ambient cyber blue illumination, active data streams.
  - **Alert State**: Red strobe strobe lights, breach sirens, target camera zoom onto compromised nodes.

---

### 2.4 Developer Skill Telemetry Matrix & Profile Evaluator
Located on the `HomePage.tsx` hero section, this interactive widget features:
- Live real-time diagnostic scan simulations.
- Interactive telemetry evaluation buttons.
- Dynamic skill radar gauges across Python/TS, Systems Arch, Cloud SLA, Algorithmic Big-O, and Cyber Defense.
- Streak multiplier boost triggers.

---

### 2.5 Universal Level Lock & Sequential Progression System
- On `GameDetailPage.tsx`, Level $N$ requires completion of Level $N-1$:
  - Unlocked levels display `UNLOCKED`.
  - Locked levels display `🔒 COMPLETE LEVEL N-1 TO UNLOCK`.
- Action buttons dynamically render `NEXT ENVIRONMENT LEVEL` if a subsequent level exists, or `🔒 NEXT LEVEL COMING SOON` when the maximum level tier is reached.

---

### 2.6 Universal Quit Game Option & Session Exhaustion Prompts
- All 5 game modules feature a **`QUIT GAME`** button in the header bar.
- Clicking **QUIT GAME** prompts the player: *"Quit Interactive Simulation? Cancel & Resume or Quit & View Result"*.
- **Defender Budget Exhaustion**: When security budget reaches **$0**, an automated prompt asks the player whether to continue defending or end session & view the final report.
- **Attacker All Vectors Executed**: When 100% of attack nodes are executed, an automated prompt asks the player whether to observe telemetry or end session & view the final report.

---

### 2.7 Interactive Simulation Arenas (5 Complete Games)

1. **Cybercrime City**:
   - 3D Cyber City combat canvas, Dual-Role (Defender vs AI Attacker / Attacker vs AI Defender), Risk Engine, CIA Balance meter, Real-Time Cyber Code Terminal (`CyberTerminalModal.tsx`).
2. **Algorithm City**:
   - 3D Warehouse Fulfillment & Conveyor Belt Sorting, Operations Console, In-World Coding Terminal (Binary Search, QuickSort, MergeSort), Step Playback Bar, Big-O Scalability Stress Test up to 1,000,000 items.
3. **Neural Net & Data Pipeline Lab**:
   - Deep neural network layer builder (1-5 layers, 16-256 nodes), streaming ETL feature normalizers (Z-score vs Min-Max), hyperparameter tuning, live epoch training loop (> 98.5% accuracy target).
4. **CloudReliability Grid**:
   - Multi-region pod clusters (US-East, EU-Central, AP-South), NGINX proxy load balancing strategies, Kubernetes HPA auto-scaling, datacenter fiber outage simulation, SLA 99.999% uptime benchmark.
5. **Robotics Kinematics: Vector Realm**:
   - 3-DOF planar robot arm, forward & inverse kinematics, closed-loop PID controller tuning ($K_p, K_i, K_d$), obstacle avoidance, distance precision error (< 12mm), overshoot dampening (< 3%).

---

### 2.8 Anti-XP Farming Delta Deduplication System
- To prevent infinite XP farming upon replaying or re-submitting games:
  - `updateGameProgress` calculates `actualXPAwarded = Math.max(0, xpEarned - previousXP)`.
  - **First Completion**: Full XP (+250 XP) awarded to user account.
  - **Replays**: `0 XP` added to total XP while preserving highest score.
  - **Notifications**: Emits `🌟 XP Earned!` on new XP, or `🎯 Replayed Level` when highest score is retained.

---

### 2.9 User Profile & Persistent Authentication System
- Supports local storage persistence (`khelshala_user`) alongside optional Firebase Authentication (Email/Password & Google Auth).
- Preserves logged-in player handle ("Bhavya Durgani") across browser refreshes and page navigation.
- Profile Page includes level badges, avatar selection, track skill mastery progress bars, recent activity log, and profile edit drawers.

---

### 2.10 Badges & Achievements System
- Filter pills on `AchievementsPage.tsx` directly map to platform technology tracks:
  - `All Badges`, `Cybersecurity Badges`, `Software Engineering Badges`, `AI Engineering Badges`, `Cloud DevOps Badges`, `Robotics Badges`, `General Badges`, `Mastery Badges`, `Speed Badges`.

---

## 3. Non-Functional Requirements

- **Performance**: 60 FPS WebGL 3D rendering with smooth camera pans and particle animations.
- **Bundle Optimization**: Production bundle compiles cleanly via Vite in $< 4.0\text{s}$ with zero TypeScript errors (`tsc -b`).
- **Design System**: High-contrast cyberpunk dark mode aesthetic, HSL glowing accents, glassmorphism HUD cards, responsive mobile grid layouts.
- **Cost**: **$0.00** (Pure client-side execution, open-source).
