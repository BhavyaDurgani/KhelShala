import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Eye } from 'lucide-react';
import type { ExecutionFrame } from '../../../types/algorithm';
import { soundEngine } from '../../../engine/common/soundEngine';

interface Props {
  frames: ExecutionFrame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSetFrame: (index: number) => void;
}

export const AlgorithmVisualizerBar: React.FC<Props> = ({
  frames,
  currentFrameIndex,
  isPlaying,
  onTogglePlay,
  onSetFrame,
}) => {
  if (frames.length === 0) return null;

  const currentFrame = frames[currentFrameIndex] || frames[0];

  useEffect(() => {
    if (currentFrame) {
      if (currentFrame.message.includes('MATCH FOUND')) {
        soundEngine.playMatchFoundFanfare();
      } else {
        soundEngine.playInspectBeep();
      }
    }
  }, [currentFrameIndex]);

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400">
          <Eye className="h-4 w-4" />
          <span className="font-bold">3D ALGORITHM VISUALIZATION STEP PLAYBACK</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentFrameIndex === 0}
            onClick={() => onSetFrame(Math.max(0, currentFrameIndex - 1))}
            className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 font-bold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            disabled={currentFrameIndex === frames.length - 1}
            onClick={() => onSetFrame(Math.min(frames.length - 1, currentFrameIndex + 1))}
            className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          <span className="text-slate-400 font-bold ml-2">
            Frame {currentFrameIndex + 1} / {frames.length}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs font-mono text-cyan-300">
        • {currentFrame.message}
      </div>
    </div>
  );
};
