import React, { useState } from 'react';
import { 
  Edit3, 
  CheckCircle2, 
  Activity, 
  Brain,
  Mail
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { ProgressBar } from '../components/common/ProgressBar';
import { XPBadge } from '../components/common/XPBadge';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, tracks, activeTrackId, updateUser } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);

  const activeTrack = tracks.find(t => t.id === activeTrackId || t.slug === activeTrackId) || tracks[0];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: nameInput, email: emailInput });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Profile Card */}
      <div className="relative rounded-3xl bg-bg-card/90 border border-bg-border p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6 backdrop-blur-xl">
        {!isAuthenticated && (
          <div className="rounded-2xl border border-brand-primary/40 bg-brand-primary/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
            <div>
              <h4 className="font-bold text-white text-sm">Guest Operative Mode</h4>
              <p className="text-xs text-slate-300">Sign in to save your game progress and rank on the live global leaderboard.</p>
            </div>
            <button
              onClick={openAuthModal}
              className="px-4 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-lg shadow-brand-primary/20 hover:bg-blue-600 hover:scale-105 transition-all"
            >
              Log In / Sign Up
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          
          {/* Avatar with Level Badge */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-brand-primary/40 shadow-xl shadow-brand-primary/10"
            />
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-lg border border-slate-900">
              Lvl {user.currentLevel}
            </div>
          </div>

          {/* User Meta Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center justify-center sm:justify-start">
                  {user.name}
                  <CheckCircle2 className="w-5 h-5 text-teal-400 ml-2" />
                </h1>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start mt-0.5 font-mono">
                  <Mail className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Quick Stat Indicators */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <XPBadge xp={user.totalXP} size="lg" />

              <div className="px-3.5 py-1.5 rounded-full bg-slate-800/90 text-slate-300 text-xs font-semibold border border-slate-700/60 flex items-center space-x-1.5">
                <span>🎮</span>
                <span>{user.gamesPlayed || 0} Games Played</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-slate-800/90 text-slate-300 text-xs font-semibold border border-slate-700/60 flex items-center space-x-1.5">
                <span>🏆</span>
                <span>{user.completedGamesCount || user.gamesCompleted || 0} Completed</span>
              </div>
            </div>
          </div>

        </div>

        {/* Profile Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-bg-surface border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Email Address</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-bg-surface border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-md shadow-brand-primary/20 hover:bg-blue-600 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SKILLS PROFICIENCY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-bg-card/90 p-6 rounded-3xl border border-bg-border space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white flex items-center">
            <Brain className="w-5 h-5 text-amber-400 mr-2" />
            Skill Mastery Breakdown ({activeTrack.name})
          </h3>

          <div className="space-y-4">
            {activeTrack.skills.map((skill, idx) => {
              const val = Math.min(100, Math.max(15, (user.totalXP > 0 ? 40 : 10) + (idx * 15)));
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold">{skill}</span>
                    <span className="text-amber-400 font-bold font-mono">{val}%</span>
                  </div>
                  <ProgressBar progress={val} showPercentage={false} size="md" />
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT ACTIVITY TIMELINE */}
        <div className="lg:col-span-5 bg-bg-card/90 p-6 rounded-3xl border border-bg-border space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white flex items-center">
            <Activity className="w-5 h-5 text-teal-400 mr-2" />
            Recent Activity Log
          </h3>

          <div className="space-y-3 text-xs">
            {useStore.getState().userProgress.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No recent activity recorded yet. Start playing games to log achievements!
              </div>
            ) : (
              useStore.getState().userProgress.map((prog) => (
                <div key={prog.id} className="p-3 rounded-xl bg-bg-surface border border-slate-800/80 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>Played {prog.gameId}</span>
                    <span className="text-amber-400 font-mono">+{prog.XP} XP</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Score: {prog.highestScore} • Level: {prog.currentLevel}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
