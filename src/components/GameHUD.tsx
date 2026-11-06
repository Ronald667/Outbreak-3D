import React from 'react';
import { Heart, Shield, Zap, ShoppingBag, Pause, Hammer } from 'lucide-react';
import { Weapon } from '../types/game';
import { KillFeed, KillFeedItem } from './KillFeed';

interface GameHUDProps {
  health: number;
  maxHealth: number;
  armor: number;
  points: number;
  wave: number;
  zombiesRemaining: number;
  currentWeapon: Weapon;
  ammo: number;
  reserveAmmo: number;
  activePerks: string[];
  interactionPrompt: string | null;
  onOpenShop: () => void;
  onOpenCrafting: () => void;
  onPause: () => void;
  grenadesCount: number;
  components: Record<string, number>;
  killFeedItems: KillFeedItem[];
}

export const GameHUD: React.FC<GameHUDProps> = ({
  health,
  maxHealth,
  armor,
  points,
  wave,
  zombiesRemaining,
  currentWeapon,
  ammo,
  reserveAmmo,
  activePerks,
  interactionPrompt,
  onOpenShop,
  onOpenCrafting,
  onPause,
  grenadesCount,
  components,
  killFeedItems
}) => {
  const hpPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none z-10">
      {/* Top Right Kill Feed Overlay */}
      <KillFeed items={killFeedItems} />

      {/* Top Bar */}
      <div className="flex items-start justify-between">
        {/* Left: Health & Points */}
        <div className="space-y-3">
          {/* Health Bar */}
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-xl w-64">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span className="flex items-center gap-1.5 text-red-400">
                <Heart className="w-4 h-4 fill-red-400" /> INTEGRITY
              </span>
              <span className="font-mono">{Math.round(health)} / {maxHealth}</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Points & Scavenged Components */}
          <div className="bg-slate-950/80 backdrop-blur-md border border-amber-500/30 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">CREDITS</span>
              <span className="text-xl font-mono font-black text-amber-400">{points.toLocaleString()} PTS</span>
            </div>
            <div className="border-l border-slate-800 pl-4 flex gap-3 text-xs font-mono text-slate-300">
              <div>Scrap: <span className="text-white font-bold">{components.scrap || 0}</span></div>
              <div>Wood: <span className="text-white font-bold">{components.wood || 0}</span></div>
              <div>Wire: <span className="text-white font-bold">{components.wire || 0}</span></div>
            </div>
          </div>
        </div>

        {/* Center: Wave Status */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-6 py-3 rounded-2xl shadow-xl text-center">
          <span className="text-xs font-bold tracking-widest text-slate-400 block mb-0.5">WAVE STATUS</span>
          <div className="text-2xl font-black text-white tracking-wide">WAVE {wave}</div>
          <div className="text-xs font-mono text-red-400 mt-0.5">{zombiesRemaining} Undead Remaining</div>
        </div>

        {/* Right: Actions & Pause */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={onOpenShop}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Shop [B]
          </button>
          <button
            onClick={onOpenCrafting}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Hammer className="w-4 h-4" /> Craft [C]
          </button>
          <button
            onClick={onPause}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-slate-700 backdrop-blur-md shadow-lg transition-all cursor-pointer"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Screen Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white/80 shadow-md ring-1 ring-black/50" />
        <div className="absolute w-4 h-0.5 bg-white/60 -left-4" />
        <div className="absolute w-4 h-0.5 bg-white/65 -right-4" />
        <div className="absolute w-0.5 h-4 bg-white/60 -top-4" />
        <div className="absolute w-0.5 h-4 bg-white/60 -bottom-4" />
      </div>

      {/* Interaction Prompt Notification */}
      {interactionPrompt && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-300 px-6 py-3 rounded-xl shadow-2xl animate-pulse text-sm font-bold">
          {interactionPrompt}
        </div>
      )}

      {/* Bottom Bar: Weapon Info, Active Perks & Grenades */}
      <div className="flex items-end justify-between">
        {/* Active Perks */}
        <div className="flex gap-2">
          {activePerks.map((perkid) => {
            return (
              <div
                key={perkid}
                className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 p-2.5 rounded-xl flex items-center gap-2 shadow-xl"
                title={perkid}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">{perkid}</span>
              </div>
            );
          })}
        </div>

        {/* Weapon & Ammo Display */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-6">
          <div>
            <div className="text-xs text-slate-400 font-medium">CURRENT WEAPON</div>
            <div className="text-lg font-bold text-white tracking-wide">
              {currentWeapon?.name} {currentWeapon?.isUpgraded ? '(★)' : ''}
            </div>
          </div>
          <div className="border-l border-slate-800 pl-6 text-right">
            <div className="text-3xl font-mono font-black text-amber-400">
              {ammo} <span className="text-sm font-normal text-slate-500">/ {reserveAmmo}</span>
            </div>
            <div className="text-xs text-slate-400">PRESS R TO RELOAD</div>
          </div>
          <div className="border-l border-slate-800 pl-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
              G
            </div>
            <div>
              <div className="text-xs text-slate-400">GRENADES</div>
              <div className="text-sm font-bold text-white">{grenadesCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
