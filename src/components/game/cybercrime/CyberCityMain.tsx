import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Skull, 
  DollarSign, 
  Clock, 
  Zap, 
  ArrowLeft,
  Terminal,
  Activity,
  Compass,
  BookOpen,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { useCyberStore } from '../../../store/useCyberStore';
import { CyberCity3DCanvas } from './CyberCity3DCanvas';
import { DefenderView } from './DefenderView';
import { AttackerView } from './AttackerView';
import { CharacterSelectModal } from './CharacterSelectModal';
import { CinematicCutsceneOverlay } from './CinematicCutsceneOverlay';
import { IncidentResponseModal } from './IncidentResponseModal';
import { EndLevelReportModal } from './EndLevelReportModal';
import { AIMentorChatbot } from './AIMentorChatbot';
import { CyberTerminalModal } from './CyberTerminalModal';
import { QuickRulesModal } from '../common/QuickRulesModal';
import { LEVEL_CONFIGS } from '../../../data/cyber/levels';

export const CyberCityMain: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  const store = useCyberStore();
  const [selectedSectorId, setSelectedSectorId] = useState<string>(store.sectors[0]?.id || 'sec_0');
  const [isCharSelectOpen, setIsCharSelectOpen] = useState<boolean>(true);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  const [showBudgetPrompt, setShowBudgetPrompt] = useState<boolean>(false);
  const [hasPromptedBudget, setHasPromptedBudget] = useState<boolean>(false);
  const [showAttacksExhaustedPrompt, setShowAttacksExhaustedPrompt] = useState<boolean>(false);
  const [hasPromptedAttacks, setHasPromptedAttacks] = useState<boolean>(false);

  // Defender Budget Exhaustion Detector
  useEffect(() => {
    if (store.role === 'DEFENDER' && store.budget <= 0 && store.gameStatus === 'SIMULATING' && !hasPromptedBudget) {
      setShowBudgetPrompt(true);
      setHasPromptedBudget(true);
    }
  }, [store.role, store.budget, store.gameStatus, hasPromptedBudget]);

  // Attacker All Vectors Executed Detector
  useEffect(() => {
    if (store.role === 'ATTACKER' && store.gameStatus === 'SIMULATING' && !hasPromptedAttacks) {
      const allDone = store.attackGraph.nodes && store.attackGraph.nodes.length > 0 && store.attackGraph.nodes.every(n => n.status === 'EXECUTED' || n.status === 'BLOCKED');
      if (allDone) {
        setShowAttacksExhaustedPrompt(true);
        setHasPromptedAttacks(true);
      }
    }
  }, [store.role, store.attackGraph, store.gameStatus, hasPromptedAttacks]);

  const handleEndSessionEarly = () => {
    store.completeLevel();
    setShowQuitConfirm(false);
    setShowBudgetPrompt(false);
    setShowAttacksExhaustedPrompt(false);
  };

  // Real-Time Game Loop Ticker
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (store.gameStatus === 'SIMULATING' || store.gameStatus === 'PLANNING') {
      timer = setInterval(() => {
        store.tickGameLoop();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [store.gameStatus, store.role]);

  const currentCutscene = store.currentLevel.introCutscene?.[store.cutsceneIndex];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans select-none overflow-x-hidden p-4 space-y-4">
      {/* ========================================================================= */}
      {/* SECTION 1: TOP UI CARDS & HEADER                                           */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                onClick={onExit}
                className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-cyan-400" />
                <h1 className="text-xl font-extrabold text-white tracking-tight">CYBERCRIME CITY</h1>
                <span className="rounded-full bg-cyan-950 px-3 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 animate-spin text-cyan-400" /> 3D REAL-TIME COMBAT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{store.currentLevel.title}</p>
            </div>
          </div>

          {/* Level & Role Switcher + Terminal Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowRules(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 font-bold text-amber-400 font-mono hover:bg-amber-500/25 transition-all text-xs"
            >
              <BookOpen className="h-4 w-4" /> 📜 RULES & MANUAL
            </button>

            <button
              onClick={() => setShowQuitConfirm(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-3.5 py-2 font-bold text-rose-400 font-mono hover:bg-rose-500/25 transition-all text-xs"
            >
              <LogOut className="h-4 w-4" /> QUIT GAME
            </button>

            <button
              onClick={store.openCyberTerminal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 px-3.5 py-2 font-bold text-slate-950 shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all text-xs"
            >
              <Terminal className="h-4 w-4 fill-current" /> CYBER CODE TERMINAL
            </button>

            <select
              value={store.levelIndex}
              onChange={(e) => store.selectLevel(Number(e.target.value))}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {LEVEL_CONFIGS.map((lvl, idx) => (
                <option key={lvl.id} value={idx}>
                  {lvl.title}
                </option>
              ))}
            </select>

            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => store.setRole('DEFENDER')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  store.role === 'DEFENDER'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="h-3.5 w-3.5" /> DEFENDER (AI ATTACKER)
              </button>
              <button
                onClick={() => store.setRole('ATTACKER')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  store.role === 'ATTACKER'
                    ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Skull className="h-3.5 w-3.5" /> ATTACKER (AI DEFENDER)
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Status Meters */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {/* Budget */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">SECURITY BUDGET</span>
            <div className="flex items-center gap-2 mt-1">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <span className="text-xl font-bold text-white font-mono">${store.budget.toLocaleString()}</span>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">REAL-TIME CLOCK</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-5 w-5 text-cyan-400" />
              <span className="text-xl font-bold text-white font-mono">{store.timeRemaining}s</span>
            </div>
          </div>

          {/* Operative Ability */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">TACTICAL PERK</span>
            <button
              onClick={store.useTacticalAbility}
              className="mt-1 flex w-full items-center justify-between rounded-lg bg-cyan-950 px-3 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 transition-colors"
            >
              <span className="truncate">{store.selectedOperative.tacticalAbilityName}</span>
              <Zap className="h-4 w-4 shrink-0 text-amber-400" />
            </button>
          </div>

          {/* CIA Equilibrium */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 md:col-span-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
              <span>CIA TRIAD EQUILIBRIUM</span>
              <span className="text-cyan-400">{store.ciaBalanceScore}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
              <div className="rounded bg-slate-950 p-1.5 border border-cyan-500/20 text-cyan-400">
                C: {store.confidentiality}%
              </div>
              <div className="rounded bg-slate-950 p-1.5 border border-emerald-500/20 text-emerald-400">
                I: {store.integrity}%
              </div>
              <div className="rounded bg-slate-950 p-1.5 border border-amber-500/20 text-amber-400">
                A: {store.availability}%
              </div>
            </div>
          </div>
        </div>

        {/* Mission Briefing Banner ("What To Do Next") */}
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-900 p-3.5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-400 border border-cyan-500/40 shrink-0">
              <Compass className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-cyan-300 text-xs tracking-wide flex items-center gap-2">
                  MISSION BRIEFING & WHAT TO DO NEXT
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  Role: <strong className="text-white uppercase">{store.role}</strong>
                </span>
              </div>

              {store.role === 'DEFENDER' ? (
                <div className="mt-1 text-xs text-slate-200 space-y-0.5">
                  <p>
                    <strong className="text-cyan-400">Step 1:</strong> Inspect sector <span className="font-bold text-white">"Remote Workstation"</span> (Current Risk: <span className="text-rose-400 font-bold">$2,730</span>).
                  </p>
                  <p>
                    <strong className="text-cyan-400">Step 2:</strong> From the <span className="text-white font-semibold">Security Control Catalog</span> below, click <span className="font-bold text-cyan-300">"Deploy"</span> next to <em>Multi-Factor Authentication (MFA)</em> or <em>Firewall</em> to shield the 3D sector before the AI Attacker executes an exploit!
                  </p>
                </div>
              ) : (
                <div className="mt-1 text-xs text-slate-200 space-y-0.5">
                  <p>
                    <strong className="text-rose-400">Step 1:</strong> Inspect the <span className="text-white font-semibold">Attack Graph</span> below for unlocked nodes.
                  </p>
                  <p>
                    <strong className="text-rose-400">Step 2:</strong> Click <span className="font-bold text-rose-300">"EXECUTE EXPLOIT"</span> on <em>"OSINT & Social Engineering"</em> to launch your attack against the AI Defender in real-time!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: CENTER STAGE - 100% UNOBSTRUCTED 3D WEBGL CITY SCENE             */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl">
        <div className="relative h-[420px] w-full rounded-2xl border-2 border-cyan-500/40 bg-slate-950 overflow-hidden shadow-2xl shadow-cyan-500/10">
          <CyberCity3DCanvas
            sectors={store.sectors}
            attackGraph={store.attackGraph}
            onSectorSelect={(id) => setSelectedSectorId(id)}
          />
          <div className="absolute top-3 left-4 z-10 flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            <span>● 3D CITYSCAPE & SECTOR MAP (CLICK SECTOR TO SELECT)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: BOTTOM UI CARDS & CONTROLS                                    */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Real-Time Combat Event Ticker */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-1 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Terminal className="h-3.5 w-3.5" /> LIVE COMBAT LOG & REAL-TIME EVENT STREAM
            </span>
            <span className="text-emerald-400 animate-pulse">● LIVE TICKER</span>
          </div>

          <div className="max-h-24 overflow-y-auto space-y-1 font-mono pr-1">
            {store.logs.map(log => (
              <div
                key={log.id}
                className={`text-[11px] leading-tight ${
                  log.type === 'attack' ? 'text-rose-400' :
                  log.type === 'defense' ? 'text-cyan-300' :
                  log.type === 'incident' ? 'text-amber-300' :
                  'text-slate-400'
                }`}
              >
                <span className="text-slate-600">[{log.time}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Mode View Container (Defender or Attacker) */}
        <div>
          {store.role === 'DEFENDER' ? (
            <DefenderView
              sectors={store.sectors}
              budget={store.budget}
              onDeployControl={(secId, ctrlId) => store.deployControl(secId, ctrlId)}
              onRemoveControl={(secId, ctrlId) => store.removeControl(secId, ctrlId)}
              selectedSectorId={selectedSectorId}
              onSelectSector={(id) => setSelectedSectorId(id)}
            />
          ) : (
            <AttackerView
              attackGraph={store.attackGraph}
              onLaunchAttackWave={store.triggerAIAttackWave}
              onExecuteNode={(nodeId) => store.executePlayerAttackNode(nodeId)}
              personaName={store.selectedPersona.name}
            />
          )}
        </div>
      </div>

      {/* Floating AI Mentor */}
      <AIMentorChatbot
        activeHints={store.activeHints}
        onRequestHint={store.requestMentorHint}
        budget={store.budget}
      />

      {/* Pre-Game Role & Character Selection Modal */}
      {isCharSelectOpen && (
        <CharacterSelectModal
          role={store.role}
          setRole={store.setRole}
          selectedOperative={store.role === 'DEFENDER' ? store.selectedOperative : store.selectedPersona}
          onSelect={(char) => store.role === 'DEFENDER' ? store.selectOperative(char) : store.selectPersona(char)}
          onConfirm={() => {
            setIsCharSelectOpen(false);
            store.startLevel();
          }}
        />
      )}

      {/* Story Cutscene Overlay */}
      {store.gameStatus === 'CUTSCENE' && currentCutscene && (
        <CinematicCutsceneOverlay
          dialog={currentCutscene}
          currentIndex={store.cutsceneIndex}
          totalDialogs={store.currentLevel.introCutscene.length}
          onNext={store.advanceCutscene}
          onSkip={() => store.advanceCutscene()}
        />
      )}

      {/* Incident Response Modal */}
      {store.gameStatus === 'INCIDENT_RESPONSE' && store.selectedIncidentAttack && (
        <IncidentResponseModal
          attack={store.selectedIncidentAttack}
          budget={store.budget}
          onExecuteAction={store.performIRAction}
          onClose={() => store.setRole('DEFENDER')}
        />
      )}

      {/* Real-Time Cyber Terminal Modal */}
      {store.isCyberTerminalOpen && (
        <CyberTerminalModal
          userCode={store.userCyberCode}
          setUserCode={store.setUserCyberCode}
          onRunScript={store.runCyberTerminalScript}
          executionResult={store.cyberScriptResult}
          onClose={store.closeCyberTerminal}
        />
      )}

      {/* End Level Assessment Modal */}
      {store.gameStatus === 'COMPLETED' && store.finalReport && (
        <EndLevelReportModal
          report={store.finalReport}
          onNextLevel={() => store.selectLevel(store.levelIndex + 1)}
          onReplay={() => store.selectLevel(store.levelIndex)}
          hasNextLevel={store.levelIndex + 1 < LEVEL_CONFIGS.length}
        />
      )}

      {/* Budget Exhausted Prompt Modal (Defender Mode) */}
      {showBudgetPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/50 bg-slate-900 p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display">Security Budget Exhausted!</h3>
                <p className="text-xs text-amber-400/90 font-mono font-bold">$0 Security Credits Remaining</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have used all available security credits. Would you like to continue defending until the session timer expires or end the game now to view your final Security Assessment Report?
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowBudgetPrompt(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
              >
                Continue Defending
              </button>
              <button
                onClick={handleEndSessionEarly}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                End Session & View Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attacks Exhausted Prompt Modal (Attacker Mode) */}
      {showAttacksExhaustedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/50 bg-slate-900 p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display">All Attack Vectors Executed!</h3>
                <p className="text-xs text-rose-400/90 font-mono font-bold">100% Exploit Tree Executed</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All available cyber attack nodes have been launched against the AI Defender. Would you like to stay in the session to observe telemetry or end the game now to inspect your final report?
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowAttacksExhaustedPrompt(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
              >
                Observe Telemetry
              </button>
              <button
                onClick={handleEndSessionEarly}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg transition-all"
              >
                End Session & View Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Quit Game Confirmation Modal */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display">Quit Interactive Simulation?</h3>
                <p className="text-xs text-slate-400">Your current progress will be calculated.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to quit the simulation early? You will receive a summary report based on your performance so far.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
              >
                Cancel & Resume
              </button>
              <button
                onClick={handleEndSessionEarly}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Quit & View Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Rules Modal Overlay */}
      <QuickRulesModal
        gameTitle="Cybercrime City"
        domainName="CYBERSECURITY & NETWORK DEFENSE"
        rules={[
          'Rule 1 (Security Budget & SOC Allocation): You begin with $10,000 security credits. Deploy SOC Analysts to active sectors (Power Grid, Smart Transit, Healthcare Vaults, Financial Hub).',
          'Rule 2 (Live Threat Monitoring): Inspect the tactical grid monitor for incoming threats ranging from reconnaissance port scans to zero-day ransomware bursts.',
          'Rule 3 (Targeted Countermeasures): Click active sectors to trigger defenses: IDS Telemetry ($1,500), Firewall Patch ($2,500), Cloud Scrubbing ($3,500), or Air-Gap Isolation ($4,000).',
          'Rule 4 (Grid Integrity Threshold): Maintain municipal sector health above 30% across all attack waves. If any core sector drops to 0%, a citywide blackout occurs.',
          'Rule 5 (Scoring & Completion): Neutralize all attack waves with sub-3-second response times to earn up to +350 XP and top global leaderboard placement.'
        ]}
        objectives={[
          'Master perimeter firewall rule configuration and IDS node placement.',
          'Analyze live network traffic metrics to distinguish legitimate spikes from DDoS botnet assaults.',
          'Allocate SOC security budget strategically between preventive analysts and endpoint isolation.',
          'Execute rapid network air-gapping to prevent lateral kernel ransomware propagation.'
        ]}
        skills={['Threat Detection', 'Resource Allocation', 'Incident Response', 'Network Quarantine', 'Risk Assessment']}
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  );
};
