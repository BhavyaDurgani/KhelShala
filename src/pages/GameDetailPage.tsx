import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowLeft,
  BookOpen,
  ListOrdered,
  Workflow,
  Sparkles,
  Zap,
  Gamepad2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ApiService } from '../services/api';
import type { Game } from '../types';
import { DifficultyBadge } from '../components/common/DifficultyBadge';
import { XPBadge } from '../components/common/XPBadge';
import { GameLauncher } from '../components/game/GameLauncher';
import { useStore } from '../store/useStore';

export const GameDetailPage: React.FC = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const { userProgress } = useStore();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'overview' | 'arena'>('overview');

  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameSlug) return;
      setLoading(true);
      try {
        const data = await ApiService.getGameBySlug(gameSlug);
        setGame(data || null);
      } catch (err) {
        console.error('Failed fetching game details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameSlug]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">Loading game briefing & configuration data...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-display">Game Module Not Found</h2>
        <p className="text-xs text-slate-400">The requested simulation module does not exist or has been relocated.</p>
        <Link to="/games" className="inline-block px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-md shadow-brand-primary/20">
          Back to Games Catalog
        </Link>
      </div>
    );
  }

  const progress = userProgress.find(p => p.gameId === game.id);
  const isStarted = progress && progress.completionPercentage > 0;

  const handleStartGame = () => {
    setViewMode('arena');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitArena = () => {
    setViewMode('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ------------------------------------------------------------------ */
  /* MODE 2: DEDICATED FULL GAME ARENA MODE                             */
  /* ------------------------------------------------------------------ */
  if (viewMode === 'arena') {
    return (
      <div className="space-y-6 pb-16 animate-fadeIn" ref={topRef}>
        
        {/* Dedicated Arena Control Header */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-2xl sticky top-20 z-30">
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleExitArena}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700/80 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to Rules & Briefing</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-slate-800" />

            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h2 className="text-sm font-black text-white font-display tracking-tight">
                  {game.title}
                </h2>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Interactive Simulation Arena • {game.domainId.toUpperCase()} TRACK
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <XPBadge xp={game.xpReward} size="sm" />
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              SESSION LIVE
            </span>
          </div>

        </div>

        {/* Dedicated Isolated Game Canvas Component (No Rules text underneath) */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B0F17] overflow-hidden shadow-2xl">
          <GameLauncher game={game} onExit={handleExitArena} />
        </div>

      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* MODE 1: GAME BRIEFING & RULES OVERVIEW MODE                        */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-10 pb-28 relative" ref={topRef}>
      
      {/* Back Link */}
      <div>
        <Link to="/games" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to All Games Catalog</span>
        </Link>
      </div>

      {/* Main Hero Section */}
      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
        
        {/* Banner image background */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
          <img
            src={game.banner}
            alt={game.title}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/70 to-transparent" />

          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <span className="px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700 text-xs font-bold text-amber-400 font-mono flex items-center space-x-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{game.domainId.toUpperCase()} TRACK</span>
            </span>
            <XPBadge xp={game.xpReward} size="md" />
          </div>
        </div>

        {/* Hero Content Box */}
        <div className="p-6 sm:p-10 -mt-20 relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={game.difficulty} />
                <span className="text-xs text-slate-400 flex items-center font-mono">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {game.estimatedTime}
                </span>
                <span className="text-xs text-slate-400 flex items-center font-mono">
                  <Users className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {game.playerCount.toLocaleString()} Learners Played
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-none">
                {game.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* HIGH VISIBILITY PROMINENT PLAY NOW CTA BUTTON */}
            <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <button
                onClick={handleStartGame}
                className="w-full lg:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-blue-600 to-indigo-600 hover:from-amber-400 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase shadow-2xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 group ring-2 ring-amber-400/40 animate-pulse-subtle"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4.5 h-4.5 fill-current text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-amber-200 font-mono tracking-widest -mb-0.5">LAUNCH SIMULATION</div>
                  <div className="text-base font-black tracking-wide">{isStarted ? 'CONTINUE SESSION' : 'PLAY NOW'}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-200 group-hover:translate-x-1 transition-transform ml-1" />
              </button>
            </div>

          </div>

          {/* Dynamic Skill Mastery Pills */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center">
              <ShieldCheck className="w-4 h-4 text-teal-400 mr-1" />
              Target Skills:
            </span>
            {game.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono"
              >
                {skill}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* Rules & Objectives Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Learning Objectives & Rules (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* WHAT WILL YOU LEARN? */}
          <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 backdrop-blur-xl">
            <h2 className="text-xl font-black text-white font-display flex items-center">
              <BookOpen className="w-5 h-5 text-amber-400 mr-2" />
              What You'll Learn & Master
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {game.learningObjectives.map((obj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HOW TO PLAY (RULES & OBJECTIVES) */}
          <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 backdrop-blur-xl">
            <h2 className="text-xl font-black text-white font-display flex items-center justify-between">
              <span className="flex items-center">
                <ListOrdered className="w-5 h-5 text-amber-400 mr-2" />
                How to Play (Rules & Steps)
              </span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                {game.rules.length} Core Rules
              </span>
            </h2>

            <div className="space-y-3">
              {game.rules.map((rule, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-200 leading-relaxed font-mono flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM BRIEFING CALL TO ACTION BOX */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-950/80 via-slate-900 to-amber-950/40 border border-blue-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center justify-center sm:justify-start">
                <Sparkles className="w-4 h-4 mr-1 text-amber-400" />
                Ready to Launch Session?
              </div>
              <h3 className="text-lg font-black text-white font-display">
                You've read the rules. Put theory into practice!
              </h3>
              <p className="text-xs text-slate-400">
                Earn up to +{game.xpReward} XP and climb the global leaderboard.
              </p>
            </div>

            <button
              onClick={handleStartGame}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY NOW</span>
            </button>
          </div>

        </div>

        {/* Right Column: Workflow Timeline & Levels (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* HOW THE GAME WORKS TIMELINE */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 backdrop-blur-xl">
            <h3 className="text-base font-black text-white font-display flex items-center">
              <Workflow className="w-5 h-5 text-blue-400 mr-2" />
              Learning Cycle
            </h3>

            <div className="space-y-5 text-xs relative pl-4 border-l-2 border-slate-800">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-blue-500 absolute -left-[23px] top-1 ring-4 ring-slate-900" />
                <div className="font-bold text-white">1. Learn Objective</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Inspect threat alerts & sector health.</div>
              </div>

              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-indigo-500 absolute -left-[23px] top-1 ring-4 ring-slate-900" />
                <div className="font-bold text-white">2. Decide & Act</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Allocate security budget across defenses.</div>
              </div>

              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-amber-400 absolute -left-[23px] top-1 ring-4 ring-slate-900" />
                <div className="font-bold text-white">3. Get Real-Time Feedback</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Observe mitigation impact on city sectors.</div>
              </div>

              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-teal-400 absolute -left-[23px] top-1 ring-4 ring-slate-900" />
                <div className="font-bold text-white">4. Level Up & Progress</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Earn +{game.xpReward} XP & unlock next challenge.</div>
              </div>
            </div>
          </div>

          {/* GAME LEVELS BREAKDOWN WITH PROGRESSION LOCK */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span>Game Levels Progression</span>
              <span className="text-xs text-slate-400 font-mono">{game.levels.length} Stages</span>
            </h3>

            <div className="space-y-3">
              {game.levels.map(lvl => {
                const isLvlUnlocked = lvl.levelNumber === 1 || (progress && progress.currentLevel >= lvl.levelNumber);
                return (
                  <div 
                    key={lvl.id} 
                    className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                      isLvlUnlocked 
                        ? 'bg-slate-950/90 border-slate-700/80 shadow-md' 
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold text-white">
                      <span className="flex items-center space-x-1.5">
                        <span>Level {lvl.levelNumber}: {lvl.title}</span>
                      </span>
                      <DifficultyBadge difficulty={lvl.difficulty} />
                    </div>

                    <div className="text-[11px] text-slate-400 leading-relaxed">{lvl.description}</div>

                    <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                      {isLvlUnlocked ? (
                        <span className="text-emerald-400 font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          UNLOCKED • READY TO PLAY
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold flex items-center">
                          🔒 COMPLETE LEVEL {lvl.levelNumber - 1} TO UNLOCK
                        </span>
                      )}
                      <span className="text-slate-500">Requires {lvl.requiredXP} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OPERATIVE PREREQUISITES & CREDENTIALS CARD (Fills right side space perfectly) */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 backdrop-blur-xl">
            <h3 className="text-base font-black text-white font-display flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="flex items-center text-amber-400">
                <ShieldCheck className="w-5 h-5 text-amber-400 mr-2" />
                Operative Requirements
              </span>
              <span className="text-[10px] font-mono text-slate-400">READY</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">SIMULATION ENGINE</div>
                <div className="text-white font-bold flex items-center justify-between">
                  <span>{game.gameEngine.toUpperCase()} WebGL Engine</span>
                  <span className="text-emerald-400 text-[10px]">60 FPS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">MAXIMUM REWARD</div>
                <div className="text-amber-400 font-bold flex items-center justify-between">
                  <span>+{game.xpReward} Mastery XP</span>
                  <span className="text-slate-400 text-[10px]">Leaderboard Rank</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">RECOMMENDED ENVIRONMENT</div>
                <div className="text-slate-300">Modern Desktop Browser (Chrome/Edge/Firefox)</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* STICKY BOTTOM PLAY NOW ACTION BAR (ALWAYS VISIBLE WHILE SCROLLING RULES) */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-40 max-w-md w-full animate-bounce-subtle">
        <div className="bg-slate-950/95 border border-amber-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 ring-2 ring-amber-500/20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-400 fill-current animate-pulse" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{game.title}</div>
              <div className="text-[10px] text-amber-400 font-mono">+{game.xpReward} XP Reward Available</div>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PLAY NOW</span>
          </button>
        </div>
      </div>

    </div>
  );
};
