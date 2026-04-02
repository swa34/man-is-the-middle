import { gameState } from '../core/GameState';
import { createProjectile } from '../core/EntityManager';
import { towerTargets } from './TowerTargetingSystem';
import { TowerType } from '../types';
import { eventBus } from '../core/EventBus';

const SNIFFER_BOOST_RANGE = 150;
const SNIFFER_DAMAGE_BOOST = 0.2;
const ENCRYPTION_AOE_RADIUS = 60;
const PROJECTILE_SPEED = 300;

export function updateTowerFiring(dt: number): void {
  for (const [towerId, tower] of gameState.towers) {
    if (tower.disabled) continue;

    // Passive towers don't fire
    if (tower.towerType === TowerType.Sniffer || tower.towerType === TowerType.Honeypot) continue;

    // Tick cooldown
    tower.cooldownRemaining -= dt;

    if (tower.cooldownRemaining > 0) continue;

    const targetId = towerTargets.get(towerId);
    if (targetId === undefined) continue;

    // Verify target still exists
    if (!gameState.entities.has(targetId)) continue;

    // Reset cooldown (cooldown is already in seconds based on TowerDefinitions)
    tower.cooldownRemaining = tower.cooldown;

    // Calculate damage with Sniffer boost
    let damage = tower.damage;
    const towerPos = gameState.positions.get(towerId);
    if (towerPos) {
      for (const [snifferId, sniffer] of gameState.towers) {
        if (sniffer.towerType !== TowerType.Sniffer) continue;
        if (sniffer.disabled) continue;
        if (snifferId === towerId) continue;

        const snifferPos = gameState.positions.get(snifferId);
        if (!snifferPos) continue;

        const dx = towerPos.x - snifferPos.x;
        const dy = towerPos.y - snifferPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= SNIFFER_BOOST_RANGE) {
          damage *= (1 + SNIFFER_DAMAGE_BOOST);
          break; // Only one boost
        }
      }
    }

    // Determine AOE radius
    const aoeRadius = tower.towerType === TowerType.Encryption ? ENCRYPTION_AOE_RADIUS : 0;

    // Create projectile
    createProjectile(towerId, targetId, damage, PROJECTILE_SPEED, aoeRadius);

    eventBus.emit('tower:placed', { entityId: towerId, type: tower.towerType });
  }
}
