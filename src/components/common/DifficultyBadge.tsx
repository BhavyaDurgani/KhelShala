import React from 'react';
import type { DifficultyLevel } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const badgeMap: Record<DifficultyLevel, { bg: string; text: string; border: string; stars: string }> = {
    Beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', stars: '★☆☆☆' },
    Intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', stars: '★★☆☆' },
    Advanced: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', stars: '★★★☆' },
    Expert: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', stars: '★★★★' }
  };

  const style = badgeMap[difficulty] || badgeMap.Beginner;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      <span className="mr-1 text-[10px]">{style.stars}</span>
      {difficulty}
    </span>
  );
};
