import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Gamepad2, SlidersHorizontal, Layers } from 'lucide-react';
import { ApiService } from '../services/api';
import type { Game, Track } from '../types';
import { GameCard } from '../components/common/GameCard';
import { useStore } from '../store/useStore';

export const GamesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userProgress } = useStore();

  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'all');

  useEffect(() => {
    const loadGamesCatalog = async () => {
      setLoading(true);
      try {
        const [gamesData, tracksData] = await Promise.all([
          ApiService.getGames({
            domainId: selectedDomain,
            difficulty: selectedDifficulty,
            search: searchQuery
          }),
          ApiService.getTracks()
        ]);
        setGames(gamesData);
        setTracks(tracksData);
      } catch (err) {
        console.error('Failed fetching games catalog', err);
      } finally {
        setLoading(false);
      }
    };

    loadGamesCatalog();
  }, [selectedDomain, selectedDifficulty, searchQuery]);

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    if (domainId === 'all') {
      searchParams.delete('domain');
    } else {
      searchParams.set('domain', domainId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span>Interactive Gaming Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          All Interactive Simulations & Games
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Browse data-driven engineering & technology games across cybersecurity, software engineering, AI data pipelines, cloud architecture, and robotics.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-bg-card/90 p-4 sm:p-5 rounded-2xl border border-bg-border space-y-4 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Input (6 cols) */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Search by game name, skill (e.g. Threat Detection), or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-surface border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          </div>

          {/* Difficulty Dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-bg-surface border border-slate-700/80 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-brand-primary"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner ★☆☆☆</option>
              <option value="Intermediate">Intermediate ★★☆☆</option>
              <option value="Advanced">Advanced ★★★☆</option>
              <option value="Expert">Expert ★★★★</option>
            </select>
          </div>

          {/* Reset Filters button (3 cols) */}
          <div className="md:col-span-3 flex justify-end">
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-1 border border-slate-700/60"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>Reset Filters</span>
            </button>
          </div>

        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center shrink-0">
            <Layers className="w-3.5 h-3.5 mr-1 text-brand-primary" />
            Domains:
          </span>

          <button
            onClick={() => handleDomainChange('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedDomain === 'all'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                : 'bg-bg-surface text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            All Domains
          </button>

          {tracks.map(t => (
            <button
              key={t.id}
              onClick={() => handleDomainChange(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedDomain === t.id
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                  : 'bg-bg-surface text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Games Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading catalog data from backend API...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="p-12 rounded-2xl bg-bg-card/90 border border-bg-border text-center space-y-3 backdrop-blur-xl">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No games matched your filters</h3>
          <p className="text-xs text-slate-400">Try adjusting search keywords or resetting domain filters.</p>
          <button
            onClick={() => {
              setSelectedDomain('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
              setSearchParams({});
            }}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-md shadow-brand-primary/20 hover:bg-blue-600 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              progress={userProgress.find(p => p.gameId === game.id)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
