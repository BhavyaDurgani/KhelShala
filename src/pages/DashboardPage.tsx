import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Zap, 
  Trophy, 
  Award, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Brain,
  Gamepad2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { ApiService } from '../services/api';
import type { Game } from '../types';
import { GameCard } from '../components/common/GameCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { XPBadge } from '../components/common/XPBadge';

export const DashboardPage: React.FC = () => {
  const { user, tracks, activeTrackId, userProgress, achievements } = useStore();
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTrack = tracks.find(t => t.id === activeTrackId || t.slug === activeTrackId) || tracks[0];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const games = await ApiService.getGames();
        setAllGames(games);

        // Filter recommended games based on user's active track
        const recs = games.filter(g => g.domainId === activeTrack.id || g.featured);
        setRecommendedGames(recs);
      } catch (err) {
        console.error('Failed loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [activeTrackId]);

  // Combine user progress with full game details
  const inProgressGames = userProgress
    .map(p => {
      const g = allGames.find(game => game.id === p.gameId);
      return g ? { game: g, progress: p } : null;
    })
    .filter(Boolean) as { game: Game; progress: typeof userProgress[0] }[];

  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Welcome Banner with Level Meter Circular Widget */}
      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Left Welcome Info (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Learner Operative Dashboard</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Welcome back, {user.name} 👋
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your active track is <strong className="text-amber-400">{activeTrack.name}</strong>. Level {user.currentLevel} Learner • Accumulated {user.totalXP} XP across {user.gamesPlayed || 0} game sessions.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 flex items-center space-x-2 text-xs font-mono">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span className="text-slate-400">Total XP:</span>
                <span className="text-amber-400 font-bold">{user.totalXP}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 flex items-center space-x-2 text-xs font-mono">
                <Trophy className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">Badges:</span>
                <span className="text-white font-bold">{unlockedAchievementsCount}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 flex items-center space-x-2 text-xs font-mono">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-slate-400">Track:</span>
                <span className="text-white font-bold">{activeTrack.name}</span>
              </div>
            </div>
          </div>

          {/* Right Circular Level Meter Widget (4 Cols) */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative p-5 rounded-2xl bg-slate-950/90 border border-blue-500/30 text-center space-y-1 shadow-xl">
              <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                OPERATIVE STATUS
              </div>
              <div className="text-3xl font-black text-white font-display">
                LEVEL {user.currentLevel}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {user.totalXP % 1000} / 1000 XP to Level {user.currentLevel + 1}
              </div>
              <div className="w-44 h-2 bg-slate-900 rounded-full mx-auto overflow-hidden border border-slate-800 mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-amber-400"
                  style={{ width: `${Math.min(100, Math.max(10, ((user.totalXP % 1000) / 1000) * 100))}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Track Progress Bar Banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 space-y-1">
            {(() => {
              const trackMastery = userProgress.length > 0 
                ? Math.min(100, Math.round(userProgress.reduce((acc, p) => acc + (p.completionPercentage || 0), 0) / Math.max(1, userProgress.length))) 
                : 0;
              return (
                <>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-300 flex items-center">
                      <Layers className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                      Track Mastery Breakdown
                    </span>
                    <span className="text-amber-400 font-mono font-bold">{trackMastery}% Completed</span>
                  </div>
                  <ProgressBar progress={trackMastery} showPercentage={false} size="sm" />
                </>
              );
            })()}
          </div>

          <Link
            to="/tracks"
            className="text-xs font-bold text-blue-400 hover:text-white flex items-center space-x-1 shrink-0"
          >
            <span>Switch Domain Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* CONTINUE PLAYING SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white font-display flex items-center">
            <Play className="w-4 h-4 text-amber-400 fill-current mr-2" />
            Continue Playing
          </h2>
          <Link to="/games" className="text-xs font-bold text-slate-400 hover:text-white">
            View All Games
          </Link>
        </div>

        {inProgressGames.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
            <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">You haven't started a game yet.</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Explore our interactive games catalog and launch your first simulation!</p>
            <Link
              to="/games"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-all"
            >
              Start Your First Game →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inProgressGames.map(({ game, progress }) => (
              <div
                key={game.id}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-blue-500/60 transition-all space-y-3 shadow-lg group relative"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700/80"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block font-mono">
                      {game.domainId}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {game.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">
                      Level {progress.currentLevel} • High Score: {progress.highestScore}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Completion</span>
                    <span className="text-amber-400 font-bold">{progress.completionPercentage}%</span>
                  </div>
                  <ProgressBar progress={progress.completionPercentage} showPercentage={false} size="sm" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-500 text-[10px] font-mono">Played {new Date(progress.lastPlayedAt).toLocaleDateString()}</span>
                  <Link
                    to={`/games/${game.slug}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md text-xs"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RECOMMENDED GAMES SECTION */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white font-display">Recommended For You</h2>
            <p className="text-xs text-slate-400">Curated for your active track: {activeTrack.name}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">Loading recommendations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedGames.slice(0, 3).map(game => (
              <GameCard
                key={game.id}
                game={game}
                progress={userProgress.find(p => p.gameId === game.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SKILLS PROFICIENCY & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left: Skills Radar / Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white flex items-center">
            <Brain className="w-4 h-4 text-amber-400 mr-2" />
            Skills Being Developed ({activeTrack.name})
          </h3>

          <div className="space-y-3">
            {activeTrack.skills.map((skill, idx) => {
              const val = 60 + (idx * 8);
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold">{skill}</span>
                    <span className="text-amber-400 font-bold font-mono">{val}% Proficiency</span>
                  </div>
                  <ProgressBar progress={val} showPercentage={false} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Unlocked Achievements Widget (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center">
              <Award className="w-4 h-4 text-amber-400 mr-2" />
              Recent Achievements
            </h3>
            <Link to="/achievements" className="text-xs font-bold text-blue-400 hover:underline">View All</Link>
          </div>

          <div className="space-y-2.5">
            {achievements.slice(0, 3).map(ach => (
              <div key={ach.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center space-x-3">
                <div className={`p-2 rounded-lg border ${ach.unlocked ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-600 border-slate-700'}`}>
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{ach.title}</div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">{ach.requirement}</div>
                </div>
                <XPBadge xp={ach.XPReward} size="sm" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
