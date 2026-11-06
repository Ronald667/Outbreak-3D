import React from 'react';
import { Award, X, CheckCircle, Circle } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, achievements }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Survivor Achievements</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {achievements.map((ach) => {
            const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  ach.unlocked
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-800/40 border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {ach.unlocked ? (
                    <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-8 h-8 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-bold text-white">{ach.title}</h3>
                    <p className="text-xs text-slate-400">{ach.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 min-w-[120px]">
                  <div className="text-xs font-medium text-slate-300 mb-1">
                    {ach.progress} / {ach.maxProgress} ({percent}%)
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        ach.unlocked ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
