import React, { useState } from 'react';
import { ShoppingBag, Zap, Shield, Sparkles, X, Flame, Footprints } from 'lucide-react';
import { Weapon, Perk } from '../types/game';
import { INITIAL_WEAPONS, PERKS } from '../utils/gameConstants';
import { soundManager } from '../utils/audio';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  currentWeaponId: string;
  ownedWeapons: Record<string, Weapon>;
  activePerks: string[];
  onBuyWeapon: (weaponId: string) => void;
  onUpgradeWeapon: () => void;
  onBuyPerk: (perkId: string) => void;
  onSpinMysteryBox: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  points,
  currentWeaponId,
  ownedWeapons,
  activePerks,
  onBuyWeapon,
  onUpgradeWeapon,
  onBuyPerk,
  onSpinMysteryBox
}) => {
  const [activeTab, setActiveTab] = useState<'weapons' | 'perks' | 'mystery'>('weapons');

  if (!isOpen) return null;

  const currentWeapon = ownedWeapons[currentWeaponId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Survival Arsenal & Outpost Shop</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 font-mono font-bold">
              {points.toLocaleString()} PTS
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-2 pt-2">
          <button
            onClick={() => { setActiveTab('weapons'); soundManager.playClick(); }}
            className={`px-4 py-2.5 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'weapons'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Weapons & Pack-a-Punch
          </button>
          <button
            onClick={() => { setActiveTab('perks'); soundManager.playClick(); }}
            className={`px-4 py-2.5 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'perks'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Perk-a-Cola Vending
          </button>
          <button
            onClick={() => { setActiveTab('mystery'); soundManager.playClick(); }}
            className={`px-4 py-2.5 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'mystery'
                ? 'border-purple-400 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Mystery Box (950 PTS)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'weapons' && (
            <div className="space-y-6">
              {/* Pack-a-Punch Upgrade Section */}
              {currentWeapon && (
                <div className="bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/40 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
                      <Sparkles className="w-4 h-4" /> Pack-a-Punch Station
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {currentWeapon.name} {currentWeapon.isUpgraded ? '(UPGRADED)' : ''}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {currentWeapon.isUpgraded
                        ? 'Maximum upgrade power achieved. Double damage & magazine capacity.'
                        : 'Upgrade current weapon to unleash supreme firepower.'}
                    </p>
                  </div>
                  {!currentWeapon.isUpgraded && (
                    <button
                      onClick={() => {
                        if (points >= currentWeapon.upgradeCost) {
                          onUpgradeWeapon();
                          soundManager.playPerkJingle();
                        }
                      }}
                      disabled={points < currentWeapon.upgradeCost}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                        points >= currentWeapon.upgradeCost
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Upgrade [{currentWeapon.upgradeCost} PTS]
                    </button>
                  )}
                </div>
              )}

              {/* Weapon Catalog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(INITIAL_WEAPONS).map((w) => {
                  const owned = !!ownedWeapons[w.id];
                  const isCurrent = currentWeaponId === w.id;
                  return (
                    <div
                      key={w.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500/50'
                          : owned
                          ? 'bg-slate-800/40 border-slate-700'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-lg">{w.name}</h4>
                          <span className="text-xs font-mono text-amber-400">{w.cost === 0 ? 'Default' : `${w.cost} PTS`}</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">{w.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-300 mb-4">
                          <div className="bg-slate-950/60 p-2 rounded-lg">
                            <span className="text-slate-500 block">DAMAGE</span>
                            <span className="font-bold text-white">{w.damage}</span>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded-lg">
                            <span className="text-slate-500 block">FIRE RATE</span>
                            <span className="font-bold text-white">{w.fireRate}/s</span>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded-lg">
                            <span className="text-slate-500 block">MAG SIZE</span>
                            <span className="font-bold text-white">{w.magSize}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {isCurrent ? (
                          <div className="w-full py-2 bg-amber-500/20 text-amber-400 font-bold text-xs text-center rounded-lg border border-amber-500/30">
                            Equipped
                          </div>
                        ) : owned ? (
                          <button
                            onClick={() => { onBuyWeapon(w.id); soundManager.playClick(); }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Switch Weapon
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (points >= w.cost) {
                                onBuyWeapon(w.id);
                                soundManager.playClick();
                              }
                            }}
                            disabled={points < w.cost}
                            className={`w-full py-2 font-bold text-xs rounded-lg transition-all ${
                              points >= w.cost
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-lg shadow-amber-500/20'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            Purchase [{w.cost} PTS]
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'perks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(PERKS).map((perk) => {
                const hasPerk = activePerks.includes(perk.id);
                return (
                  <div
                    key={perk.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                      hasPerk
                        ? 'bg-cyan-500/10 border-cyan-500/50'
                        : 'bg-slate-800/40 border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Zap className={`w-5 h-5 ${perk.color}`} />
                          <h4 className="font-bold text-white text-base">{perk.name}</h4>
                        </div>
                        <span className="text-xs font-mono text-cyan-400">{perk.cost} PTS</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4">{perk.description}</p>
                    </div>

                    <div>
                      {hasPerk ? (
                        <div className="w-full py-2 bg-cyan-500/20 text-cyan-400 font-bold text-xs text-center rounded-lg border border-cyan-500/30">
                          Active Perk
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (points >= perk.cost) {
                              onBuyPerk(perk.id);
                              soundManager.playPerkJingle();
                            }
                          }}
                          disabled={points < perk.cost}
                          className={`w-full py-2 font-bold text-xs rounded-lg transition-all ${
                            points >= perk.cost
                              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-lg shadow-cyan-500/20'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Buy Perk [{perk.cost} PTS]
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'mystery' && (
            <div className="text-center py-12 space-y-6">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-white mb-2">Mystery Weapon Box</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Risk 950 points for a randomized high-tier weapon or legendary Ray Gun!
                </p>
                <button
                  onClick={() => {
                    if (points >= 950) {
                      onSpinMysteryBox();
                      soundManager.playPerkJingle();
                    }
                  }}
                  disabled={points < 950}
                  className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-xl ${
                    points >= 950
                      ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-purple-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Spin Mystery Box [950 PTS]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
