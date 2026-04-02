import { gameState } from '../core/GameState';
import { destroyEntity } from '../core/EntityManager';
import { eventBus } from '../core/EventBus';
import { EffectType, TowerType } from '../types';
import type { EffectComponent } from '../types';

const HIT_RADIUS = 15;

export function updateCollisions(_dt: number): void {
  const projectileIds = [...gameState.projectiles.keys()];

  for (const projId of projectileIds) {
    const proj = gameState.projectiles.get(projId);
    if (!proj) continue;

    const projPos = gameState.positions.get(projId);
    if (!projPos) {
      destroyEntity(projId);
      continue;
    }

    // Check if target still exists
    if (!gameState.entities.has(proj.targetId)) {
      destroyEntity(projId);
      continue;
    }

    const targetPos = gameState.positions.get(proj.targetId);
    if (!targetPos) {
      destroyEntity(projId);
      continue;
    }

    const dx = projPos.x - targetPos.x;
    const dy = projPos.y - targetPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < HIT_RADIUS) {
      // Determine source tower type
      const sourceTower = gameState.towers.get(proj.sourceId);
      const sourceTowerType = sourceTower?.towerType;

      // Deal damage to target
      const targetHealth = gameState.healths.get(proj.targetId);
      if (targetHealth) {
        // Apply armor reduction
        const enemy = gameState.enemies.get(proj.targetId);
        const armor = enemy?.armor ?? 0;
        const effectiveDamage = Math.max(1, proj.damage - armor);
        targetHealth.current -= effectiveDamage;
      }

      // AOE damage
      if (proj.aoeRadius > 0) {
        for (const [enemyId, _enemy] of gameState.enemies) {
          if (enemyId === proj.targetId) continue;

          const enemyPos = gameState.positions.get(enemyId);
          if (!enemyPos) continue;

          const adx = targetPos.x - enemyPos.x;
          const ady = targetPos.y - enemyPos.y;
          const aoeDist = Math.sqrt(adx * adx + ady * ady);

          if (aoeDist <= proj.aoeRadius) {
            const aoeHealth = gameState.healths.get(enemyId);
            if (aoeHealth) {
              const aoeEnemy = gameState.enemies.get(enemyId);
              const aoeArmor = aoeEnemy?.armor ?? 0;
              const aoeDamage = Math.max(1, proj.damage * 0.5 - aoeArmor);
              aoeHealth.current -= aoeDamage;
            }
          }
        }
      }

      // Apply effects based on source tower type
      if (sourceTowerType === TowerType.Firewall) {
        applyEffect(proj.targetId, {
          effectType: EffectType.Slow,
          duration: 2,
          remaining: 2,
          strength: 0.3,
        });
      }

      if (sourceTowerType === TowerType.Encryption) {
        applyEffect(proj.targetId, {
          effectType: EffectType.Confuse,
          duration: 1.5,
          remaining: 1.5,
          strength: 0.5,
        });
      }

      // Emit effect applied event
      if (sourceTowerType === TowerType.Firewall) {
        eventBus.emit('effect:applied', { entityId: proj.targetId, effect: EffectType.Slow });
      }
      if (sourceTowerType === TowerType.Encryption) {
        eventBus.emit('effect:applied', { entityId: proj.targetId, effect: EffectType.Confuse });
      }

      // Destroy projectile
      destroyEntity(projId);
    }
  }
}

function applyEffect(entityId: number, effect: EffectComponent): void {
  let effects = gameState.effects.get(entityId);
  if (!effects) {
    effects = [];
    gameState.effects.set(entityId, effects);
  }

  // Replace existing effect of the same type (refresh duration)
  const existingIndex = effects.findIndex(e => e.effectType === effect.effectType);
  if (existingIndex >= 0) {
    effects[existingIndex] = effect;
  } else {
    effects.push(effect);
  }
}
