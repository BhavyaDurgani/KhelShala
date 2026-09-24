# Technical Stack & Architecture Document
## Platform: KhelShala
### Interactive Engineering Simulation Platform

---

## 1. System Architecture Overview

**KhelShala** is built as an interactive simulation web application. It combines **client-side WebGL 3D Three.js rendering** and **2D Phaser Canvas physics** with **Zustand state management**, **Firebase Cloud Infrastructure** (Auth, Firestore, Realtime DB), and **Browser LocalStorage API** for offline persistence.

```
+---------------------------------------------------------------------------------------------------+
|                                      FRONTEND APPLICATION LAYER                                   |
|  - React 19 + TypeScript + React Router v7                                                        |
|  - Tailwind CSS v4 + Glassmorphism UX + Lucide Icons                                              |
|  - Zustand v5 State Stores (`useStore`, `useCyberStore`, `useAlgorithmStore`)                     |
+---------------------------------------------------------------------------------------------------+
                                                  |
        +------------------+----------------------+------------------+------------------+
        |                  |                      |                  |                  |
        v                  v                      v                  v                  v
+---------------+  +---------------+  +---------------+  +---------------+  +---------------+
| THREE.JS WEBGL|  | PHASER 4      |  | REAL-TIME CODE|  | FIREBASE AUTH |  | LOCALSTORAGE  |
| 3D City &     |  | 2D Arcade     |  | TERMINAL      |  | & FIRESTORE   |  | CACHE ENGINE  |
| Warehouse     |  | Physics       |  | Sandbox       |  | OAuth / Sync  |  | Offline Sync  |
+---------------+  +---------------+  +---------------+  +---------------+  +---------------+
```

---

## 2. Complete Technology Stack Specification

### 2.1 Front-End Core Framework
- **React 19** (`react` `v19.2.8`, `react-dom` `v19.2.8`): UI component framework utilizing concurrent rendering capabilities and fast state updates.
- **TypeScript 6.0** (`typescript` `~6.0.2`): Strict static typing across components, simulation engines, and store interfaces.
- **Vite 8.2** (`vite` `v8.2.0`, `@vitejs/plugin-react` `v6.0.4`): Next-generation build tool providing instant Hot Module Replacement (HMR) and optimized production bundling.
- **React Router v7** (`react-router-dom` `v7.18.2`): Declarative client-side routing (`/`, `/dashboard`, `/games`, `/games/:gameSlug`, `/tracks`, `/leaderboard`, `/achievements`, `/profile`).

---

### 2.2 Interactive Game Engines
- **Three.js** (`three` `v0.174.0`, `@types/three` `v0.185.1`): 3D WebGL graphic visualizer engine rendering procedural 3D cyber city sectors, municipal complexes, 3D fulfillment center warehouse shelves, camera pans, laser firewalls, particle systems, and 3D step-by-step array index pointers (`low`, `mid`, `high`).
- **Phaser 4 Engine** (`phaser` `v4.2.1`): Fast 2D HTML5 canvas game engine for sprite animations, tilemap collision detection, arcade physics, and interactive spatial tracking.

---

### 2.3 Styling, UI System & Icons
- **Tailwind CSS v4** (`tailwindcss` `v4.3.3`, `@tailwindcss/postcss` `v4.3.3`): Utility-first CSS framework with native PostCSS processing, custom HSL design tokens, glassmorphism backdrop filters, and responsive layout grids.
- **PostCSS 8 & Autoprefixer** (`postcss` `v8.5.26`, `autoprefixer` `v10.5.4`): CSS transform and vendor prefix pipeline.
- **Lucide React Icons** (`lucide-react` `v1.33.0`): Comprehensive UI icon library.
- **Class Utilities**: `clsx` (`v2.1.1`) & `tailwind-merge` (`v3.6.0`) for clean conditional class compositions.

---

