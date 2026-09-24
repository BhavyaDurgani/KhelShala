import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'from-brand-primary to-brand-secondary',
  showPercentage = true,
  size = 'md'
}) => {
  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs text-slate-300">
        <span className="font-medium text-slate-400">Progress</span>
        {showPercentage && <span className="font-bold text-brand-secondary">{clampedProgress}%</span>}
      </div>
      <div className={`w-full bg-bg-dark/80 rounded-full overflow-hidden border border-slate-700/50 p-0.5 ${heightMap[size]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
