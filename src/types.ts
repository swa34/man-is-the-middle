// === Enums ===

export enum TowerType {
  Firewall = 'firewall',
  IDS = 'ids',
  Encryption = 'encryption',
  Sniffer = 'sniffer',
  Honeypot = 'honeypot',
}

export enum EnemyType {
  PingFlood = 'pingFlood',
  Trojan = 'trojan',
  Phishing = 'phishing',
  Ransomware = 'ransomware',
  DDoSBoss = 'ddosBoss',
}

export enum EffectType {
  Slow = 'slow',
  Disable = 'disable',
  Confuse = 'confuse',
  Reveal = 'reveal',
}

export enum GameStatus {
  Start = 'start',
  Playing = 'playing',
  GameOver = 'gameover',
  Victory = 'victory',
}

export enum WaveState {
  Preparing = 'preparing',
  Active = 'active',
  Complete = 'complete',
}

// === Component Interfaces ===

export interface PositionComponent {
  x: number;
  y: number;
  angle: number;
  radius: number;
}

export interface VelocityComponent {
  speed: number;
}

export interface HealthComponent {
  current: number;
  max: number;
}

export interface RenderableComponent {
  shape: string;
  color: string;
  size: number;
  layer: number;
  alpha: number;
}

export interface TowerComponent {
  towerType: TowerType;
  range: number;
  damage: number;
  cooldown: number;
  cooldownRemaining: number;
  level: number;
  disabled: boolean;
  disableTimer: number;
  ring: number;
  slot: number;
}

export interface EnemyComponent {
  enemyType: EnemyType;
  reward: number;
  damageToHub: number;
  stealth: boolean;
  revealed: boolean;
  armor: number;
  spawnTimer: number;
  spawnCooldown: number;
}

export interface ProjectileComponent {
  targetId: number;
  damage: number;
  speed: number;
  aoeRadius: number;
  sourceId: number;
}

export interface EffectComponent {
  effectType: EffectType;
  duration: number;
  remaining: number;
  strength: number;
}

export interface LureComponent {
  attractRadius: number;
  hitsRemaining: number;
}

// === Hub ===

export interface HubState {
  hp: number;
  maxHp: number;
  radius: number;
}

// === Economy ===

export interface EconomyState {
  credits: number;
}

// === Wave ===

export interface WaveStateData {
  current: number;
  totalWaves: number;
  state: WaveState;
  enemiesRemaining: number;
  prepTimer: number;
  spawnQueue: SpawnEntry[];
  spawnTimer: number;
}

export interface SpawnEntry {
  enemyType: EnemyType;
  angle: number;
  delay: number;
  spawned: boolean;
}

// === Wave Definition ===

export interface WaveDefinition {
  enemies: WaveEnemyGroup[];
  prepTime: number;
}

export interface WaveEnemyGroup {
  type: EnemyType;
  count: number;
  startAngle: number;
  angleSpread: number;
  delayBetween: number;
  startDelay: number;
}

// === Tower Definition ===

export interface TowerDefinition {
  type: TowerType;
  name: string;
  description: string;
  cost: number;
  range: number;
  damage: number;
  cooldown: number;
  special: string;
  color: string;
  upgrades: TowerUpgrade[];
}

export interface TowerUpgrade {
  cost: number;
  damage: number;
  range: number;
  cooldown: number;
}

// === Enemy Definition ===

export interface EnemyDefinition {
  type: EnemyType;
  name: string;
  hp: number;
  speed: number;
  damageToHub: number;
  reward: number;
  stealth: boolean;
  armor: number;
  color: string;
  size: number;
  spawnCooldown: number;
}

// === Events ===

export interface GameEvents {
  'enemy:killed': { entityId: number; reward: number; position: PositionComponent };
  'enemy:reachedHub': { entityId: number; damage: number };
  'tower:placed': { entityId: number; type: TowerType };
  'tower:disabled': { entityId: number; duration: number };
  'tower:upgraded': { entityId: number; level: number };
  'tower:sold': { entityId: number; refund: number };
  'wave:start': { waveNumber: number };
  'wave:complete': { waveNumber: number };
  'hub:damaged': { amount: number; remaining: number };
  'game:over': {};
  'game:victory': {};
  'credits:changed': { amount: number };
  'effect:applied': { entityId: number; effect: EffectType };
}

// === Pointer ===

export interface PointerEvent {
  type: 'down' | 'up' | 'move';
  x: number;
  y: number;
}

// === Placement ===

export interface PlacementSlot {
  ring: number;
  slot: number;
  angle: number;
  radius: number;
  x: number;
  y: number;
  occupied: boolean;
}
