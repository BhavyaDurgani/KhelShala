import React, { useState, useEffect, useRef } from 'react';
import { Bot, Play, CheckCircle2, XCircle, BookOpen, ArrowLeft, Activity, LogOut } from 'lucide-react';
import { QuickRulesModal } from '../common/QuickRulesModal';
import { ApiService } from '../../../services/api';
import { useStore } from '../../../store/useStore';

interface RoboticsKinematicsGameProps {
  onExit?: () => void;
}

export const RoboticsKinematicsGame: React.FC<RoboticsKinematicsGameProps> = ({ onExit }) => {
  const { updateGameProgress } = useStore();

  // Control Parameters
  const [theta1, setTheta1] = useState<number>(45); // Joint 1 angle
  const [theta2, setTheta2] = useState<number>(-30); // Joint 2 angle
  const [theta3, setTheta3] = useState<number>(20); // Joint 3 angle

  // PID Parameters
  const [kp, setKp] = useState<number>(2.5);
  const [ki, setKi] = useState<number>(0.1);
  const [kd, setKd] = useState<number>(0.8);

  // Target coordinates
  const targetX = 260;
  const targetY = 140;

  // Real-time state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [overshoot, setOvershoot] = useState<number>(12.4);
  const [precisionErr, setPrecisionErr] = useState<number>(18.5);
  const [torque, setTorque] = useState<number>(42.1);
  const [testResult, setTestResult] = useState<'IDLE' | 'PASSED' | 'FAILED'>('IDLE');
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Arm links (lengths)
  const l1 = 110;
  const l2 = 85;
  const l3 = 60;

  // Compute Forward Kinematics
  const rad1 = (theta1 * Math.PI) / 180;
  const rad2 = ((theta1 + theta2) * Math.PI) / 180;
  const rad3 = ((theta1 + theta2 + theta3) * Math.PI) / 180;

  const x0 = 150;
  const y0 = 260;

  const x1 = x0 + l1 * Math.cos(rad1);
  const y1 = y0 - l1 * Math.sin(rad1);

  const x2 = x1 + l2 * Math.cos(rad2);
  const y2 = y1 - l2 * Math.sin(rad2);

  const endX = x2 + l3 * Math.cos(rad3);
  const endY = y2 - l3 * Math.sin(rad3);

  // Calculate distance to target
  const distToTarget = Math.hypot(endX - targetX, endY - targetY);

  // Recalculate metrics whenever controls change
  useEffect(() => {
    const err = parseFloat(distToTarget.toFixed(2));
    setPrecisionErr(err);

    // PID Overshoot calculation simulation formula
    const calcOvershoot = Math.max(0, parseFloat((15 - kp * 3.5 + ki * 2.0 - kd * 4.2).toFixed(1)));
    setOvershoot(calcOvershoot);

    // Joint torque calculation
    const calcTorque = parseFloat((Math.abs(theta1) * 0.3 + Math.abs(theta2) * 0.4 + Math.abs(theta3) * 0.2).toFixed(1));
    setTorque(calcTorque);
  }, [theta1, theta2, theta3, kp, ki, kd, distToTarget]);

  // Draw 2D Kinematic arm on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Base obstacle
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.fillRect(190, 180, 40, 90);
    ctx.strokeRect(190, 180, 40, 90);
    ctx.fillStyle = '#EF4444';
    ctx.font = '10px monospace';
    ctx.fillText('OBSTACLE', 185, 172);

    // Target drop zone
    ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('TARGET', targetX - 22, targetY - 26);

    // Base Anchor
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(x0, y0, 12, 0, Math.PI * 2);
    ctx.fill();

    // Link 1
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Joint 1
    ctx.fillStyle = '#93C5FD';
    ctx.beginPath();
    ctx.arc(x1, y1, 8, 0, Math.PI * 2);
    ctx.fill();

    // Link 2
    ctx.strokeStyle = '#818CF8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Joint 2
    ctx.fillStyle = '#C7D2FE';
    ctx.beginPath();
    ctx.arc(x2, y2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Link 3
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // End Effector Claw
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(endX, endY, 7, 0, Math.PI * 2);
    ctx.fill();

    // Vector direction handle line to target
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [x0, y0, x1, y1, x2, y2, endX, endY, targetX, targetY]);

  const handleTestTrajectory = () => {
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      if (precisionErr < 12 && overshoot < 3) {
        setTestResult('PASSED');
        updateGameProgress('game_robotics_vector', 1, 250, 250);
        ApiService.submitGameSession({
          sessionId: `sess_${Date.now()}`,
          userId: 'guest_operative',
          gameId: 'game_robotics_vector',
          level: 1,
          score: 250,
          status: 'completed',
          startTime: new Date().toISOString()
        });
      } else {
        setTestResult('FAILED');
      }
    }, 1500);
  };

  const rulesList = [
    'Rule 1 (Joint Angles): Adjust Joint Angles theta_1, theta_2, theta_3 to position the robotic end-effector claw over the target zone.',
    'Rule 2 (PID Controller Tuning): Tune Kp (Proportional) to 3.0+, Ki (Integral) to 0.1, and Kd (Derivative) to 1.5+ to reduce trajectory overshoot to < 3%.',
    'Rule 3 (Obstacle Avoidance): Ensure arm links do not enter the red OBSTACLE zone (190 < X < 230, 180 < Y < 270).',
    'Rule 4 (Precision Target Alignment): Bring end-effector distance error to target to under 12.0 mm.',
    'Rule 5 (Session Clear): Click "EXECUTE KINEMATIC TRAJECTORY" to run simulation and claim +250 XP reward.'
  ];

  const objectivesList = [
    'Decompose 3D joint forces into planar kinematic vector components.',
    'Eliminate mechanical joint vibration using PID derivative damping.',
    'Solve inverse kinematics target positioning around physical obstacles.'
  ];

  const skillsList = ['Vector Math', 'Kinematics', 'Autonomous Navigation', 'PID Loops', 'Embedded Control'];

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 font-sans min-h-screen">
      
      {/* Top Controls Header */}
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
              <Bot className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-black text-white font-display">Robotics Kinematics: Vector Realm</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
                ROBOTICS TRACK
              </span>
            </div>
            <p className="text-xs text-slate-400">3-DOF Manipulator Joint Control & PID Feedback Simulator</p>
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

      {/* Main Canvas & Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2D Canvas Area (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between shadow-2xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 flex items-center">
              <Activity className="w-4 h-4 text-emerald-400 mr-1.5" />
              2D SPATIAL KINEMATICS ARENA
            </span>
            <span className="text-slate-400">Target Pos: ({targetX}, {targetY})</span>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#080C14] flex justify-center items-center">
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              className="w-full max-w-[480px] h-auto block"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">DIST TO TARGET</div>
              <div className={`font-bold ${precisionErr < 12 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {precisionErr} mm
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">PID OVERSHOOT</div>
              <div className={`font-bold ${overshoot < 3 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {overshoot}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">JOINT TORQUE</div>
              <div className="font-bold text-cyan-400">{torque} Nm</div>
            </div>
          </div>
        </div>

        {/* Kinematic Angle & PID Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          
          {/* Joint Vector Angles */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white font-display uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-2">
              1. Joint Vector Angles
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Joint 1 (Base \theta_1):</span>
                  <span className="text-cyan-400 font-bold">{theta1}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={theta1}
                  onChange={(e) => setTheta1(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Joint 2 (Elbow \theta_2):</span>
                  <span className="text-indigo-400 font-bold">{theta2}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={theta2}
                  onChange={(e) => setTheta2(Number(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span>Joint 3 (Wrist \theta_3):</span>
                  <span className="text-amber-400 font-bold">{theta3}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={theta3}
                  onChange={(e) => setTheta3(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* PID Gain Parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white font-display uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2">
              2. PID Controller Gain Tuning
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Kp (Prop)</label>
                <input
                  type="number"
                  step="0.5"
                  value={kp}
                  onChange={(e) => setKp(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Ki (Integ)</label>
                <input
                  type="number"
                  step="0.05"
                  value={ki}
                  onChange={(e) => setKi(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Kd (Deriv)</label>
                <input
                  type="number"
                  step="0.2"
                  value={kd}
                  onChange={(e) => setKd(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* Execute CTA */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleTestTrajectory}
              disabled={isSimulating}
              className={`w-full py-3.5 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all ${
                isSimulating
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>SIMULATING KINEMATIC PATH...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>EXECUTE KINEMATIC TRAJECTORY</span>
                </>
              )}
            </button>

            {testResult === 'PASSED' && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 text-xs font-bold font-mono text-center flex items-center justify-center space-x-2 animate-fadeIn shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">🎉 LEVEL PASSED! +250 XP REWARDED</span>
              </div>
            )}

            {testResult === 'FAILED' && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/50 text-rose-400 text-xs font-bold font-mono text-center flex items-center justify-center space-x-2 animate-fadeIn shadow-lg shadow-rose-500/10">
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  ❌ LEVEL FAILED! 0 XP REWARDED ({[
                    precisionErr >= 12 ? `Error: ${precisionErr.toFixed(1)}mm (Max 12.0mm)` : null,
                    overshoot >= 3 ? `Overshoot: ${overshoot.toFixed(1)}% (Max 3.0%)` : null
                  ].filter(Boolean).join(', ') || 'Benchmark Tolerance Exceeded'})
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
                  updateGameProgress('game_robotics_vector', 1, 250, 250);
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
        gameTitle="Robotics Kinematics: Vector Realm"
        domainName="ROBOTICS & EMBEDDED SYSTEMS"
        rules={rulesList}
        objectives={objectivesList}
        skills={skillsList}
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />

    </div>
  );
};
