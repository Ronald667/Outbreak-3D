import React, { useState } from 'react';
import { Play, Trophy, Award, Settings, Shield, Zap, Flame, Globe, Skull } from 'lucide-react';
import { GameMode, MapType, LeaderboardEntry, Achievement } from '../types/game';
import { LeaderboardModal } from './LeaderboardModal';
import { AchievementsModal } from './AchievementsModal';
import { soundManager } from '../utils/audio';

interface MainMenuProps {
  onStartGame: (mode: GameMode, map: MapType) => void;
  leaderboard: LeaderboardEntry[];
  achievements: Achievement[];
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, leaderboard, achievements }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('solo');
  const [selectedMap, setSelectedMap] = useState<MapType>('facility');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const maps: { id: MapType; title: string; subtitle: string; description: string; color: string }[] = [
    {
      id: 'facility',
      title: 'Abandoned Bio-Facility',
      subtitle: 'Underground Research Lab',
      description: 'Tight concrete corridors, flickering emergency lights, and biohazard containment chambers.',
      color: 'from-blue-600/30 to-slate-900'
    },
    {
      id: 'cyber',
      title: 'Neon Cyber Ruin',
      subtitle: 'Futuristic Megacity District',
      description: 'Rain-soaked asphalt streets, towering holographic billboards, and neon-lit alleyways.',
      color: 'from-purple-600/30 to-slate-900'
    },
    {
      id: 'wasteland',
      title: 'Post-Apocalyptic Wasteland',
      subtitle: 'Desert Outpost & Scrap Fort',
      description: 'Open desert dunes, rusted military armored vehicles, and barricaded scrap walls.',
      color: 'from-amber-600/30 to-slate-900'
    }
  ];

  const modes: { id: GameMode; title: string; description: string }[] = [
    { id: 'solo', title: 'Solo Survival', description: 'Endless waves of zombies escalating in difficulty. Test your grit.' },
    { id: 'coop', title: 'Co-Op Squad', description: 'Fight alongside AI squadmates who defend barricades and revive teammates.' },
    { id: 'hardcore', title: 'Hardcore Mode', description: 'Extreme zombie speed, double damage, and scarce ammunition.' },
    { id: 'objective', title: 'Objective Defense', description: 'Defend the central power generator against incoming breach waves.' }
  ];

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-y-auto">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-slate-800/80 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
            <Skull className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">OUTBREAK 3D</h1>
            <p className="text-xs text-red-500 font-mono">ZOMBIE SURVIVAL APEX</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { setShowAchievements(true); soundManager.playClick(); }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-cyan-400" /> Achievements
          </button>
          <button
            onClick={() => { setShowLeaderboard(true); soundManager.playClick(); }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Leaderboard
          </button>
          <button
            onClick={() => { setShowSettings(!showSettings); soundManager.playClick(); }}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto w-full p-8 space-y-10 flex-1">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" /> Unity-Grade Physics Combat & Wave Survival
            </div>
            <h2 className="text-5xl font-black tracking-tight text-white leading-tight">
              SURVIVE THE <span className="text-red-600">HORDE</span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl">
              Immersive 3D environments, physics-based zombie knockdown ragdolls, Pack-a-Punch weapon upgrades, perk vending machines, and intense co-op tactical survival.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onStartGame(selectedMode, selectedMap);
                }}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/40 flex items-center gap-3 transition-all cursor-pointer transform hover:scale-105"
              >
                <Play className="w-6 h-6 fill-white" /> DEPLOY TO COMBAT
              </button>
            </div>
          </div>

          {/* Quick Stats / Info card */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Combat Readiness</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl">
                <span className="text-slate-400">Controls</span>
                <span className="font-mono text-white">WASD + Mouse Look</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl">
                <span className="text-slate-400">Weapon Swap</span>
                <span className="font-mono text-white">Number Keys 1-5</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl">
                <span className="text-slate-400">Arsenal Outpost</span>
                <span className="font-mono text-white">Press B or Shop Button</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-wide">Select Combat Environment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {maps.map((map) => {
              const isSelected = selectedMap === map.id;
              return (
                <div
                  key={map.id}
                  onClick={() => { setSelectedMap(map.id); soundManager.playClick(); }}
                  className={`relative rounded-2xl border p-6 cursor-pointer transition-all bg-gradient-to-b ${map.color} ${
                    isSelected
                      ? 'border-red-500 shadow-2xl shadow-red-500/20 ring-2 ring-red-500/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-mono text-red-400 mb-1">{map.subtitle}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{map.title}</h4>
                  <p className="text-xs text-slate-300">{map.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="space-y-4 pb-12">
          <h3 className="text-lg font-bold text-white tracking-wide">Select Survival Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modes.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => { setSelectedMode(mode.id); soundManager.playClick(); }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500 text-white shadow-xl shadow-red-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <h4 className="font-bold text-base mb-1">{mode.title}</h4>
                  <p className="text-xs text-slate-400">{mode.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Audio Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block">Master Volume ({Math.round(volume * 100)}%)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  soundManager.setVolume(val);
                }}
                className="w-full accent-red-600"
              />
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} entries={leaderboard} />
      <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} achievements={achievements} />
    </div>
  );
};
