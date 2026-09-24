import React, { useState } from 'react';
import { Award, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { XPBadge } from '../components/common/XPBadge';

export const AchievementsPage: React.FC = () => {
  const { achievements } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Badges & Trophies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            Learner Achievements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Unlock badges by mastering game levels, achieving high defensive precision, and maintaining zero-compromise sector scores.
          </p>
        </div>

        {/* Unlocked Summary Badge */}
        <div className="px-5 py-3.5 rounded-2xl bg-bg-card/90 border border-bg-border flex items-center space-x-3 shadow-xl backdrop-blur-xl">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Badges Unlocked</div>
            <div className="text-xl font-black text-white font-mono">{unlockedCount} / {achievements.length}</div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'Cybersecurity', 'Software Engineering', 'AI Engineering', 'Cloud DevOps', 'Robotics', 'General', 'Mastery', 'Speed'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-blue-600'
                : 'bg-bg-card/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat} {cat === 'all' ? 'Badges' : 'Badges'}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(ach => (
          <div
            key={ach.id}
            className={`p-6 rounded-3xl border transition-all space-y-4 shadow-xl relative overflow-hidden backdrop-blur-xl ${
              ach.unlocked
                ? 'bg-bg-card/90 border-amber-500/40 hover:border-amber-400/70 shadow-amber-500/5'
                : 'bg-bg-card/50 border-slate-800/80 opacity-60'
            }`}
          >
            {/* Top Row: Icon & Status */}
            <div className="flex justify-between items-start">
              <div className={`p-3.5 rounded-2xl border ${
                ach.unlocked
                  ? 'bg-gradient-to-tr from-amber-500/20 to-amber-300/10 text-amber-400 border-amber-500/40 shadow-lg'
                  : 'bg-slate-800/80 text-slate-600 border-slate-700/60'
              }`}>
                {ach.unlocked ? <Trophy className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
              </div>

              <XPBadge xp={ach.XPReward} size="sm" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center">
                {ach.title}
                {ach.unlocked && <CheckCircle2 className="w-4 h-4 text-teal-400 ml-1.5 inline shrink-0" />}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {ach.description}
              </p>
            </div>

            {/* Requirement Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Requirement: <strong className="text-slate-300 font-normal">{ach.requirement}</strong></span>
              {ach.unlocked ? (
                <span className="text-teal-400 font-bold font-mono">Unlocked</span>
              ) : (
                <span className="text-slate-600 font-mono">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
