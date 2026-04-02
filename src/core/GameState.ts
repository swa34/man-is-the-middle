import type {
  PositionComponent,
  HealthComponent,
  VelocityComponent,
  TowerComponent,
  EnemyComponent,
  ProjectileComponent,
  EffectComponent,
  RenderableComponent,
  LureComponent,
  HubState,
  EconomyState,
  WaveStateData,
  PlacementSlot,
} from '../types';
import { TowerType, GameStatus, WaveState } from '../types';
import {
  HUB_MAX_HP,
  HUB_RADIUS,
  STARTING_CREDITS,
  TOTAL_WAVES,
  WAVE_PREP_TIME,
  RING_RATIOS,
  SLOTS_PER_RING,
} from '../constants';

export class GameState {
  entities: Set<number> = new Set();
  nextEntityId: number = 1;

  // Component maps
  positions: Map<number, PositionComponent> = new Map();
  healths: Map<number, HealthComponent> = new Map();
  velocities: Map<number, VelocityComponent> = new Map();
  towers: Map<number, TowerComponent> = new Map();
  enemies: Map<number, EnemyComponent> = new Map();
  projectiles: Map<number, ProjectileComponent> = new Map();
  effects: Map<number, EffectComponent[]> = new Map();
  renderables: Map<number, RenderableComponent> = new Map();
  lures: Map<number, LureComponent> = new Map();

  // Singleton state
  hub: HubState = { hp: HUB_MAX_HP, maxHp: HUB_MAX_HP, radius: HUB_RADIUS };
  economy: EconomyState = { credits: STARTING_CREDITS };
  wave: WaveStateData = {
    current: 0,
    totalWaves: TOTAL_WAVES,
    state: WaveState.Preparing,
    enemiesRemaining: 0,
    prepTimer: WAVE_PREP_TIME,
    spawnQueue: [],
    spawnTimer: 0,
  };
  selectedTowerType: TowerType | null = null;
  selectedTowerId: number | null = null;
  gameStatus: GameStatus = GameStatus.Start;
  arenaRadius: number = 300; // default, updated on resize
  placementSlots: PlacementSlot[][] = [];

  constructor() {
    this.initPlacementSlots();
  }

  private initPlacementSlots(): void {
    this.placementSlots = [];
    for (let ringIndex = 0; ringIndex < RING_RATIOS.length; ringIndex++) {
      const slotsInRing = SLOTS_PER_RING[ringIndex];
      const ringRadius = RING_RATIOS[ringIndex] * this.arenaRadius;
      const ringSlots: PlacementSlot[] = [];

      for (let slotIndex = 0; slotIndex < slotsInRing; slotIndex++) {
        const angle = (slotIndex / slotsInRing) * Math.PI * 2;
        ringSlots.push({
          ring: ringIndex,
          slot: slotIndex,
          angle,
          radius: ringRadius,
          x: Math.cos(angle) * ringRadius,
          y: Math.sin(angle) * ringRadius,
          occupied: false,
        });
      }

      this.placementSlots.push(ringSlots);
    }
  }

  updateArenaRadius(radius: number): void {
    this.arenaRadius = radius;
    for (let ringIndex = 0; ringIndex < this.placementSlots.length; ringIndex++) {
      const ringRadius = RING_RATIOS[ringIndex] * radius;
      for (const slot of this.placementSlots[ringIndex]) {
        slot.radius = ringRadius;
        slot.x = Math.cos(slot.angle) * ringRadius;
        slot.y = Math.sin(slot.angle) * ringRadius;
      }
    }
  }

  reset(): void {
    this.entities.clear();
    this.nextEntityId = 1;

    this.positions.clear();
    this.healths.clear();
    this.velocities.clear();
    this.towers.clear();
    this.enemies.clear();
    this.projectiles.clear();
    this.effects.clear();
    this.renderables.clear();
    this.lures.clear();

    this.hub = { hp: HUB_MAX_HP, maxHp: HUB_MAX_HP, radius: HUB_RADIUS };
    this.economy = { credits: STARTING_CREDITS };
    this.wave = {
      current: 0,
      totalWaves: TOTAL_WAVES,
      state: WaveState.Preparing,
      enemiesRemaining: 0,
      prepTimer: WAVE_PREP_TIME,
      spawnQueue: [],
      spawnTimer: 0,
    };
    this.selectedTowerType = null;
    this.selectedTowerId = null;
    this.gameStatus = GameStatus.Start;

    this.initPlacementSlots();
  }
}

export const gameState = new GameState();
