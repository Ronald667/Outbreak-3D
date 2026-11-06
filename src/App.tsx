/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameMode, MapType, Weapon, GameStats, LeaderboardEntry, Achievement, CraftingRecipe } from './types/game';
import { INITIAL_WEAPONS, INITIAL_ACHIEVEMENTS } from './utils/gameConstants';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { ShopModal } from './components/ShopModal';
import { CraftingModal } from './components/CraftingModal';
import { GameOverModal } from './components/GameOverModal';
import { KillFeedItem } from './components/KillFeed';
import { soundManager } from './utils/audio';

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [mapType, setMapType] = useState<MapType>('facility');

  // Player gameplay state
  const [points, setPoints] = useState(500);
  const [currentWeaponId, setCurrentWeaponId] = useState<string>('pistol');
  const [ownedWeapons, setOwnedWeapons] = useState<Record<string, Weapon>>({
    pistol: { ...INITIAL_WEAPONS.pistol }
  });
  const [activePerks, setActivePerks] = useState<string[]>([]);
  const [grenadesCount, setGrenadesCount] = useState(3);
  const [components, setComponents] = useState<Record<string, number>>({
    scrap: 10,
    wood: 10,
    wire: 5,
    explosives: 2
  });
  const [killFeedItems, setKillFeedItems] = useState<KillFeedItem[]>([]);

  // HUD sync state
  const [hudData, setHudData] = useState({
    health: 100,
    maxHealth: 100,
    armor: 50,
    points: 500,
    wave: 1,
    zombiesRemaining: 10,
    currentWeapon: INITIAL_WEAPONS.pistol,
    ammo: 8,
    reserveAmmo: 64,
    activePerks: [] as string[],
    interactionPrompt: null as string | null,
    grenadesCount: 3,
    components: { scrap: 10, wood: 10, wire: 5, explosives: 2 } as Record<string, number>
  });

  const [shopOpen, setShopOpen] = useState(false);
  const [craftingOpen, setCraftingOpen] = useState(false);
  const [finalStats, setFinalStats] = useState<GameStats>({
    kills: 0,
    headshots: 0,
    wavesSurvived: 0,
    pointsEarned: 500,
    shotsFired: 0,
    shotsHit: 0,
    itemsCrafted: 0
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { name: 'ApexSurvivor', wave: 18, kills: 240, score: 38400, map: 'facility', date: '2026-11-05' },
    { name: 'NeonViper', wave: 12, kills: 160, score: 24500, map: 'cyber', date: '2026-11-04' }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const addKillFeedEvent = (type: KillFeedItem['type'], text: string) => {
    const newItem: KillFeedItem = {
      id: Math.random().toString(),
      type,
      text,
      timestamp: Date.now()
    };
    setKillFeedItems(prev => [...prev.slice(-4), newItem]);
  };

  const handleStartGame = (mode: GameMode, map: MapType) => {
    setGameMode(mode);
    setMapType(map);
    setPoints(500);
    setCurrentWeaponId('pistol');
    setOwnedWeapons({ pistol: { ...INITIAL_WEAPONS.pistol } });
    setActivePerks([]);
    setGrenadesCount(3);
    setComponents({ scrap: 10, wood: 10, wire: 5, explosives: 2 });
    setKillFeedItems([
      { id: '1', type: 'craft', text: 'Deployed to combat zone. Stay sharp!', timestamp: Date.now() }
    ]);
    setGameState('playing');
  };

  const handleGameOver = (score: number, wave: number, stats: GameStats) => {
    setFinalStats(stats);
    setGameState('gameover');

    setLeaderboard(prev => [
      ...prev,
      {
        name: 'Player',
        wave,
        kills: stats.kills,
        score,
        map: mapType,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const handleBuyWeapon = (weaponId: string) => {
    const weapon = INITIAL_WEAPONS[weaponId];
    if (!weapon) return;

    if (points >= weapon.cost || weapon.cost === 0) {
      if (weapon.cost > 0) {
        setPoints(p => p - weapon.cost);
      }
      setOwnedWeapons(prev => ({
        ...prev,
        [weaponId]: { ...weapon }
      }));
      setCurrentWeaponId(weaponId);
      addKillFeedEvent('upgrade', `Acquired ${weapon.name}`);
    }
  };

  const handleUpgradeWeapon = () => {
    const current = ownedWeapons[currentWeaponId];
    if (!current || current.isUpgraded) return;

    if (points >= current.upgradeCost) {
      setPoints(p => p - current.upgradeCost);
      setOwnedWeapons(prev => ({
        ...prev,
        [currentWeaponId]: {
          ...current,
          isUpgraded: true,
          damage: current.damage * 2,
          magSize: current.magSize * 2,
          name: `${current.name} (Upgraded)`
        }
      }));
      addKillFeedEvent('upgrade', `Pack-a-Punch Upgraded ${current.name}!`);
    }
  };

  const handleBuyPerk = (perkId: string) => {
    if (activePerks.includes(perkId)) return;
    setActivePerks(prev => [...prev, perkId]);
    addKillFeedEvent('perk', `Purchased Perk: ${perkId.toUpperCase()}`);
  };

  const handleSpinMysteryBox = () => {
    if (points < 950) return;
    setPoints(p => p - 950);
    const weaponKeys = Object.keys(INITIAL_WEAPONS);
    const randomKey = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
    handleBuyWeapon(randomKey);
  };

  const handleAddComponent = (type: string, amount: number) => {
    setComponents(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + amount
    }));
  };

  const handleCraftItem = (recipe: CraftingRecipe) => {
    setComponents(prev => {
      const next = { ...prev };
      Object.entries(recipe.cost).forEach(([mat, qty]) => {
        next[mat] = Math.max(0, (next[mat] || 0) - (qty as number));
      });
      return next;
    });

    if (recipe.id === 'medkit') {
      setHudData(prev => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + 75),
        components: { ...prev.components, ...components }
      }));
    } else if (recipe.id === 'ammo_box') {
      setGrenadesCount(g => g + 1);
    }

    addKillFeedEvent('craft', `Crafted ${recipe.name}!`);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden font-sans select-none">
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          leaderboard={leaderboard}
          achievements={achievements}
        />
      )}

      {gameState === 'playing' && (
        <>
          <GameCanvas
            mode={gameMode}
            mapType={mapType}
            onGameOver={handleGameOver}
            onOpenShop={() => setShopOpen(true)}
            onOpenCrafting={() => setCraftingOpen(true)}
            onUpdateHUD={data => {
              setHudData(data);
              setPoints(data.points);
            }}
            shopOpen={shopOpen}
            craftingOpen={craftingOpen}
            onTriggerShop={() => setShopOpen(prev => !prev)}
            onTriggerCrafting={() => setCraftingOpen(prev => !prev)}
            currentWeaponId={currentWeaponId}
            ownedWeapons={ownedWeapons}
            activePerks={activePerks}
            grenadesCount={grenadesCount}
            components={components}
            onAddComponent={handleAddComponent}
            onAddKillFeedEvent={addKillFeedEvent}
          />

          <GameHUD
            health={hudData.health}
            maxHealth={hudData.maxHealth}
            armor={hudData.armor}
            points={points}
            wave={hudData.wave}
            zombiesRemaining={hudData.zombiesRemaining}
            currentWeapon={ownedWeapons[currentWeaponId] || INITIAL_WEAPONS.pistol}
            ammo={hudData.ammo}
            reserveAmmo={hudData.reserveAmmo}
            activePerks={activePerks}
            interactionPrompt={hudData.interactionPrompt}
            onOpenShop={() => setShopOpen(true)}
            onOpenCrafting={() => setCraftingOpen(true)}
            onPause={() => setGameState('menu')}
            grenadesCount={grenadesCount}
            components={components}
            killFeedItems={killFeedItems}
          />

          <ShopModal
            isOpen={shopOpen}
            onClose={() => setShopOpen(false)}
            points={points}
            currentWeaponId={currentWeaponId}
            ownedWeapons={ownedWeapons}
            activePerks={activePerks}
            onBuyWeapon={handleBuyWeapon}
            onUpgradeWeapon={handleUpgradeWeapon}
            onBuyPerk={handleBuyPerk}
            onSpinMysteryBox={handleSpinMysteryBox}
          />

          <CraftingModal
            isOpen={craftingOpen}
            onClose={() => setCraftingOpen(false)}
            components={components}
            onCraftItem={handleCraftItem}
          />
        </>
      )}

      {gameState === 'gameover' && (
        <GameOverModal
          isOpen={true}
          stats={finalStats}
          score={finalStats.pointsEarned}
          wave={hudData.wave}
          onRestart={() => handleStartGame(gameMode, mapType)}
          onHome={() => setGameState('menu')}
        />
      )}
    </div>
  );
}
