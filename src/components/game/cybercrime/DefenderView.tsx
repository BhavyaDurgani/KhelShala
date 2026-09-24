import React, { useState } from 'react';
import { Shield, Terminal } from 'lucide-react';
import type { Sector } from '../../../types/cyber';
import { SECURITY_CONTROLS_CATALOG } from '../../../data/cyber/securityControls';
import { useCyberStore } from '../../../store/useCyberStore';

interface Props {
  sectors: Sector[];
  budget: number;
  onDeployControl: (sectorId: string, controlId: string) => void;
  onRemoveControl: (sectorId: string, controlId: string) => void;
  selectedSectorId: string;
  onSelectSector: (id: string) => void;
}

export const DefenderView: React.FC<Props> = ({
  sectors,
  budget,
  onDeployControl,
  onRemoveControl,
  selectedSectorId,
  onSelectSector,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const selectedSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];

  const filteredControls = selectedCategory === 'ALL'
    ? SECURITY_CONTROLS_CATALOG
    : SECURITY_CONTROLS_CATALOG.filter(c => c.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Sectors Overview Grid */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Shield className="h-4 w-4" /> SECTOR TOPOLOGY MAP & ASSET DEFENSE
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sectors.map(sector => {
            const isSelected = sector.id === selectedSector.id;
            const sectorRisk = sector.assets.reduce((sum, a) => sum + a.risk, 0);

            return (
              <div
                key={sector.id}
                onClick={() => onSelectSector(sector.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-cyan-400">{sector.code}</span>
                    <h4 className="font-bold text-white text-sm">{sector.name}</h4>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    sector.status === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                    sector.status === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {sector.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-slate-950/60 p-2 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Active Controls</span>
                    <span className="font-bold text-cyan-300">{sector.deployedControlIds.length} Controls</span>
                  </div>
                  <div className="rounded bg-slate-950/60 p-2 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Sector Risk</span>
                    <span className="font-bold text-rose-400">${sectorRisk.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deployed Controls Badges */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {sector.deployedControlIds.map(ctrlId => {
                    const ctrl = SECURITY_CONTROLS_CATALOG.find(c => c.id === ctrlId);
                    return (
                      <span
                        key={ctrlId}
                        className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-cyan-300 border border-cyan-500/20"
                      >
                        {ctrl?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Deployment Panel */}
      <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="font-bold text-white text-sm">SECURITY CONTROL CATALOG</h4>
            <p className="text-xs text-slate-400">Target: <span className="text-cyan-400 font-semibold">{selectedSector.name}</span></p>
          </div>
          <button
            onClick={() => useCyberStore.getState().openCyberTerminal()}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-slate-950 transition-all"
          >
            <Terminal className="h-3.5 w-3.5" /> WRITE CODE RULE
          </button>
        </div>

        {/* Categories Selector */}
        <div className="mt-3 flex gap-1 overflow-x-auto pb-2 text-[11px]">
          {['ALL', 'PHYSICAL', 'ADMINISTRATIVE', 'NETWORK', 'ENDPOINT', 'SECOPS'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Controls List */}
        <div className="mt-3 max-h-[380px] space-y-3 overflow-y-auto pr-1">
          {filteredControls.map(ctrl => {
            const isDeployed = selectedSector.deployedControlIds.includes(ctrl.id);
            const canAfford = budget >= ctrl.cost;

            return (
              <div
                key={ctrl.id}
                className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-white text-xs">{ctrl.name}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ctrl.description}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-400">${ctrl.cost}</span>
                </div>

                <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                  <div className="flex gap-2 text-slate-400">
                    <span>Friction: <strong className="text-amber-400">+{ctrl.availabilityFriction}</strong></span>
                    <span>C Bonus: <strong className="text-cyan-400">+{ctrl.confidentialityBonus}</strong></span>
                  </div>

                  {isDeployed ? (
                    <button
                      onClick={() => onRemoveControl(selectedSector.id, ctrl.id)}
                      className="rounded bg-rose-950 px-2.5 py-1 font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-900 transition-colors"
                    >
                      Remove (Refund)
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => onDeployControl(selectedSector.id, ctrl.id)}
                      className={`rounded px-3 py-1 font-bold transition-all ${
                        canAfford
                          ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Deploy' : 'Insufficient $'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
