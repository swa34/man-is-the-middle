// === Colors ===
export const COLORS = {
  background: '#0a0a1a',
  hub: '#00ff88',
  hubGlow: 'rgba(0, 255, 136, 0.15)',
  grid: 'rgba(0, 255, 136, 0.12)',
  gridBright: 'rgba(0, 255, 136, 0.25)',
  ring: 'rgba(0, 229, 255, 0.2)',
  ringHighlight: 'rgba(0, 229, 255, 0.5)',
  slotAvailable: 'rgba(0, 229, 255, 0.3)',
  slotOccupied: 'rgba(255, 51, 68, 0.3)',
  text: '#ffaa00',
  textBright: '#ffdd44',
  hpBar: '#00ff88',
  hpBarDamage: '#ff3344',
  enemyHpBar: '#ff3344',
  enemyHpBarBg: 'rgba(0,0,0,0.5)',
  projectile: '#00e5ff',
  aoe: 'rgba(0, 229, 255, 0.2)',
  particle: '#00ff88',

  // Tower colors
  firewall: '#ff6622',
  ids: '#00e5ff',
  encryption: '#aa44ff',
  sniffer: '#44ff44',
  honeypot: '#ffaa00',

  // Enemy colors
  pingFlood: '#ff3344',
  trojan: '#ff6622',
  phishing: '#aa44ff',
  ransomware: '#ff2266',
  ddosBoss: '#ff0044',
} as const;

// === Arena ===
export const HUB_RADIUS = 35;
export const ARENA_PADDING = 40;

// Placement rings: radii from center (in game units, relative to arena radius)
// These are fractions of the arena radius
export const RING_RATIOS = [0.25, 0.4, 0.55, 0.7];
export const SLOTS_PER_RING = [8, 12, 16, 20];
export const SNAP_THRESHOLD = 30; // pixels

// === Game Loop ===
export const TICK_RATE = 60;
export const TICK_MS = 1000 / TICK_RATE;

// === Hub ===
export const HUB_MAX_HP = 100;

// === Economy ===
export const STARTING_CREDITS = 200;

// === Wave ===
export const WAVE_PREP_TIME = 8; // seconds between waves
export const TOTAL_WAVES = 5;

// === Spawn ===
export const SPAWN_RADIUS_RATIO = 0.95; // enemies spawn at 95% of arena radius

// === Tower sell refund ===
export const SELL_REFUND_RATIO = 0.5;

// === Rendering ===
export const LAYERS = {
  background: 0,
  grid: 1,
  range: 2,
  towers: 3,
  enemies: 4,
  projectiles: 5,
  effects: 6,
  particles: 7,
} as const;

// === Radial lines ===
export const RADIAL_LINE_COUNT = 24;
