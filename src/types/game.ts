export type GameMode = 'solo' | 'coop' | 'hardcore' | 'objective';
export type MapType = 'facility' | 'cyber' | 'wasteland';
export type WeaponId = 'pistol' | 'shotgun' | 'assault' | 'sniper' | 'raygun';

export interface Weapon {
  id: WeaponId;
  name: string;
  damage: number;
  fireRate: number; // shots per second
  ammo: number;
  maxAmmo: number;
  magSize: number;
  reloadTime: number; // seconds
  cost: number;
  isUpgraded: boolean;
  upgradeCost: number;
  description: string;
}

export type PerkId = 'juggernog' | 'speedcola' | 'doubletap' | 'staminup' | 'quickrevive';

export interface Perk {
  id: PerkId;
  name: string;
  cost: number;
  description: string;
  icon: string;
  color: string;
  active: boolean;
}

export interface CraftingComponent {
  id: 'scrap' | 'wood' | 'wire' | 'explosives';
  name: string;
  count: number;
  icon: string;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  category: 'survival' | 'weapon' | 'trap' | 'ammo';
  description: string;
  cost: {
    scrap?: number;
    wood?: number;
    wire?: number;
    explosives?: number;
  };
  outputCount: number;
}

export interface Zombie {
  id: string;
  type: 'walker' | 'runner' | 'brute' | 'crawler';
  x: number;
  z: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  attackCooldown: number;
  isCrawler: boolean;
  meshGroup?: any;
}

export interface Teammate {
  id: string;
  name: string;
  x: number;
  z: number;
  hp: number;
  maxHp: number;
  targetZombieId: string | null;
}

export interface Grenade {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  timer: number;
}

export interface GameStats {
  kills: number;
  headshots: number;
  wavesSurvived: number;
  pointsEarned: number;
  shotsFired: number;
  shotsHit: number;
  itemsCrafted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface LeaderboardEntry {
  name: string;
  wave: number;
  kills: number;
  score: number;
  map: MapType;
  date: string;
}
