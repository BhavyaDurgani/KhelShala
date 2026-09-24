import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Play, 
  Sparkles, 
  ArrowRight, 
  Layers,
  Activity,
  Terminal,
  Trophy
} from 'lucide-react';
import { ApiService } from '../services/api';
import type { Game, Track } from '../types';
import { GameCard } from '../components/common/GameCard';
import { useStore } from '../store/useStore';

export const HomePage: React.FC = () => {
  const { userProgress } = useStore();
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-Time Skill Telemetry Matrix State
  const [evalScore, setEvalScore] = useState<number>(94.8);
  const [streakCount, setStreakCount] = useState<number>(7);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('Initializing Diagnostic Scan...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesData, tracksData] = await Promise.all([
          ApiService.getGames(),
          ApiService.getTracks()
        ]);
        setFeaturedGames(gamesData.filter(g => g.featured).slice(0, 3));
        setTracks(tracksData);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRunDiagnostic = () => {
    setIsScanning(true);
    setScanStep('Analyzing logic latency...');

    setTimeout(() => {
      setScanStep('Evaluating system resilience...');
    }, 800);

    setTimeout(() => {
      setScanStep('Computing global percentile...');
    }, 1600);

    setTimeout(() => {
      setIsScanning(false);
      setEvalScore(prev => Number((prev >= 98.5 ? 93.2 : prev + 1.6).toFixed(1)));
      setStreakCount(prev => prev + 1);
    }, 2400);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* Hero Command Center Section */}
      <section className="relative overflow-hidden pt-4 pb-8 lg:pt-8 lg:pb-10">
        {/* Ambient Radial Glow Backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-mono">SIH 2026 • Engineering & Tech Simulations</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight">
                Learn by Doing. <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-amber-400 bg-clip-text text-transparent">
                  Play by Thinking.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Master core engineering fields through hands-on interactive simulations — from SOC cyber threat defense and WebGL algorithms to AI neural networks and cloud microservices.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2.5 sm:space-y-0 sm:space-x-3 pt-2">
                <Link
                  to="/games"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105 flex items-center justify-center space-x-2 group"
                >
                  <Gamepad2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Explore Games Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>Launch Dashboard</span>
                </Link>
              </div>

              {/* Stats Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
                <div>
                  <div className="text-xl font-black text-white font-display">5</div>
                  <div className="text-[11px] text-slate-400 font-medium">Engineering Tech Tracks</div>
                </div>
                <div>
                  <div className="text-xl font-black text-amber-400 font-display font-mono">100%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Data-Driven</div>
                </div>
                <div>
                  <div className="text-xl font-black text-teal-400 font-display font-mono">14.2k+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Learners Played</div>
                </div>
              </div>
            </div>

            {/* Right Hero: REAL-TIME DEVELOPER SKILL MATRIX & DIAGNOSTIC CONSOLE */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg bg-[#0B0F17]/95 border border-blue-500/40 rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur-2xl ring-1 ring-blue-500/20">
                
                {/* Console Terminal Header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <span className="text-xs font-mono text-slate-400 font-bold ml-2">
                      khelshala://developer-skills-matrix
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-teal-400 font-bold flex items-center">
                    <Activity className="w-3 h-3 mr-1 text-teal-400 animate-pulse" />
                    LIVE EVALUATOR
                  </span>
                </div>

                {/* Metric Overview Row */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase">PROBLEM SOLVING SCORE</div>
                    <div className="text-2xl font-black text-blue-400 flex items-center justify-between">
                      <span>{evalScore}%</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-[10px] text-slate-500">Top 2.5% Percentile</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase">DAILY STREAK BOOST</div>
                    <div className="text-2xl font-black text-amber-400 flex items-center justify-between">
                      <span>{streakCount} Days 🔥</span>
                    </div>
                    <div className="text-[10px] text-amber-400/80">2.5x XP Multiplier Active</div>
                  </div>
                </div>

                {/* Live Skill Matrix Radar Bars */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-300 font-bold">
                    <span>Skill Competency Gauges</span>
                    <span className="text-teal-400 text-[11px]">OPTIMIZED</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Algorithmic Logic & Big-O</span>
                        <span className="text-cyan-400 font-bold">96.5%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-cyan-400 w-[96.5%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>System Resilience & Architecture</span>
                        <span className="text-purple-400 font-bold">92.0%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-purple-400 w-[92%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Incident Threat Isolation</span>
                        <span className="text-emerald-400 font-bold">94.8%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-emerald-400 w-[94.8%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Controls */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleRunDiagnostic}
                    disabled={isScanning}
                    className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 font-mono ${
                      isScanning
                        ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:scale-[1.02] active:scale-98'
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <span>{scanStep}</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>⚡ Run Skill Telemetry Diagnostic</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/dashboard"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white text-xs font-black tracking-wide flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/20 transition-all font-sans uppercase transform hover:scale-[1.02] active:scale-95"
                  >
                    <Trophy className="w-4 h-4 text-amber-300 fill-current" />
                    <span>ANALYZE YOUR TECH PROFILE</span>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Learning Journey Roadmap Nodes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">How KhelShala Works</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Experience an active learning loop designed to transform theoretical knowledge into real-world strategic skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 relative hover:border-blue-500/50 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-lg font-display">
              1
            </div>
            <h3 className="text-base font-bold text-white font-display">1. Learn by Doing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step into interactive decision scenarios. Manage SOC cyber threat grids, optimize Big-O algorithms, or scale cloud containers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 relative hover:border-amber-500/50 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-lg font-display">
              2
            </div>
            <h3 className="text-base font-bold text-white font-display">2. Play by Thinking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every decision carries immediate feedback loops. Adapt to changing conditions, allocate security budgets, and mitigate threats.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 relative hover:border-teal-500/50 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center font-bold text-lg font-display">
              3
            </div>
            <h3 className="text-base font-bold text-white font-display">3. Progress through Experience</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn XP, level up skills, unlock prestigious trophies, and track your global rank on the live Firestore leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Games Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-black text-white font-display">Featured Interactive Games</h2>
            <p className="text-xs text-slate-400 font-sans">Hand-picked dynamic engineering simulations ready for instant play.</p>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center space-x-1 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>View All Games Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-mono">Loading games catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                progress={userProgress.find(p => p.gameId === game.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Educational Domain Tracks Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-white font-display">Explore Engineering Domains</h2>
            <p className="text-xs text-slate-400">
              Select your track to focus your experiential engineering learning path.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {tracks.map(t => (
              <Link
                key={t.id}
                to={`/tracks`}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-center space-y-2 transition-all hover:-translate-y-1 block group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 font-display line-clamp-1">{t.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{t.gameCount} Games</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
