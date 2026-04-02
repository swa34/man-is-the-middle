import { gameState } from '../core/GameState';
import { getEntitiesWith } from '../core/EntityManager';
import { EffectType, TowerType } from '../types';

/**
 * Shortest-path angular interpolation.
 * Returns an angle between a and b, interpolated by factor t.
 */
function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a;
  // Normalize to [-PI, PI]
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

export function updateMovement(dt: number): void {
  // Move enemies inward (polar movement)
  const enemyEntities = getEntitiesWith(
    gameState.positions,
    gameState.velocities,
    gameState.enemies,
  );

  for (const id of enemyEntities) {
    const pos = gameState.positions.get(id)!;
    const vel = gameState.velocities.get(id)!;
    const enemy = gameState.enemies.get(id)!;

    // Calculate slow factor from effects
    let slowFactor = 1;
    const effects = gameState.effects.get(id);
    if (effects) {
      for (const effect of effects) {
        if (effect.effectType === EffectType.Slow) {
          slowFactor *= (1 - effect.strength);
        }
      }
    }

    // Decrease radius (move inward)
    pos.radius -= vel.speed * dt * slowFactor;

    // Confuse effect: add random angle jitter
    if (effects) {
      for (const effect of effects) {
        if (effect.effectType === EffectType.Confuse) {
          pos.angle += (Math.random() - 0.5) * effect.strength * dt;
        }
      }
    }

    // Check for honeypot lure: blend angle toward nearest honeypot within attractRadius
    let nearestHoneypotDist = Infinity;
    let nearestHoneypotAngle: number | null = null;

    for (const [towerId, lure] of gameState.lures) {
      const tower = gameState.towers.get(towerId);
      if (!tower || tower.towerType !== TowerType.Honeypot) continue;

      const towerPos = gameState.positions.get(towerId);
      if (!towerPos) continue;

      const dx = towerPos.x - pos.x;
      const dy = towerPos.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < lure.attractRadius && dist < nearestHoneypotDist) {
        nearestHoneypotDist = dist;
        nearestHoneypotAngle = towerPos.angle;
      }
    }

    if (nearestHoneypotAngle !== null) {
      pos.angle = lerpAngle(pos.angle, nearestHoneypotAngle, 0.03);
    }

    // Update cartesian from polar
    pos.x = Math.cos(pos.angle) * pos.radius;
    pos.y = Math.sin(pos.angle) * pos.radius;
  }

  // Move projectiles toward their targets (cartesian movement)
  const projectileEntities = getEntitiesWith(
    gameState.positions,
    gameState.velocities,
    gameState.projectiles,
  );

  for (const id of projectileEntities) {
    const pos = gameState.positions.get(id)!;
    const proj = gameState.projectiles.get(id)!;

    const targetPos = gameState.positions.get(proj.targetId);
    if (!targetPos) {
      // Target gone, projectile will be cleaned up by CollisionSystem
      continue;
    }

    const dx = targetPos.x - pos.x;
    const dy = targetPos.y - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      const moveAmount = proj.speed * dt;
      const nx = dx / dist;
      const ny = dy / dist;
      pos.x += nx * moveAmount;
      pos.y += ny * moveAmount;
    }

    // Recalculate polar from cartesian
    pos.radius = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    pos.angle = Math.atan2(pos.y, pos.x);
  }
}
