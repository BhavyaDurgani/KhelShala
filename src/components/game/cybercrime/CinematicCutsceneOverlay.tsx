import React from 'react';
import { Play, FastForward, MessageSquareQuote } from 'lucide-react';
import type { CutsceneDialog } from '../../../types/cyber';

interface Props {
  dialog: CutsceneDialog;
  currentIndex: number;
  totalDialogs: number;
  onNext: () => void;
  onSkip: () => void;
}

export const CinematicCutsceneOverlay: React.FC<Props> = ({
  dialog,
  currentIndex,
  totalDialogs,
  onNext,
  onSkip,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-6 z-40 mx-auto w-full max-w-4xl px-4">
      <div className="relative rounded-2xl border border-cyan-500/40 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-4">
          <img
            src={dialog.avatar}
            alt={dialog.speakerName}
            className="h-20 w-20 rounded-xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="h-4 w-4 text-cyan-400" />
                <h4 className="font-bold text-cyan-400">{dialog.speakerName}</h4>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase font-semibold text-cyan-300 border border-cyan-500/30">
                  {dialog.emotion}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {totalDialogs}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-100 leading-relaxed font-sans font-medium">
              "{dialog.text}"
            </p>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                onClick={onSkip}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <FastForward className="h-3.5 w-3.5" /> Skip Cutscene
              </button>

              <button
                onClick={onNext}
                className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
              >
                Continue <Play className="h-3.5 w-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
