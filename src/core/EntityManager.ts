import { gameState } from './GameState';
import { EnemyDefinitions } from '../gameplay/EnemyDefinitions';
import { TowerDefinitions } from '../gameplay/TowerDefinitions';
import { EnemyType, TowerType } from '../types';
import { SPAWN_RADIUS_RATIO, LAYERS } from '../constants';

export function createEnemy(enemyType: EnemyType, angle: number, arenaRadius: number): number {
  const id = gameState.nextEntityId++;
  const def = EnemyDefinitions[enemyType];

  const spawnRadius = arenaRadius * SPAWN_RADIUS_RATIO;
  const x = Math.cos(angle) * spawnRadius;
  const y = Math.sin(angle) * spawnRadius;

  gameState.entities.add(id);

  gameState.positions.set(id, {
    x,
    y,
    angle,
    radius: spawnRadius,
  });

  gameState.velocities.set(id, {
    speed: def.speed,
  });

  gameState.healths.set(id, {
    current: def.hp,
    max: def.hp,
  });

  gameState.enemies.set(id, {
    enemyType,
    reward: def.reward,
    damageToHub: def.damageToHub,
    stealth: def.stealth,
    revealed: false,
    armor: def.armor,
    spawnTimer: 0,
    spawnCooldown: def.spawnCooldown,
  });

  gameState.renderables.set(id, {
    shape: 'circle',
    color: def.color,
    size: def.size,
    layer: LAYERS.enemies,
    alpha: def.stealth ? 0.3 : 1,
  });

  return id;
}

export function createTower(towerType: TowerType, ring: number, slot: number): number {
  const id = gameState.nextEntityId++;
  const def = TowerDefinitions[towerType];
  const placementSlot = gameState.placementSlots[ring][slot];

  gameState.entities.add(id);

  gameState.positions.set(id, {
    x: placementSlot.x,
    y: placementSlot.y,
    angle: placementSlot.angle,
    radius: placementSlot.radius,
  });

  gameState.towers.set(id, {
    towerType,
    range: def.range,
    damage: def.damage,
    cooldown: def.cooldown,
    cooldownRemaining: 0,
    level: 0,
    disabled: false,
    disableTimer: 0,
    ring,
    slot,
  });

  gameState.renderables.set(id, {
    shape: 'diamond',
    color: def.color,
    size: 14,
    layer: LAYERS.towers,
    alpha: 1,
  });

  // If it's a honeypot, add a lure component
  if (towerType === TowerType.Honeypot) {
    gameState.lures.set(id, {
      attractRadius: def.range,
      hitsRemaining: 5,
    });
  }

  placementSlot.occupied = true;

  return id;
}

export function createProjectile(
  sourceId: number,
  targetId: number,
  damage: number,
  speed: number,
  aoeRadius: number,
): number {
  const id = gameState.nextEntityId++;
  const sourcePos = gameState.positions.get(sourceId);

  if (!sourcePos) {
    throw new Error(`Source entity ${sourceId} has no position`);
  }

  gameState.entities.add(id);

  gameState.positions.set(id, {
    x: sourcePos.x,
    y: sourcePos.y,
    angle: sourcePos.angle,
    radius: sourcePos.radius,
  });

  gameState.velocities.set(id, {
    speed,
  });

  gameState.projectiles.set(id, {
    targetId,
    damage,
    speed,
    aoeRadius,
    sourceId,
  });

  gameState.renderables.set(id, {
    shape: 'circle',
    color: '#00e5ff',
    size: 4,
    layer: LAYERS.projectiles,
    alpha: 1,
  });

  return id;
}

export function destroyEntity(id: number): void {
  // If it's a tower, mark the slot as unoccupied
  const tower = gameState.towers.get(id);
  if (tower) {
    const slot = gameState.placementSlots[tower.ring]?.[tower.slot];
    if (slot) {
      slot.occupied = false;
    }
  }

  gameState.entities.delete(id);
  gameState.positions.delete(id);
  gameState.healths.delete(id);
  gameState.velocities.delete(id);
  gameState.towers.delete(id);
  gameState.enemies.delete(id);
  gameState.projectiles.delete(id);
  gameState.effects.delete(id);
  gameState.renderables.delete(id);
  gameState.lures.delete(id);
}

export function getEntitiesWith(...componentMaps: Map<number, unknown>[]): number[] {
  if (componentMaps.length === 0) return [];

  // Start with the smallest map for efficiency
  const sorted = [...componentMaps].sort((a, b) => a.size - b.size);
  const smallest = sorted[0];
  const rest = sorted.slice(1);

  const result: number[] = [];
  for (const id of smallest.keys()) {
    if (rest.every((map) => map.has(id))) {
      result.push(id);
    }
  }
  return result;
}
