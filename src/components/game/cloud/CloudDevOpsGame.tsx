import React, { useState, useEffect } from 'react';
import { Server, Play, CheckCircle2, XCircle, BookOpen, ArrowLeft, Activity, Cpu, Globe, LogOut } from 'lucide-react';
import { QuickRulesModal } from '../common/QuickRulesModal';
import { ApiService } from '../../../services/api';
import { useStore } from '../../../store/useStore';

interface CloudDevOpsGameProps {
  onExit?: () => void;
}

export const CloudDevOpsGame: React.FC<CloudDevOpsGameProps> = ({ onExit }) => {
  const { updateGameProgress } = useStore();

  // NGINX & Kubernetes Config
  const [loadBalancing, setLoadBalancing] = useState<'least_conn' | 'round_robin' | 'ip_hash'>('least_conn');
  const [hpaCpuThreshold, setHpaCpuThreshold] = useState<number>(65);
  const [maxReplicas, setMaxReplicas] = useState<number>(12);
  const usEastPods = 4;
  const euCentralPods = 4;
  const apSouthPods = 4;

  // Failure Simulation state
  const [regionStatus, setRegionStatus] = useState<{ us: boolean; eu: boolean; ap: boolean }>({
    us: true,
    eu: true,
    ap: true
  });

  // System Performance Metrics
  const [trafficReqSec, setTrafficReqSec] = useState<number>(180000);
  const [slaUptime, setSlaUptime] = useState<number>(99.999);
  const [latencyMs, setLatencyMs] = useState<number>(34);
  const [cpuUsage, setCpuUsage] = useState<number>(58);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<'IDLE' | 'PASSED' | 'FAILED'>('IDLE');
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);

  // Recalculate SLA and Latency based on configuration
  useEffect(() => {
    let activePods = (regionStatus.us ? usEastPods : 0) + (regionStatus.eu ? euCentralPods : 0) + (regionStatus.ap ? apSouthPods : 0);
    activePods = Math.max(1, activePods);

    const calculatedCpu = Math.min(100, Math.round((trafficReqSec / (activePods * 15000)) * 60));
    setCpuUsage(calculatedCpu);

    let lat = 25 + (calculatedCpu > 70 ? (calculatedCpu - 70) * 2.5 : 0);
    if (loadBalancing === 'least_conn') lat -= 5;
    lat = Math.max(15, parseFloat(lat.toFixed(1)));
    setLatencyMs(lat);

    let uptime = 99.999;
    if (calculatedCpu > 85) uptime = 99.85;
    if (!regionStatus.us || !regionStatus.eu || !regionStatus.ap) {
      if (loadBalancing === 'least_conn' && activePods >= 8) {
        uptime = 99.999;
      } else {
        uptime = 99.920;
      }
    }
    setSlaUptime(uptime);
  }, [loadBalancing, hpaCpuThreshold, maxReplicas, usEastPods, euCentralPods, apSouthPods, regionStatus, trafficReqSec]);

  const handleSimulateOutage = (region: 'us' | 'eu' | 'ap') => {
    setRegionStatus(prev => ({ ...prev, [region]: !prev[region] }));
  };

  const handleStressTest = () => {
    setIsSimulating(true);
    setTrafficReqSec(250000);

    setTimeout(() => {
      setIsSimulating(false);
      if (slaUptime >= 99.99 && cpuUsage <= 65 && latencyMs < 50) {
        setTestResult('PASSED');
        updateGameProgress('game_cloud_devops', 1, 280, 280);
        ApiService.submitGameSession({
          sessionId: `sess_${Date.now()}`,
          userId: 'guest_operative',
          gameId: 'game_cloud_devops',
          level: 1,
          score: 280,
          status: 'completed',
          startTime: new Date().toISOString()
        });
      } else {
        setTestResult('FAILED');
      }
    }, 2000);
  };

  const rulesList = [
    'Rule 1 (Load Balancing Strategy): Select NGINX "Least Connections" load balancing strategy to distribute HTTP requests across pods.',
    'Rule 2 (Pod Provisioning): Scale active microservice pods across US-East (4), EU-Central (4), and AP-South (4) regions.',
    'Rule 3 (Kubernetes HPA Auto-Scaling): Set HPA CPU Threshold to 65% and Max Replicas to 12+.',
    'Rule 4 (Regional Failover Test): Ensure auto-failover maintains sub-50ms latency even if 1 regional cloud zone goes offline.',
    'Rule 5 (SLA Benchmark): Click "RUN 250k REQ/SEC STRESS TEST" to maintain 99.999% SLA Uptime and claim +280 XP reward.'
  ];

  const objectivesList = [
    'Configure NGINX reverse proxy load balancing algorithms.',
    'Establish Kubernetes Horizontal Pod Autoscaler (HPA) policies.',
    'Execute zero-downtime multi-region cloud failover under extreme traffic.'
  ];

  const skillsList = ['Kubernetes', 'Load Balancing', 'Microservices', 'Failover Automation', 'Docker Containers'];

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 font-sans min-h-screen">
      
      {/* Header */}
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
              <Server className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black text-white font-display">CloudReliability: Microservices Grid</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono">
                CLOUD & DEVOPS TRACK
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-Region Kubernetes Load Balancer & SLA Failover Simulator</p>
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
        
        {/* Cloud Config Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          
          {/* NGINX Proxy Balancing */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-400 font-mono uppercase tracking-wider flex items-center border-b border-slate-800 pb-2">
              <Globe className="w-4 h-4 mr-1.5 text-amber-400" />
              1. NGINX Reverse Proxy Balancing Algorithm
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                onClick={() => setLoadBalancing('least_conn')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  loadBalancing === 'least_conn'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Least Conn
              </button>
              <button
                onClick={() => setLoadBalancing('round_robin')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  loadBalancing === 'round_robin'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Round Robin
              </button>
              <button
                onClick={() => setLoadBalancing('ip_hash')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  loadBalancing === 'ip_hash'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                IP Hash
              </button>
            </div>
          </div>

          {/* Kubernetes HPA Controls */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-cyan-400 font-mono uppercase tracking-wider flex items-center border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 mr-1.5 text-cyan-400" />
              2. Kubernetes Horizontal Pod Autoscaler (HPA)
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>HPA CPU Auto-Scale Trigger:</span>
                  <span className="text-cyan-400 font-bold">{hpaCpuThreshold}% CPU</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={hpaCpuThreshold}
                  onChange={(e) => setHpaCpuThreshold(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Max Pod Replicas Limit:</span>
                  <span className="text-amber-400 font-bold">{maxReplicas} Pods</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="2"
                  value={maxReplicas}
                  onChange={(e) => setMaxReplicas(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Regional Pod Cluster Distributions */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-emerald-400 font-mono uppercase tracking-wider flex items-center border-b border-slate-800 pb-2">
              <Server className="w-4 h-4 mr-1.5 text-emerald-400" />
              3. Multi-Region Pod Clusters
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">US-East Node:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSimulateOutage('us')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      regionStatus.us ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {regionStatus.us ? 'ONLINE' : 'FIBER OUTAGE'}
                  </button>
                  <span className="font-bold text-white">{usEastPods} Pods</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">EU-Central Node:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSimulateOutage('eu')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      regionStatus.eu ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {regionStatus.eu ? 'ONLINE' : 'FIBER OUTAGE'}
                  </button>
                  <span className="font-bold text-white">{euCentralPods} Pods</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">AP-South Node:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSimulateOutage('ap')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      regionStatus.ap ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {regionStatus.ap ? 'ONLINE' : 'FIBER OUTAGE'}
                  </button>
                  <span className="font-bold text-white">{apSouthPods} Pods</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live SLA & Microservices Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center">
                <Activity className="w-4 h-4 text-amber-400 mr-1.5" />
                SYSTEM SRE METRICS & SLA MONITOR
              </span>
              <span className="text-emerald-400 font-bold">LIVE TELEMETRY</span>
            </div>

            {/* SRE Metrics Row */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">SLA UPTIME</div>
                <div className={`text-2xl font-black ${slaUptime >= 99.99 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {slaUptime}%
                </div>
                <div className="text-[9px] text-slate-500">Target: 99.999%</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">LATENCY (P99)</div>
                <div className={`text-2xl font-black ${latencyMs <= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {latencyMs} ms
                </div>
                <div className="text-[9px] text-slate-500">Target: &lt; 50ms</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">AVG CLUSTER CPU</div>
                <div className={`text-2xl font-black ${cpuUsage <= 65 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {cpuUsage}%
                </div>
                <div className="text-[9px] text-slate-500">Target: &le; 65%</div>
              </div>
            </div>

            {/* Region Cluster Status Diagram */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>MULTI-REGION MICROSERVICE CLUSTERS</span>
                <span className="text-xs text-amber-400 font-bold">
                  {(trafficReqSec / 1000).toFixed(0)}k req/sec
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1 text-xs font-mono">
                <div className={`p-3 rounded-xl border text-center space-y-1 ${regionStatus.us ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 opacity-60'}`}>
                  <div className="font-bold">US-East</div>
                  <div className="text-[10px]">{regionStatus.us ? `${usEastPods} Pods Active` : 'OUTAGE'}</div>
                </div>

                <div className={`p-3 rounded-xl border text-center space-y-1 ${regionStatus.eu ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 opacity-60'}`}>
                  <div className="font-bold">EU-Central</div>
                  <div className="text-[10px]">{regionStatus.eu ? `${euCentralPods} Pods Active` : 'OUTAGE'}</div>
                </div>

                <div className={`p-3 rounded-xl border text-center space-y-1 ${regionStatus.ap ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 opacity-60'}`}>
                  <div className="font-bold">AP-South</div>
                  <div className="text-[10px]">{regionStatus.ap ? `${apSouthPods} Pods Active` : 'OUTAGE'}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleStressTest}
              disabled={isSimulating}
              className={`w-full py-4 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center space-x-2 transition-all ${
                isSimulating
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>EXECUTING 250k REQ/SEC STRESS ASSAULT...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>RUN 250k REQ/SEC STRESS TEST</span>
                </>
              )}
            </button>

            {testResult === 'PASSED' && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono text-center flex items-center justify-center space-x-2 animate-fadeIn shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>🎉 STRESS TEST PASSED! 99.999% SLA SURVIVED — +280 XP REWARDED</span>
              </div>
            )}

            {testResult === 'FAILED' && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold font-mono text-center flex items-center justify-center space-x-2 animate-fadeIn shadow-lg">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  ❌ STRESS TEST FAILED! 0 XP REWARDED ({[
                    slaUptime < 99.99 ? `SLA: ${slaUptime}% (Min 99.99%)` : null,
                    cpuUsage > 65 ? `CPU: ${cpuUsage}% (Max 65%)` : null,
                    latencyMs >= 50 ? `Latency: ${latencyMs}ms (Max 50ms)` : null
                  ].filter(Boolean).join(', ') || 'Benchmark SLA breach'})
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
                  updateGameProgress('game_cloud_devops', 1, 280, 280);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Quit & View Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal Overlay */}
      <QuickRulesModal
        gameTitle="CloudReliability: Microservices Grid"
        domainName="CLOUD & DEVOPS ARCHITECTURE"
        rules={rulesList}
        objectives={objectivesList}
        skills={skillsList}
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />

    </div>
  );
};
