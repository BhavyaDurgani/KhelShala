import React from 'react';
import { Zap } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
}

export const XPBadge: React.FC<XPBadgeProps> = ({ xp, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 space-x-2 font-bold'
  };

  return (
    <div className={`inline-flex items-center rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 ${sizeClasses[size]}`}>
      <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
      <span>+{xp} XP</span>
    </div>
  );
};
