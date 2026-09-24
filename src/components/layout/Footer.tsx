import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-dark border-t border-bg-border/80 pt-12 pb-8 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary p-0.5 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-display">
                KHEL<span className="text-brand-secondary">SHALA</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Gamified Learning Platform for Smart India Hackathon 2026. Turning theoretical knowledge into dynamic interactive simulations.
            </p>
            <div className="text-[11px] text-brand-secondary font-semibold">
              « Learn by doing. Play by thinking. Progress through experience. »
            </div>
          </div>

          {/* Col 2: Educational Tracks */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Domain Tracks</h4>
            <ul className="space-y-2">
              <li><Link to="/tracks" className="hover:text-brand-secondary transition-colors">Security & Defense Grid</Link></li>
              <li><Link to="/tracks" className="hover:text-brand-secondary transition-colors">Finance & Investment</Link></li>
              <li><Link to="/tracks" className="hover:text-brand-secondary transition-colors">Healthcare ER Triage</Link></li>
              <li><Link to="/tracks" className="hover:text-brand-secondary transition-colors">Mathematics & Vectors</Link></li>
              <li><Link to="/tracks" className="hover:text-brand-secondary transition-colors">Climate & Eco-Grid</Link></li>
            </ul>
          </div>

          {/* Col 3: Gaming Platform */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/games" className="hover:text-brand-secondary transition-colors">Game Catalog</Link></li>
              <li><Link to="/games/cybercrime-city" className="hover:text-brand-secondary transition-colors">Cybercrime City (MVP Flagship)</Link></li>
              <li><Link to="/leaderboard" className="hover:text-brand-secondary transition-colors">Global Leaderboard</Link></li>
              <li><Link to="/achievements" className="hover:text-brand-secondary transition-colors">Badges & Achievements</Link></li>
              <li><Link to="/profile" className="hover:text-brand-secondary transition-colors">Learner Profile</Link></li>
            </ul>
          </div>

          {/* Col 4: Hackathon / SIH Info */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Smart India Hackathon 2026</h4>
            <p className="text-xs text-slate-400 mb-3">
              Designed & developed for SIH 2026 problem statement. Built with React, TypeScript, Phaser 2D Game Engine & NestJS.
            </p>
            <div className="flex items-center space-x-3 text-slate-300">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-800 text-brand-success border border-slate-700 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified SIH Prototype
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <div>
            © 2026 KhelShala Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-brand-accent fill-current inline" />
            <span>for SIH 2026 Jury Demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
