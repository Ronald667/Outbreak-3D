import React from 'react';
import { Trophy, X, Globe, Shield } from 'lucide-react';
import { LeaderboardEntry, MapType } from '../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, entries }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Global Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No survival records yet. Be the first to conquer the outbreak!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.sort((a, b) => b.score - a.score).map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : idx === 1
                      ? 'bg-slate-200/10 border-slate-300/30 text-slate-200'
                      : idx === 2
                      ? 'bg-amber-700/10 border-amber-600/30 text-amber-300'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white">{entry.name}</div>
                      <div className="text-xs opacity-75 capitalize">Map: {entry.map} · {entry.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-amber-400">{entry.score.toLocaleString()} PTS</div>
                    <div className="text-xs text-slate-400">Wave {entry.wave} · {entry.kills} Kills</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
