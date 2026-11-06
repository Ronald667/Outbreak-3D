import React from 'react';
import { Skull, Target, Hammer, Sparkles } from 'lucide-react';

export interface KillFeedItem {
  id: string;
  type: 'kill' | 'headshot' | 'craft' | 'perk' | 'upgrade';
  text: string;
  timestamp: number;
}

interface KillFeedProps {
  items: KillFeedItem[];
}

export const KillFeed: React.FC<KillFeedProps> = ({ items }) => {
  // Keep only the last 5 items
  const recentItems = items.slice(-5);

  if (recentItems.length === 0) return null;

  return (
    <div className="absolute top-20 right-6 z-20 flex flex-col items-end gap-2 pointer-events-none max-w-sm">
      {recentItems.map((item) => {
        const isHeadshot = item.type === 'headshot';
        const isCraft = item.type === 'craft';
        const isUpgrade = item.type === 'upgrade';

        return (
          <div
            key={item.id}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl backdrop-blur-md border text-xs font-mono shadow-xl transition-all animate-slideInRight ${
              isHeadshot
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : isCraft
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : isUpgrade
                ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}
          >
            {isHeadshot ? (
              <Target className="w-4 h-4 text-amber-400 shrink-0" />
            ) : isCraft ? (
              <Hammer className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : isUpgrade ? (
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            ) : (
              <Skull className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="font-bold tracking-wide">{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};
