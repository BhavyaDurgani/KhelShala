import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Zap, Activity } from 'lucide-react';
import { RealtimeDbService } from '../services/realtimeDbService';
import type { LeaderboardEntry } from '../types';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    // Real-Time WebSocket / Reactive Listener
    const unsubscribe = RealtimeDbService.subscribeLeaderboard((entries) => {
      setLeaderboard(entries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const top1 = leaderboard.find(e => e.rank === 1) || leaderboard[0];
  const top2 = leaderboard.find(e => e.rank === 2) || leaderboard[1];
  const top3 = leaderboard.find(e => e.rank === 3) || leaderboard[2];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Global Competitive Rankings</span>
          <span className="flex items-center gap-1 text-[10px] text-teal-400 font-mono ml-2">
            <Activity className="w-3 h-3 animate-pulse" /> LIVE FIRESTORE SYNC
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          KhelShala Leaderboard Arena
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Compete against top learners across India. Rankings are updated dynamically in real time.
        </p>
      </div>

      {/* TOP 3 PODIUM ARENA SHOWCASE */}
      {!loading && leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 pb-4 items-end">
          
          {/* #2 SILVER PODIUM */}
          {top2 ? (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700/80 text-center space-y-3 shadow-xl order-2 md:order-1 relative backdrop-blur-xl">
              <div className="w-16 h-16 rounded-full mx-auto relative">
                <img src={top2.avatar} alt={top2.username} className="w-full h-full rounded-full object-cover ring-4 ring-slate-400" />
                <div className="absolute -bottom-2 right-0 bg-slate-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow-md">
                  #2
                </div>
              </div>
              <div>
                <div className="font-bold text-white text-base font-display">{top2.username}</div>
                <div className="text-xs text-amber-400 font-mono font-bold">{top2.totalXP} XP</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{top2.gamesCompleted} Cleared</div>
              </div>
            </div>
          ) : <div className="hidden md:block" />}

          {/* #1 GOLD CROWN PODIUM (Center, Highlighted) */}
          {top1 && (
            <div className="bg-slate-900/95 rounded-3xl p-6 border-2 border-amber-500/60 text-center space-y-3 shadow-2xl order-1 md:order-2 relative backdrop-blur-xl -translate-y-2 glow-amber">
              <div className="w-20 h-20 rounded-full mx-auto relative">
                <img src={top1.avatar} alt={top1.username} className="w-full h-full rounded-full object-cover ring-4 ring-amber-400" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Crown className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-md animate-bounce" />
                </div>
                <div className="absolute -bottom-2 right-0 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg">
                  #1
                </div>
              </div>
              <div>
                <div className="font-black text-white text-lg font-display">{top1.username}</div>
                <div className="text-sm text-amber-400 font-mono font-black">{top1.totalXP} XP</div>
                <div className="text-xs text-teal-400 font-mono mt-0.5">{top1.badgeTitle || 'Master Operative'}</div>
              </div>
            </div>
          )}

          {/* #3 BRONZE PODIUM */}
          {top3 ? (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 text-center space-y-3 shadow-xl order-3 relative backdrop-blur-xl">
              <div className="w-16 h-16 rounded-full mx-auto relative">
                <img src={top3.avatar} alt={top3.username} className="w-full h-full rounded-full object-cover ring-4 ring-amber-700" />
                <div className="absolute -bottom-2 right-0 bg-amber-700 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-md">
                  #3
                </div>
              </div>
              <div>
                <div className="font-bold text-white text-base font-display">{top3.username}</div>
                <div className="text-xs text-amber-400 font-mono font-bold">{top3.totalXP} XP</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{top3.gamesCompleted} Cleared</div>
              </div>
            </div>
          ) : <div className="hidden md:block" />}

        </div>
      )}

      {/* Global Rankings Header Badge */}
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/30">
            Global Rankings
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            Showing top global learners ranked by total XP
          </span>
        </div>
        <div className="text-[11px] font-mono text-teal-400 flex items-center">
          <Activity className="w-3.5 h-3.5 mr-1 animate-pulse" />
          <span>Real-time Rankings</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-mono">Loading live rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
            <h3 className="text-base font-bold text-white font-display">No Live Rankings Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No players have completed sessions on the live database yet. Log in and complete your first mission to claim #1 on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                <tr>
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Learner</th>
                  <th className="py-3.5 px-6">Track</th>
                  <th className="py-3.5 px-6 text-center">Total XP</th>
                  <th className="py-3.5 px-6 text-center">Badge Title</th>
                  <th className="py-3.5 px-6 text-center">Games</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leaderboard.map(entry => (
                  <tr
                    key={entry.userId || entry.username}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      (entry.username || '').includes('You') || entry.userId === 'user_current' ? 'bg-blue-600/10 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <td className="py-3.5 px-6 font-bold text-slate-200">
                      <div className="flex items-center space-x-2">
                        {entry.rank === 1 ? (
                          <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                        ) : entry.rank === 2 ? (
                          <Medal className="w-5 h-5 text-slate-300 fill-slate-300" />
                        ) : entry.rank === 3 ? (
                          <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />
                        ) : (
                          <span className="w-5 text-center text-slate-400 font-mono">#{entry.rank}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={entry.avatar}
                          alt={entry.username || 'User'}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white text-xs font-display">{entry.username || (entry as any).userName}</div>
                          {entry.badgeTitle && (
                            <span className="text-[10px] text-amber-400 font-mono font-semibold">{entry.badgeTitle}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-slate-300 font-medium font-mono text-[11px]">
                      {entry.primarySkill || (entry as any).track}
                    </td>

                    <td className="py-3.5 px-6 text-center">
                      <span className="inline-flex items-center font-black text-amber-400 font-mono text-xs">
                        <Zap className="w-3.5 h-3.5 mr-1 fill-current" />
                        {entry.totalXP}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-center font-bold text-blue-400">
                      {entry.badgeTitle || (entry as any).highestScore || 'Architect'}
                    </td>

                    <td className="py-3.5 px-6 text-center text-slate-300 font-semibold font-mono text-[11px]">
                      {entry.gamesCompleted} Cleared
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

