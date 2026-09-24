import React, { useState, useEffect } from 'react';
import { Cpu, Play, CheckCircle2, XCircle, BookOpen, ArrowLeft, Activity, Layers, Sliders, Database, LogOut } from 'lucide-react';
import { QuickRulesModal } from '../common/QuickRulesModal';
import { ApiService } from '../../../services/api';
import { useStore } from '../../../store/useStore';

interface AINeuralPipelineGameProps {
  onExit?: () => void;
}

export const AINeuralPipelineGame: React.FC<AINeuralPipelineGameProps> = ({ onExit }) => {
  const { updateGameProgress } = useStore();

  // Network Architecture State
  const [hiddenLayers, setHiddenLayers] = useState<number>(3);
  const [nodesPerLayer, setNodesPerLayer] = useState<number>(64);
  const [activation, setActivation] = useState<'relu' | 'sigmoid'>('relu');
  const [dropout, setDropout] = useState<number>(0.2);

  // Hyperparameters
  const [learningRate, setLearningRate] = useState<number>(0.005);
  const [batchSize, setBatchSize] = useState<number>(64);
  const [normalizer, setNormalizer] = useState<'zscore' | 'minmax'>('zscore');

  // Live Metrics & Simulation State
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [epochProgress, setEpochProgress] = useState<number>(0);
  const [trainLoss, setTrainLoss] = useState<number>(0.142);
  const [valAccuracy, setValAccuracy] = useState<number>(84.5);
  const [throughput, setThroughput] = useState<number>(45000);
  const [testResult, setTestResult] = useState<'IDLE' | 'PASSED' | 'FAILED'>('IDLE');
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);

  // Calculate training dynamics
  useEffect(() => {
    // Simulated accuracy & loss based on layer depth and learning rate
    let acc = 80 + hiddenLayers * 4.2 - Math.abs(learningRate - 0.005) * 800 + (nodesPerLayer / 64) * 3.5;
    if (dropout > 0.3) acc -= 4.0;
    acc = Math.min(99.4, Math.max(60.0, parseFloat(acc.toFixed(1))));

    let loss = (100 - acc) * 0.0035;
    loss = parseFloat(loss.toFixed(4));

    setValAccuracy(acc);
    setTrainLoss(loss);
    setThroughput(batchSize * 850);
  }, [hiddenLayers, nodesPerLayer, activation, dropout, learningRate, batchSize, normalizer]);

  const handleStartTraining = () => {
    setIsTraining(true);
    setEpochProgress(0);

    let currentEpoch = 0;
    const interval = setInterval(() => {
      currentEpoch += 10;
      setEpochProgress(currentEpoch);

      if (currentEpoch >= 100) {
        clearInterval(interval);
        setIsTraining(false);

        if (valAccuracy >= 98.0 && trainLoss < 0.01) {
          setTestResult('PASSED');
          updateGameProgress('game_ai_pipeline', 1, 300, 300);
          ApiService.submitGameSession({
            sessionId: `sess_${Date.now()}`,
            userId: 'guest_operative',
            gameId: 'game_ai_pipeline',
            level: 1,
            score: 300,
            status: 'completed',
            startTime: new Date().toISOString()
          });
        } else {
          setTestResult('FAILED');
        }
      }
    }, 250);
  };

  const rulesList = [
    'Rule 1 (Feature Normalization): Select "Z-score (StandardScaler)" normalization for ETL telemetry input to prevent gradient explosion.',
    'Rule 2 (Hidden Layer Depth): Configure Hidden Dense Layers to 3 or 4 layers with 64+ nodes per layer.',
    'Rule 3 (Activation & Regularization): Choose ReLU activation function and set Dropout rate to 0.2 to prevent overfitting.',
    'Rule 4 (Learning Rate Hyperparameter): Tune Learning Rate alpha to 0.005 and Batch Size to 64 or 128.',
    'Rule 5 (Target Benchmark): Reach Validation Accuracy >= 98.0% and Training Loss < 0.010 across 100 Training Epochs to earn +300 XP.'
  ];

  const objectivesList = [
    'Master deep learning backpropagation gradient descent loss reduction.',
    'Prevent model overfitting on unseen validation dataset features.',
    'Build high-throughput streaming ETL feature pipelines (100k vectors/sec).'
  ];

  const skillsList = ['Neural Networks', 'ETL Pipelines', 'Model Accuracy', 'Vector Embedding', 'Data Preprocessing'];

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 font-sans min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          {onExit && (
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-black text-white font-display">Neural Net & Data Pipeline Lab</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold font-mono">
                AI & DATA TRACK
              </span>
            </div>
            <p className="text-xs text-slate-400">Deep Learning Architecture Builder & Streaming ETL Data Pipeline Simulator</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRules(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-bold font-mono hover:bg-amber-500/25 transition-all flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>📜 RULES & MANUAL</span>
          </button>

          <button
            onClick={() => setShowQuitConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold font-mono hover:bg-rose-500/25 transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>QUIT GAME</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Architecture & Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          
          {/* 1. ETL Data Preprocessing */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-purple-400 font-mono uppercase tracking-wider flex items-center border-b border-slate-800 pb-2">
              <Database className="w-4 h-4 mr-1.5 text-purple-400" />
              1. Streaming ETL Feature Normalizer
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setNormalizer('zscore')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  normalizer === 'zscore'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Z-Score (Standard)
              </button>
              <button
                onClick={() => setNormalizer('minmax')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  normalizer === 'minmax'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Min-Max Scaling
              </button>
            </div>
          </div>

          {/* 2. Neural Architecture */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-cyan-400 font-mono uppercase tracking-wider flex items-center border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4 mr-1.5 text-cyan-400" />
              2. Dense Neural Network Layers
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Hidden Layers:</span>
                  <span className="text-cyan-400 font-bold">{hiddenLayers} Layers</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={hiddenLayers}
                  onChange={(e) => setHiddenLayers(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Nodes Per Layer:</span>
                  <span className="text-purple-400 font-bold">{nodesPerLayer} Nodes</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="128"
                  step="16"
                  value={nodesPerLayer}
                  onChange={(e) => setNodesPerLayer(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Activation Function</label>
                  <select
                    value={activation}
                    onChange={(e) => setActivation(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  >
                    <option value="relu">ReLU (Non-Linear)</option>
                    <option value="sigmoid">Sigmoid</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Dropout Regularization</label>
                  <select
                    value={dropout}
                    onChange={(e) => setDropout(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  >
                    <option value={0.1}>10% Dropout</option>
                    <option value={0.2}>20% Dropout</option>
                    <option value={0.4}>40% Dropout</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Hyperparameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-400 font-mono uppercase tracking-wider flex items-center border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 mr-1.5 text-amber-400" />
              3. Hyperparameters Tuning
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Learning Rate (\alpha)</label>
                <input
                  type="number"
                  step="0.001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Batch Size</label>
                <select
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                >
                  <option value={32}>32 Vectors</option>
                  <option value={64}>64 Vectors</option>
                  <option value={128}>128 Vectors</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Live Training Metrics & Graphs (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center">
                <Activity className="w-4 h-4 text-purple-400 mr-1.5" />
                NEURAL MODEL TRAINING DASHBOARD
              </span>
              <span className="text-purple-400 font-bold">100 EPOCHS TOTAL</span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">VAL ACCURACY</div>
                <div className={`text-2xl font-black ${valAccuracy >= 98.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {valAccuracy}%
                </div>
                <div className="text-[9px] text-slate-500">Target: \ge 98.0%</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">TRAINING LOSS</div>
                <div className={`text-2xl font-black ${trainLoss < 0.01 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trainLoss}
                </div>
                <div className="text-[9px] text-slate-500">Target: &lt; 0.010</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">ETL THROUGHPUT</div>
                <div className="text-2xl font-black text-cyan-400">
                  {(throughput / 1000).toFixed(0)}k/s
                </div>
                <div className="text-[9px] text-slate-500">Feature Vectors</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Training Epoch Progress:</span>
                <span className="text-purple-400 font-bold">{epochProgress}% / 100 Epochs</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${epochProgress}%` }}
                />
              </div>
            </div>

            {/* Network Diagram Visualizer */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>MODEL GRAPH VISUALIZER</span>
                <span className="text-xs text-purple-400 font-bold">
                  {hiddenLayers + 2} Layers Total
                </span>
              </div>

              <div className="flex items-center justify-center space-x-6 py-4">
                {/* Input Layer */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Input (ETL)</span>
                </div>

                {/* Hidden Layers */}
                {Array.from({ length: hiddenLayers }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-1">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="text-[9px] font-mono text-slate-500 mt-1">H{idx + 1} ({nodesPerLayer})</span>
                  </div>
                ))}

                {/* Output Layer */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 font-bold text-[8px] flex items-center justify-center text-slate-950">✓</div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Output</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className={`w-full py-4 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center space-x-2 transition-all ${
                isTraining
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isTraining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>TRAINING NEURAL BACKPROPAGATION...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>TRAIN NEURAL MODEL & STREAM ETL PIPELINE</span>
                </>
              )}
            </button>

            {testResult === 'PASSED' && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono text-center flex items-center justify-center space-x-2 animate-fadeIn shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>🎉 NEURAL TRAINING PASSED! ACCURACY & LOSS BENCHMARK MET — +300 XP REWARDED</span>
              </div>
            )}

            {testResult === 'FAILED' && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold font-mono text-center flex items-center justify-center space-x-2 animate-fadeIn shadow-lg">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  ❌ NEURAL TRAINING FAILED! 0 XP REWARDED ({[
                    valAccuracy < 98.0 ? `Val Accuracy: ${valAccuracy}% (Min 98.0%)` : null,
                    trainLoss >= 0.01 ? `Train Loss: ${trainLoss} (Max 0.010)` : null
                  ].filter(Boolean).join(', ') || 'Accuracy Target Not Met'})
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

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
                  setTestResult('PASSED');
                  updateGameProgress('game_ai_pipeline', 1, 300, 300);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Quit & View Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <QuickRulesModal
        gameTitle="Neural Net & Data Pipeline Lab"
        domainName="AI & DATA ENGINEERING"
        rules={rulesList}
        objectives={objectivesList}
        skills={skillsList}
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />

    </div>
  );
};
