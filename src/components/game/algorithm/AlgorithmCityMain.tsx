import React, { useState } from 'react';
import { 
  Box, 
  UserCheck, 
  Compass, 
  ArrowLeft, 
  Bot,
  Volume2,
  VolumeX,
  BookOpen,
  Award,
  Sliders,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAlgorithmStore } from '../../../store/useAlgorithmStore';
import { soundEngine } from '../../../engine/common/soundEngine';
import { Warehouse3DCanvas } from './Warehouse3DCanvas';
import { OperationsConsolePanel } from './OperationsConsolePanel';
import { SystemArchivePanel } from './SystemArchivePanel';
import { AlgorithmVisualizerBar } from './AlgorithmVisualizerBar';
import { ScaleTestModal } from './ScaleTestModal';
import { NPCDialogModal } from './NPCDialogModal';
import { MissionReportModal } from './MissionReportModal';
import { QuickRulesModal } from '../common/QuickRulesModal';
import { WAREHOUSE_MISSIONS } from '../../../data/algorithm/warehouseMissions';

export const AlgorithmCityMain: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  const store = useAlgorithmStore();
  const [activeNPC, setActiveNPC] = useState<'marcus' | 'sophia' | null>(null);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [activeTab, setActiveTab] = useState<'console' | 'archive'>('console');
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);

  const activeFrame = store.executionResult?.frames?.[store.currentFrameIndex] || null;

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans select-none overflow-x-hidden p-4 space-y-4">
      {/* ========================================================================= */}
      {/* SECTION 1: TOP HUD & MISSION CARDS                                       */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header Navigation Bar */}
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
                <Box className="h-6 w-6 text-cyan-400" />
                <h1 className="text-xl font-extrabold text-white tracking-tight">ALGORITHM CITY</h1>
                <span className="rounded-full bg-cyan-950 px-3 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Award className="h-3 w-3 text-cyan-400" /> {store.architectRank}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{store.currentMission.title}</p>
            </div>
          </div>

          {/* Mission Selector Dropdown & Sound Toggle */}
          <div className="flex items-center gap-3">
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

            <select
              value={store.currentMissionIndex}
              onChange={(e) => store.selectMission(Number(e.target.value))}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {WAREHOUSE_MISSIONS.map((m, idx) => (
                <option key={m.id} value={idx}>
                  {m.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Mission Problem Statement & NPC Interaction Bar */}
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-900 p-4 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400 border border-cyan-500/40 shrink-0">
                <Compass className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">SYSTEM MISSION BRIEFING</span>
                <h3 className="font-bold text-white text-sm">{store.currentMission.subtitle}</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {store.currentMission.problemStatement}
                </p>
              </div>
            </div>

            {/* NPC Interaction Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveNPC('marcus');
                  store.openNPCDialog();
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <UserCheck className="h-4 w-4 text-amber-400" /> Talk to Supervisor Marcus
              </button>
              <button
                onClick={() => {
                  setActiveNPC('sophia');
                  store.openNPCDialog();
                }}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/80 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900 transition-colors"
              >
                <Bot className="h-4 w-4 text-cyan-400" /> Ask ARIA AI (Systems Advisor)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: CENTER STAGE - 100% UNOBSTRUCTED 3D WAREHOUSE ENVIRONMENT      */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 2: CENTER STAGE - 100% UNOBSTRUCTED 3D WAREHOUSE ENVIRONMENT      */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl space-y-3">
        <div className="relative h-[420px] w-full rounded-2xl border-2 border-cyan-500/40 bg-slate-950 overflow-hidden shadow-2xl shadow-cyan-500/10">
          <Warehouse3DCanvas
            packages={store.packages}
            activeFrame={activeFrame}
            onPackageSelect={(_id) => setActiveTab('console')}
          />
          <div className="absolute top-3 left-4 z-10 flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            <span>
              ● {store.currentMissionIndex === 1
                  ? '3D CONVEYOR BELT SORTING ENVIRONMENT (STRATEGY COMPLEXITY: O(N log N))'
                  : `3D WAREHOUSE FULFILLMENT ENVIRONMENT (TARGET PACKAGE: #${store.currentMission.targetPackageId})`}
            </span>
          </div>
        </div>

        {/* 3D Step Playback Bar directly attached under the 3D WebGL scene */}
        {store.executionResult && (
          <AlgorithmVisualizerBar
            frames={store.executionResult.frames}
            currentFrameIndex={store.currentFrameIndex}
            isPlaying={store.isPlayingAnimation}
            onTogglePlay={store.toggleAnimationPlayback}
            onSetFrame={store.setFrameIndex}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: IN-SCENE CONTROLS & ARCHIVE (SAME PAGE AS 3D SCENE)             */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Navigation Tabs Bar for Operations Console vs System Archive */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'console'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="h-4 w-4" /> OPERATIONS CONSOLE
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'archive'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4" /> SYSTEM ARCHIVE ({store.unlockedConceptIds.length} DISCOVERED)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono px-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>REAL-TIME SYSTEM IMPACT & STRATEGY SIMULATOR</span>
          </div>
        </div>

        {/* Dynamic In-Scene View Panel */}
        {activeTab === 'console' ? (
          <OperationsConsolePanel
            mission={store.currentMission}
            activeStrategy={store.activeStrategy}
            onSelectStrategy={store.selectStrategy}
            onRunSimulation={store.runSimulationInConsole}
            onRunScaleBenchmark={(size) => store.runScaleBenchmarkTest(size)}
            executionResult={store.executionResult}
            onCompleteMission={store.completeMission}
          />
        ) : (
          <SystemArchivePanel
            unlockedConceptIds={store.unlockedConceptIds}
          />
        )}
      </div>

      {/* Big-O Stress Test Modal */}
      {store.isScaleModalOpen && (
        <ScaleTestModal
          timeComplexity={store.activeStrategy.complexity}
          selectedInputSize={store.selectedScaleInput}
          scaleResult={store.scaleResult}
          onRunBenchmark={(size) => store.runScaleBenchmarkTest(size)}
          onClose={store.closeScaleModal}
        />
      )}

      {/* NPC Dialogue Modal */}
      {store.isNPCDialogOpen && activeNPC && (
        <NPCDialogModal
          npcKey={activeNPC}
          onClose={store.closeNPCDialog}
        />
      )}

      {/* Mission Completion Report Modal */}
      {store.isReportModalOpen && store.finalReport && (
        <MissionReportModal
          report={store.finalReport}
          onNextMission={() => store.selectMission(store.currentMissionIndex + 1)}
          onReplay={() => store.selectMission(store.currentMissionIndex)}
          hasNextMission={store.currentMissionIndex + 1 < WAREHOUSE_MISSIONS.length}
        />
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
                onClick={() => {
                  setShowQuitConfirm(false);
                  store.completeMission();
                }}
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
        gameTitle="Algorithm City"
        domainName="SOFTWARE ENGINEERING & DSA"
        rules={[
          'Rule 1 (Diagnostic Briefing): Review the operational incident log to identify latency bottlenecks in the cargo dispatch pipeline.',
          'Rule 2 (3D Warehouse Inspection): Navigate the 3D fulfillment center grid to inspect stalled package queues.',
          'Rule 3 (In-World Terminal Coding): Open the In-World Terminal and code optimal search/sort algorithms (Binary Search, QuickSort, MergeSort).',
          'Rule 4 (3D Step Execution Playback): Execute code to watch index pointers move step-by-step across 3D array containers.',
          'Rule 5 (Big-O Scalability Stress Test): Run stress tests up to 1,000,000 items. Reduce lookup execution latency from 8,700ms to < 0.02ms to pass.'
        ]}
        objectives={[
          'Compare Linear Search O(N) vs Binary Search O(log N) in physical fulfillment warehouse environments.',
          'Visualize array pointer movements, pivot selections, and swaps in real-time WebGL 3D execution.',
          'Diagnose CPU thermal throttling and memory buffer queue overflow during high-volume stress testing.',
          'Apply asymptotic Big-O analysis to scale sorting algorithms from 10 to 1,000,000 items.'
        ]}
        skills={['Binary Search', 'Sorting Algorithms', 'Big-O Analysis', 'System Optimization', 'JavaScript']}
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  );
};
