import React from 'react';
import { Skull, RotateCcw, Home, Award } from 'lucide-react';
import { GameStats } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  stats: GameStats;
  score: number;
  wave: number;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stats,
  score,
  wave,
  onRestart,
  onHome
}) => {
  if (!isOpen) return null;

  const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-red-500/40 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-center">
        {/* Header */}
        <div className="bg-red-950/40 border-b border-red-500/30 p-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-xl shadow-red-900/40">
            <Skull className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wider">YOU WERE OVERRUN</h2>
          <p className="text-sm text-red-400 mt-1">The zombie horde breached your final defense on Wave {wave}.</p>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Final Survival Score</span>
            <span className="text-4xl font-mono font-black text-amber-400">{score.toLocaleString()} PTS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">ZOMBIES ELIMINATED</span>
              <span className="text-2xl font-mono font-bold text-white">{stats.kills}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">HEADSHOTS</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">{stats.headshots}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">WAVES SURVIVED</span>
              <span className="text-2xl font-mono font-bold text-cyan-400">{wave - 1}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">WEAPON ACCURACY</span>
              <span className="text-2xl font-mono font-bold text-purple-400">{accuracy}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={onRestart}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
            <button
              onClick={onHome}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Home className="w-5 h-5" /> Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
