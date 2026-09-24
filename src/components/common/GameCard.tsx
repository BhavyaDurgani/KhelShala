import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, ShieldAlert, Code, Cpu, Server, Bot, Terminal } from 'lucide-react';
import type { Game, UserGameProgress } from '../../types';
import { DifficultyBadge } from './DifficultyBadge';
import { XPBadge } from './XPBadge';
import { ProgressBar } from './ProgressBar';

interface GameCardProps {
  game: Game;
  progress?: UserGameProgress;
}

const getDomainIcon = (domainId: string) => {
  switch (domainId) {
    case 'cybersecurity': return ShieldAlert;
    case 'software_engineering': return Code;
    case 'ai_data_engineering': return Cpu;
    case 'cloud_devops': return Server;
    case 'robotics_embedded': return Bot;
    default: return Terminal;
  }
};

export const GameCard: React.FC<GameCardProps> = ({ game, progress }) => {
  const IconComponent = getDomainIcon(game.domainId);
  const isStarted = progress && progress.completionPercentage > 0;

  return (
    <div className="group relative bg-[#1E293B]/80 rounded-2xl overflow-hidden border border-slate-700/60 hover:border-blue-500/70 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full shadow-xl hover:shadow-blue-600/20">
      {/* Thumbnail artwork */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent" />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200">
            <IconComponent className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            {game.domainId.toUpperCase()}
          </span>
          <XPBadge xp={game.xpReward} size="sm" />
        </div>

        {/* Status / Difficulty badge overlay bottom left */}
        <div className="absolute bottom-3 left-3">
          <DifficultyBadge difficulty={game.difficulty} />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link to={`/games/${game.slug}`} className="block">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 font-display">
              {game.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Dynamic Skill Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {game.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900/80 text-slate-300 border border-slate-700/70">
              {skill}
            </span>
          ))}
        </div>

        {/* Progress state if played */}
        {isStarted && (
          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400">Level {progress.currentLevel}</span>
              <span className="text-amber-400 font-bold">{progress.completionPercentage}%</span>
            </div>
            <ProgressBar progress={progress.completionPercentage} showPercentage={false} size="sm" />
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>{game.estimatedTime}</span>
          </div>

          <Link
            to={`/games/${game.slug}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 group-hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isStarted ? 'Continue' : 'Play Now'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