### 2.4 State Management & Data Architecture
- **Zustand v5** (`zustand` `v5.0.15`): Fast, un-opinionated state management across 3 main stores:
  - **`useStore.ts`**: Global user profile, authentication status, anti-farming XP calculation (`actualXPAwarded = Math.max(0, xpEarned - previousXP)`), tracks, achievements, notifications.
  - **`useCyberStore.ts`**: CyberCity sectors, 3D attack graph, security budget, CIA triad balance metrics, Socratic mentor hints, and cyber code terminal sandbox.
  - **`useAlgorithmStore.ts`**: Warehouse package arrays, algorithm strategies, 3D execution frames, Big-O profiler, and NPC dialogues.
- **Local Storage Storage Engine**: Client-side storage persistence (`localStorage.getItem('khelshala_user')`) guaranteeing persistent player profile synchronization ("Bhavya Durgani") offline.

---

### 2.5 Backend, Cloud Database & Authentication Layer
- **Firebase Platform** (`firebase` `v12.19.0`):
  - **Firebase Authentication**: Email/Password and Google OAuth 2.0 Sign-In (`signInWithPopup`).
  - **Cloud Firestore**: Document store for user profiles, preferences, and game progress logs.
  - **Firebase Realtime Database (RTDB)**: Real-time telemetry pub/sub stream for live multiplayer / leaderboard state.
- **Browser LocalStorage API**: Fallback local storage engine keeping player state persistent across offline reloads.
- *(Note: Prisma schema files in `backend/prisma/schema.prisma` are optional data model blueprints provided for relational database extensions).*

---

### 2.6 Code Quality & Verification
- **Oxlint** (`oxlint` `v1.75.0`): Fast Rust-based linter for static code analysis.
- **TypeScript Compiler** (`typescript` `~6.0.2`): Strict build validation via `npx tsc -b`.

---

## 3. Directory & File Structure Map

