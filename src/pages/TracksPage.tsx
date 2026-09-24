import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';
import type { Track } from '../types';
import { DifficultyBadge } from '../components/common/DifficultyBadge';
import { useStore } from '../store/useStore';

export const TracksPage: React.FC = () => {
  const { setSelectedTrack, activeTrackId } = useStore();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await ApiService.getTracks();
        setTracks(data);
      } catch (err) {
        console.error('Error loading tracks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Educational Domains</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Learning Domain Tracks
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Choose a domain track to focus your experiential learning path. Future domains can be dynamically added via data configuration.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 font-mono">Loading domain tracks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map(t => {
            const isActive = activeTrackId === t.id;

            return (
              <div
                key={t.id}
                className={`bg-bg-card/90 rounded-3xl overflow-hidden border transition-all space-y-6 shadow-2xl relative group backdrop-blur-xl ${
                  isActive ? 'border-brand-primary glow-sapphire' : 'border-bg-border hover:border-slate-700'
                }`}
              >
                {/* Track Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-bg-surface">
                  <img
                    src={t.banner}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full bg-bg-dark/90 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-200 font-mono">
                      {t.gameCount} Games
                    </span>
                    <DifficultyBadge difficulty={t.difficulty} />
                  </div>
                </div>

                {/* Track Content */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white font-display flex items-center justify-between">
                      <span>{t.name}</span>
                      {isActive && (
                        <span className="text-xs px-3 py-1 rounded-full bg-brand-primary text-white font-bold flex items-center shadow-md shadow-brand-primary/20">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-400" /> Active Track
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400 font-semibold block">Key Skills Developed:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.skills.map((skill, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedTrack(t.id)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isActive ? 'Active Domain Selected' : 'Set as Active Track'}
                    </button>

                    <Link
                      to={`/games?domain=${t.id}`}
                      className="py-3 px-4 rounded-xl bg-bg-surface hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-xs font-bold border border-slate-700 flex items-center space-x-1 transition-colors"
                    >
                      <span>Explore Games</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
