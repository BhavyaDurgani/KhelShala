import { create } from 'zustand';
import type { 
  GameRole, 
  CharacterOperative, 
  LevelConfig, 
  Sector, 
  AttackGraph, 
  CyberAttack, 
  LogEntry, 
  SecurityReport,
  MentorHint 
} from '../types/cyber';
import { DEFENDER_OPERATIVES, ATTACKER_PERSONAS } from '../data/cyber/characters';
import { LEVEL_CONFIGS } from '../data/cyber/levels';
import { SECURITY_CONTROLS_CATALOG } from '../data/cyber/securityControls';
import { INCIDENT_ACTIONS } from '../data/cyber/incidentActions';
import { calculateCIAScores } from '../engine/cyber/riskEngine';
import { updateAttackGraphStatuses } from '../engine/cyber/attackGraphEngine';
import { evaluateAIAttackerDecision } from '../engine/cyber/aiAttackerEngine';
import { evaluateAIDefenderDecision } from '../engine/cyber/aiDefenderEngine';
import { generateSocraticHints } from '../engine/cyber/mentorEngine';
import { executeIRAction } from '../engine/cyber/irEngine';
import { calculateEndLevelSecurityReport } from '../engine/cyber/scoringEngine';
import { runCyberDefenseScript, type CyberScriptResult } from '../engine/cyber/cyberRunner';
import { CYBER_CODE_TEMPLATES } from '../data/cyber/cyberCodeTemplates';
import { useStore } from './useStore';

export interface CyberStoreState {
  // Game Setup
  role: GameRole;
  selectedOperative: CharacterOperative;
  selectedPersona: CharacterOperative;
  levelIndex: number;
  currentLevel: LevelConfig;
  gameStatus: 'IDLE' | 'CUTSCENE' | 'PLANNING' | 'SIMULATING' | 'INCIDENT_RESPONSE' | 'COMPLETED' | 'GAMEOVER';

  // In-Game Economy & Stats
  budget: number;
  timeRemaining: number;
  score: number;
  wave: number;

  // Level Entities
  sectors: Sector[];
  attackGraph: AttackGraph;
  activeAttacks: CyberAttack[];

  // Metrics
  confidentiality: number;
  integrity: number;
  availability: number;
  ciaBalanceScore: number;
  totalRisk: number;
  totalRiskReduced: number;

  // Cutscene State
  cutsceneIndex: number;

  // Mentor & Incident State
  activeHints: MentorHint[];
  hintsUsedCount: number;
  selectedIncidentAttack: CyberAttack | null;

  // Logs & Final Report
  logs: LogEntry[];
  finalReport: SecurityReport | null;

  // Real-Time Code Execution Sandbox State
  userCyberCode: string;
  cyberScriptResult: CyberScriptResult | null;
  isCyberTerminalOpen: boolean;

  // Actions
  setRole: (role: GameRole) => void;
  selectOperative: (op: CharacterOperative) => void;
  selectPersona: (persona: CharacterOperative) => void;
  selectLevel: (idx: number) => void;
  startLevel: () => void;
  advanceCutscene: () => void;
  deployControl: (sectorId: string, controlId: string) => void;
  removeControl: (sectorId: string, controlId: string) => void;
  executePlayerAttackNode: (nodeId: string) => void;
  triggerAIAttackWave: () => void;
  triggerIRPhase: (attack: CyberAttack) => void;
  performIRAction: (actionId: string) => void;
  requestMentorHint: (tier: number) => void;
  useTacticalAbility: () => void;
  openCyberTerminal: () => void;
  closeCyberTerminal: () => void;
  setUserCyberCode: (code: string) => void;
  runCyberTerminalScript: () => void;
  tickGameLoop: () => void;
  completeLevel: () => void;
  resetGame: () => void;
}