```
KhelShala/
├── backend/
│   └── prisma/
│       └── schema.prisma                   # Optional Prisma ORM Models Blueprint
├── docs/                                   # Documentation Specifications
│   ├── CONTEXT.md                          # Domain Mechanics & Math Equations
│   ├── PRD.md                              # Product Requirements Document
│   └── TECH_STACK.md                       # Complete Technical Stack Specification
├── public/                                 # Static Assets & Icons
├── src/
│   ├── components/
│   │   ├── auth/                           # Authentication Dialogs
│   │   │   └── AuthModal.tsx               # Login / Signup / Google OAuth
│   │   ├── common/                         # Shared Components
│   │   │   ├── GameCard.tsx                # Game Card Component
│   │   │   ├── ProgressBar.tsx             # Animated Progress Bar
│   │   │   ├── QuickRulesModal.tsx         # Universal Rules Modal
│   │   │   └── XPBadge.tsx                 # XP & Level Display Pill
│   │   ├── game/                           # Game Arenas & Engines
│   │   │   ├── GameLauncher.tsx            # Arena Router Launcher
│   │   │   ├── ai/                         # AI & Data Engineering Arena
│   │   │   │   └── AINeuralPipelineGame.tsx # Neural Network & ETL Pipeline
│   │   │   ├── algorithm/                  # Software Engineering Arena
│   │   │   │   ├── AlgorithmCityMain.tsx   # Container & Controller
│   │   │   │   ├── Warehouse3DCanvas.tsx   # Three.js 3D Visualizer Canvas
│   │   │   │   ├── OperationsConsolePanel.tsx # Strategy & Console Panel
│   │   │   │   ├── SystemArchivePanel.tsx  # Concept Knowledge Catalog
│   │   │   │   ├── AlgorithmVisualizerBar.tsx # Step Playback Bar
│   │   │   │   ├── ScaleTestModal.tsx      # Big-O Scalability Profiler
│   │   │   │   ├── NPCDialogModal.tsx      # ARIA & Marcus Dialogues
│   │   │   │   └── MissionReportModal.tsx  # Completion Scorecard
│   │   │   ├── cloud/                      # Cloud & DevOps Arena
│   │   │   │   └── CloudDevOpsGame.tsx     # Microservices & SLA Grid
│   │   │   ├── cybercrime/                 # Cybersecurity Arena
│   │   │   │   ├── CyberCityMain.tsx       # Arena Container & Mode Switcher
│   │   │   │   ├── CyberCity3DCanvas.tsx   # Three.js 3D Cyber City Visualizer
│   │   │   │   ├── DefenderView.tsx        # Defender Control Deployment
│   │   │   │   ├── AttackerView.tsx        # Attacker Interactive Attack Tree
│   │   │   │   ├── CyberTerminalModal.tsx  # In-Game Code Runner Terminal
│   │   │   │   ├── CharacterSelectModal.tsx # Character & Persona Selector
│   │   │   │   ├── CinematicCutsceneOverlay.tsx # Level Intro Story Cutscene
│   │   │   │   ├── IncidentResponseModal.tsx # IR Phase Mitigation Dialog
│   │   │   │   ├── AIMentorChatbot.tsx     # Socratic AI Hinting Chatbot
│   │   │   │   └── EndLevelReportModal.tsx # Security Assessment Report
│   │   │   └── robotics/                   # Robotics Arena
│   │   │       └── RoboticsKinematicsGame.tsx # 3-DOF Arm & PID Damping
│   │   └── layout/                         # Shell Layout
│   │       ├── Navbar.tsx                  # Header Navigation Bar
│   │       └── Footer.tsx                  # Platform Footer
│   ├── data/                               # Static Catalogs & Mock Data
│   │   ├── mockData.ts                     # Tracks, Games, Badges, Leaderboard
│   │   ├── algorithm/                      # Missions, Strategies, Concepts
│   │   └── cyber/                          # Levels, Security Controls, Vectors
│   ├── engine/                             # Engine Logic & Math
│   │   ├── algorithm/                      # Benchmarker & Frame Pipeline
│   │   ├── common/                         # Sound Effects Synthesizer
│   │   └── cyber/                          # Risk Engine, AI Attacker/Defender
│   ├── pages/                              # Main Pages
│   │   ├── HomePage.tsx                    # Hero with Skill Telemetry Matrix
│   │   ├── DashboardPage.tsx               # Learner Dashboard & Activity Log
│   │   ├── GamesPage.tsx                   # Games Catalog & Search
│   │   ├── GameDetailPage.tsx              # Game Briefing & Level Unlock List
│   │   ├── TracksPage.tsx                  # Engineering Tracks Page
│   │   ├── LeaderboardPage.tsx             # Live Global Leaderboard
│   │   ├── AchievementsPage.tsx            # Badge Catalog & Track Filter Pills
│   │   └── ProfilePage.tsx                 # Profile & Skill Breakdown
│   ├── services/                           # API & Auth Services
│   │   ├── api.ts                          # Client Game Session API
│   │   ├── authService.ts                  # Firebase / Local Auth Bridge
│   │   └── firebase.ts                     # Firebase SDK Configuration
│   ├── store/                              # Zustand State Stores
│   │   ├── useStore.ts                     # Main Store (User, Progress, XP, Badges)
│   │   ├── useCyberStore.ts                # Cybercrime City Store
│   │   └── useAlgorithmStore.ts            # Algorithm City Store
│   ├── types/                              # TypeScript Interfaces
│   └── App.tsx                             # Main Router & Entry Point
├── package.json                            # Front-End Dependencies & Scripts
└── vite.config.ts                          # Vite Bundler Configuration
```

---

## 4. Build, Verification & Production Commands

- **Development Server**:
  ```bash
  npm run dev
  ```
- **Type Check Validation**:
  ```bash
  npx tsc -b
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Linter**:
  ```bash
  npm run lint
  ```
