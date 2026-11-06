import { Weapon, Perk, CraftingRecipe, Achievement } from '../types/game';

export const INITIAL_WEAPONS: Record<string, Weapon> = {
  pistol: {
    id: 'pistol',
    name: 'M1911 Pistol',
    damage: 25,
    fireRate: 4,
    ammo: 8,
    maxAmmo: 64,
    magSize: 8,
    reloadTime: 1.5,
    cost: 0,
    isUpgraded: false,
    upgradeCost: 500,
    description: 'Standard sidearm. Reliable in a pinch.'
  },
  shotgun: {
    id: 'shotgun',
    name: 'Trench Shotgun',
    damage: 120,
    fireRate: 1.2,
    ammo: 6,
    maxAmmo: 36,
    magSize: 6,
    reloadTime: 2.5,
    cost: 1200,
    isUpgraded: false,
    upgradeCost: 2500,
    description: 'Devastating close-range spread.'
  },
  assault: {
    id: 'assault',
    name: 'M4A1 Commando',
    damage: 35,
    fireRate: 10,
    ammo: 30,
    maxAmmo: 150,
    magSize: 30,
    reloadTime: 2.0,
    cost: 2000,
    isUpgraded: false,
    upgradeCost: 4000,
    description: 'High fire rate assault rifle for crowd control.'
  },
  sniper: {
    id: 'sniper',
    name: 'Barrett .50 Cal',
    damage: 250,
    fireRate: 0.8,
    ammo: 5,
    maxAmmo: 25,
    magSize: 5,
    reloadTime: 3.0,
    cost: 3000,
    isUpgraded: false,
    upgradeCost: 5000,
    description: 'One-shot penetration power through multiple zombies.'
  },
  raygun: {
    id: 'raygun',
    name: 'Wunderwaffe Ray Gun',
    damage: 200,
    fireRate: 5,
    ammo: 20,
    maxAmmo: 80,
    magSize: 20,
    reloadTime: 2.2,
    cost: 5000,
    isUpgraded: false,
    upgradeCost: 8000,
    description: 'Experimental plasma energy emitter with splash damage.'
  }
};

export const PERKS: Record<string, Perk> = {
  juggernog: {
    id: 'juggernog',
    name: 'Juggernog Soda',
    cost: 2500,
    description: 'Increases max health from 100 to 250 and reduces incoming damage.',
    icon: 'Shield',
    color: 'text-red-500',
    active: false
  },
  speedcola: {
    id: 'speedcola',
    name: 'Speed Cola',
    cost: 3000,
    description: 'Cuts weapon reload time in half and speeds up equipment handling.',
    icon: 'Zap',
    color: 'text-emerald-500',
    active: false
  },
  doubletap: {
    id: 'doubletap',
    name: 'Double Tap Root Beer',
    cost: 2000,
    description: 'Increases weapon fire rate by 50% with double barrel taps.',
    icon: 'Flame',
    color: 'text-amber-500',
    active: false
  },
  staminup: {
    id: 'staminup',
    name: 'Stamin-Up',
    cost: 1500,
    description: 'Increases player movement speed by 40% and endless sprint stamina.',
    icon: 'Footprints',
    color: 'text-cyan-500',
    active: false
  },
  quickrevive: {
    id: 'quickrevive',
    name: 'Quick Revive',
    cost: 1500,
    description: 'Grants self-revive capability when downed in solo or squad mode.',
    icon: 'HeartPulse',
    color: 'text-purple-500',
    active: false
  }
};

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'medkit',
    name: 'Emergency Medkit',
    category: 'survival',
    description: 'Restores 75 HP instantly during combat.',
    cost: { scrap: 3, wood: 2 },
    outputCount: 1
  },
  {
    id: 'ammo_box',
    name: 'Rifle Ammo Pouch',
    category: 'ammo',
    description: 'Restores 60 rounds of ammunition for active weapons.',
    cost: { scrap: 4, wire: 2 },
    outputCount: 1
  },
  {
    id: 'spike_trap',
    name: 'Floor Spike Trap',
    category: 'trap',
    description: 'Deploys a mechanical trap that damages and slows walking zombies.',
    cost: { scrap: 6, wood: 4, wire: 2 },
    outputCount: 1
  },
  {
    id: 'claymore',
    name: 'Proximity Claymore',
    category: 'trap',
    description: 'Explosive directional mine triggered by nearby undead hordes.',
    cost: { scrap: 5, explosives: 2, wire: 2 },
    outputCount: 1
  },
  {
    id: 'melee_bat',
    name: 'Spiked Barricade Bat',
    category: 'weapon',
    description: 'Heavy melee weapon with high knockback power.',
    cost: { wood: 5, scrap: 4 },
    outputCount: 1
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'survivor_5',
    title: 'Outbreak Survivor',
    description: 'Survive until Wave 5.',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'survivor_15',
    title: 'Hardened Veteran',
    description: 'Survive until Wave 15.',
    unlocked: false,
    progress: 0,
    maxProgress: 15
  },
  {
    id: 'zombie_hunter',
    title: 'Undead Executioner',
    description: 'Eliminate 100 zombies.',
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'headshot_master',
    title: 'Dead Eye',
    description: 'Score 50 headshots.',
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'master_crafter',
    title: 'Master Scavenger',
    description: 'Craft 5 items at crafting stations.',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'pack_a_punch',
    title: 'Future Tech',
    description: 'Upgrade a weapon at the Pack-a-Punch machine.',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
];