export const useCyberStore = create<CyberStoreState>((set, get) => ({
  role: 'DEFENDER',
  selectedOperative: DEFENDER_OPERATIVES[0],
  selectedPersona: ATTACKER_PERSONAS[0],
  levelIndex: 0,
  currentLevel: LEVEL_CONFIGS[0],
  gameStatus: 'IDLE',

  budget: LEVEL_CONFIGS[0].budget,
  timeRemaining: LEVEL_CONFIGS[0].maxTime,
  score: 0,
  wave: 1,

  sectors: LEVEL_CONFIGS[0].sectors,
  attackGraph: LEVEL_CONFIGS[0].attackGraph,
  activeAttacks: [],

  confidentiality: 60,
  integrity: 60,
  availability: 100,
  ciaBalanceScore: 100,
  totalRisk: 5000,
  totalRiskReduced: 0,

  cutsceneIndex: 0,
  activeHints: [],
  hintsUsedCount: 0,
  selectedIncidentAttack: null,

  logs: [
    { id: '1', time: '00:00', message: 'CyberCrime City Real-Time Combat Core initialized.', type: 'system' }
  ],
  finalReport: null,

  userCyberCode: CYBER_CODE_TEMPLATES[0].starterCode,
  cyberScriptResult: null,
  isCyberTerminalOpen: false,

  openCyberTerminal: () => {
    const { userCyberCode } = get();
    const result = runCyberDefenseScript(userCyberCode);
    set({ isCyberTerminalOpen: true, cyberScriptResult: result });
  },
  closeCyberTerminal: () => set({ isCyberTerminalOpen: false }),

  setUserCyberCode: (code) => {
    const result = runCyberDefenseScript(code);
    set({ userCyberCode: code, cyberScriptResult: result });
  },

  runCyberTerminalScript: () => {
    const { userCyberCode, activeAttacks, sectors, logs } = get();
    const result = runCyberDefenseScript(userCyberCode);

    let updatedAttacks = [...activeAttacks];
    let updatedSectors = [...sectors];
    const newLogs: LogEntry[] = [...logs];

    if (result.success && result.threatsBlocked > 0) {
      // Mitigate active attacks based on risk reduction pct
      const factor = 1 - (result.riskReductionPct / 100);
      updatedAttacks = activeAttacks.map(atk => ({
        ...atk,
        duration: Math.max(0, Math.round(atk.duration * factor)),
        damagePerSec: Math.max(0, Math.round(atk.damagePerSec * factor)),
      })).filter(atk => atk.duration > 0);

      // Restore health of critical sector
      updatedSectors = sectors.map(sec => ({
        ...sec,
        health: Math.min(100, sec.health + 25),
        status: sec.status === 'CRITICAL' ? 'WARNING' : sec.status,
      }));

      newLogs.unshift({
        id: `log_${Date.now()}`,
        time: '00:04',
        message: `REAL-TIME SCRIPT EXECUTED: Neutered ${result.threatsBlocked} threats (${result.riskReductionPct}% reduction). Rule: ${result.detectedRuleType}.`,
        type: 'defense',
      });
    } else if (result.error) {
      newLogs.unshift({
        id: `log_${Date.now()}`,
        time: '00:04',
        message: `SCRIPT EXECUTION ERROR: ${result.error}`,
        type: 'incident',
      });
    }

    set({
      cyberScriptResult: result,
      activeAttacks: updatedAttacks,
      sectors: updatedSectors,
      logs: newLogs,
    });
  },

  setRole: (role) => set({ role }),
  selectOperative: (op) => set({ selectedOperative: op }),
  selectPersona: (persona) => set({ selectedPersona: persona }),

  selectLevel: (idx) => {
    const lvl = LEVEL_CONFIGS[idx] || LEVEL_CONFIGS[0];
    const initialGraph = updateAttackGraphStatuses(lvl.attackGraph, []);
    const { confidentiality, integrity, availability, ciaBalanceScore, totalRisk, totalRiskReduced } = calculateCIAScores(lvl.sectors, SECURITY_CONTROLS_CATALOG, []);

    set({
      levelIndex: idx,
      currentLevel: lvl,
      budget: lvl.budget,
      timeRemaining: lvl.maxTime,
      sectors: lvl.sectors,
      attackGraph: initialGraph,
      activeAttacks: [],
      confidentiality,
      integrity,
      availability,
      ciaBalanceScore,
      totalRisk,
      totalRiskReduced,
      gameStatus: 'IDLE',
      cutsceneIndex: 0,
      activeHints: [],
      hintsUsedCount: 0,
      finalReport: null,
    });
  },

  startLevel: () => {
    const { currentLevel } = get();
    if (currentLevel.introCutscene && currentLevel.introCutscene.length > 0) {
      set({ gameStatus: 'CUTSCENE', cutsceneIndex: 0 });
    } else {
      set({ gameStatus: 'SIMULATING' });
    }
  },

  advanceCutscene: () => {
    const { currentLevel, cutsceneIndex } = get();
    if (cutsceneIndex + 1 < currentLevel.introCutscene.length) {
      set({ cutsceneIndex: cutsceneIndex + 1 });
    } else {
      set({ gameStatus: 'SIMULATING' });
    }
  },

  deployControl: (sectorId, controlId) => {
    const { sectors, budget, attackGraph, logs } = get();
    const ctrl = SECURITY_CONTROLS_CATALOG.find(c => c.id === controlId);
    if (!ctrl || budget < ctrl.cost) return;

    const updatedSectors = sectors.map(sec => {
      if (sec.id === sectorId && !sec.deployedControlIds.includes(controlId)) {
        return { ...sec, deployedControlIds: [...sec.deployedControlIds, controlId] };
      }
      return sec;
    });

    const allDeployedControlIds = updatedSectors.flatMap(s => s.deployedControlIds);
    const updatedGraph = updateAttackGraphStatuses(attackGraph, allDeployedControlIds);
    const cia = calculateCIAScores(updatedSectors, SECURITY_CONTROLS_CATALOG, get().activeAttacks);

    const newLog: LogEntry = {
      id: `log_${Date.now()}`,
      time: '00:05',
      message: `Deployed "${ctrl.name}" on ${sectors.find(s => s.id === sectorId)?.name} (-$${ctrl.cost}).`,
      type: 'defense',
    };

    set({
      budget: budget - ctrl.cost,
      sectors: updatedSectors,
      attackGraph: updatedGraph,
      ...cia,
      logs: [newLog, ...logs],
    });
  },

  removeControl: (sectorId, controlId) => {
    const { sectors, budget, attackGraph, logs } = get();
    const ctrl = SECURITY_CONTROLS_CATALOG.find(c => c.id === controlId);
    if (!ctrl) return;

    const updatedSectors = sectors.map(sec => {
      if (sec.id === sectorId) {
        return { ...sec, deployedControlIds: sec.deployedControlIds.filter(id => id !== controlId) };
      }
      return sec;
    });

    const refund = Math.round(ctrl.cost * 0.7);
    const allDeployedControlIds = updatedSectors.flatMap(s => s.deployedControlIds);
    const updatedGraph = updateAttackGraphStatuses(attackGraph, allDeployedControlIds);
    const cia = calculateCIAScores(updatedSectors, SECURITY_CONTROLS_CATALOG, get().activeAttacks);

    const newLog: LogEntry = {
      id: `log_${Date.now()}`,
      time: '00:08',
      message: `Decommissioned "${ctrl.name}" on ${sectors.find(s => s.id === sectorId)?.name} (+$${refund} refund).`,
      type: 'defense',
    };

    set({
      budget: budget + refund,
      sectors: updatedSectors,
      attackGraph: updatedGraph,
      ...cia,
      logs: [newLog, ...logs],
    });
  },

  executePlayerAttackNode: (nodeId) => {
    const { attackGraph, sectors, activeAttacks, logs } = get();
    const targetNode = attackGraph.nodes.find(n => n.id === nodeId);
    if (!targetNode || targetNode.status !== 'AVAILABLE') return;

    // Mark node EXECUTED
    const updatedNodes = attackGraph.nodes.map(n => n.id === nodeId ? { ...n, status: 'EXECUTED' as const } : n);
    const allDeployedControlIds = sectors.flatMap(s => s.deployedControlIds);
    const updatedGraph = updateAttackGraphStatuses({ ...attackGraph, nodes: updatedNodes }, allDeployedControlIds);

    const newAttack: CyberAttack = {
      id: `atk_player_${Date.now()}`,
      name: targetNode.name,
      type: targetNode.name,
      targetSectorId: sectors[0]?.id || 'sec_0',
      severity: targetNode.phase === 'IMPACT' ? 'CRITICAL' : targetNode.phase === 'LATERAL_MOVE' ? 'HIGH' : 'MED',
      damagePerSec: targetNode.phase === 'IMPACT' ? 20 : 8,
      duration: targetNode.timeSeconds,
      detected: true,
      attackNodeId: targetNode.id,
    };

    const newLog: LogEntry = {
      id: `log_${Date.now()}`,
      time: '00:10',
      message: `PLAYER EXPLOIT EXECUTED: "${targetNode.name}" (${targetNode.phase}). Cyber attack wave in progress!`,
      type: 'attack',
    };

    set({
      attackGraph: updatedGraph,
      activeAttacks: [...activeAttacks, newAttack],
      logs: [newLog, ...logs],
    });
  },

  triggerAIAttackWave: () => {
    const { attackGraph, sectors, selectedPersona, activeAttacks, logs } = get();
    const decision = evaluateAIAttackerDecision(attackGraph, sectors, selectedPersona.id);

    if (decision.generatedAttack) {
      const newLogs: LogEntry[] = [
        {
          id: `log_${Date.now()}`,
          time: '00:12',
          message: `AI ATTACK WAVE: "${decision.generatedAttack.name}" launched against target sector.`,
          type: 'attack',
        },
        ...logs,
      ];

      set({
        activeAttacks: [...activeAttacks, decision.generatedAttack],
        logs: newLogs,
        gameStatus: 'SIMULATING',
      });
    }
  },

  triggerIRPhase: (attack) => {
    set({
      selectedIncidentAttack: attack,
      gameStatus: 'INCIDENT_RESPONSE',
    });
  },

  performIRAction: (actionId) => {
    const { selectedIncidentAttack, sectors, activeAttacks, budget, logs } = get();
    const action = INCIDENT_ACTIONS.find(a => a.id === actionId);
    if (!action || !selectedIncidentAttack) return;

    const result = executeIRAction(action, selectedIncidentAttack, sectors, activeAttacks, budget);
    const cia = calculateCIAScores(result.updatedSectors, SECURITY_CONTROLS_CATALOG, result.updatedAttacks);

    const newLog: LogEntry = {
      id: `log_${Date.now()}`,
      time: '00:15',
      message: result.message,
      type: 'incident',
    };

    set({
      budget: budget - result.budgetDeducted,
      sectors: result.updatedSectors,
      activeAttacks: result.updatedAttacks,
      selectedIncidentAttack: null,
      gameStatus: 'SIMULATING',
      ...cia,
      logs: [newLog, ...logs],
    });
  },

  requestMentorHint: (tier) => {
    const { currentLevel, sectors, budget, hintsUsedCount, logs } = get();
    const hints = generateSocraticHints(currentLevel, sectors, budget, SECURITY_CONTROLS_CATALOG);
    const targetHint = hints.find(h => h.tier === tier);

    if (targetHint && budget >= targetHint.cost) {
      const newLog: LogEntry = {
        id: `log_${Date.now()}`,
        time: '00:20',
        message: `Socratic Mentor Hint (Tier ${tier}): ${targetHint.text}`,
        type: 'mentor',
      };

      set({
        budget: budget - targetHint.cost,
        hintsUsedCount: hintsUsedCount + 1,
        activeHints: [...get().activeHints, targetHint],
        logs: [newLog, ...logs],
      });
    }
  },

  useTacticalAbility: () => {
    const { selectedOperative, budget, logs } = get();
    if (selectedOperative.id === 'alex_vance') {
      const bonus = 2500;
      const newLog: LogEntry = {
        id: `log_${Date.now()}`,
        time: '00:25',
        message: `Tactical Ability Activated: "${selectedOperative.tacticalAbilityName}" (+$${bonus} budget).`,
        type: 'defense',
      };
      set({ budget: budget + bonus, logs: [newLog, ...logs] });
    }
  },

  tickGameLoop: () => {
    const { timeRemaining, activeAttacks, sectors, role, budget, logs } = get();

    if (timeRemaining <= 0) {
      get().completeLevel();
      return;
    }

    // 1. Tick active attacks duration
    const updatedAttacks = activeAttacks.map(atk => ({
      ...atk,
      duration: Math.max(0, atk.duration - 1),
    })).filter(atk => atk.duration > 0);

    // 2. Real-Time Dual AI Logic (Every 6 seconds)
    if (timeRemaining % 6 === 0) {
      if (role === 'DEFENDER') {
        // AI Attacker continuously probes & launches attacks
        get().triggerAIAttackWave();
      } else if (role === 'ATTACKER') {
        // AI Defender continuously monitors, deploys counter controls & triggers IR!
        const aiDecision = evaluateAIDefenderDecision(sectors, updatedAttacks, budget);

        if (aiDecision.actionType === 'DEPLOY_CONTROL' && aiDecision.targetSectorId && aiDecision.deployedControl) {
          get().deployControl(aiDecision.targetSectorId, aiDecision.deployedControl.id);
        } else if (aiDecision.actionType === 'TRIGGER_IR' && updatedAttacks.length > 0) {
          const irAction = INCIDENT_ACTIONS[0];
          const result = executeIRAction(irAction, updatedAttacks[0], sectors, updatedAttacks, budget);
          const newLog: LogEntry = {
            id: `log_${Date.now()}`,
            time: '00:30',
            message: `REAL-TIME AI DEFENDER COUNTER: ${aiDecision.reasoning}`,
            type: 'defense',
          };
          set({
            sectors: result.updatedSectors,
            activeAttacks: result.updatedAttacks,
            logs: [newLog, ...logs],
          });
        }
      }
    }

    const cia = calculateCIAScores(sectors, SECURITY_CONTROLS_CATALOG, updatedAttacks);

    set({
      timeRemaining: timeRemaining - 1,
      activeAttacks: updatedAttacks,
      ...cia,
    });
  },

  completeLevel: () => {
    const { currentLevel, budget, confidentiality, integrity, availability, totalRiskReduced, hintsUsedCount, levelIndex } = get();
    const budgetUsed = currentLevel.budget - budget;
    const report = calculateEndLevelSecurityReport(
      currentLevel,
      budgetUsed,
      budget,
      confidentiality,
      integrity,
      availability,
      totalRiskReduced,
      1,
      2,
      hintsUsedCount
    );

    useStore.getState().updateGameProgress('game_cybercrime_city', levelIndex + 1, report.finalScore, (levelIndex + 1) * 250);

    set({
      finalReport: report,
      gameStatus: 'COMPLETED',
    });
  },

  resetGame: () => {
    get().selectLevel(0);
  },
}));
