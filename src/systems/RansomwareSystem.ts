import { gameState } from '../core/GameState';
import { EnemyType } from '../types';
import { eventBus } from '../core/EventBus';

const DISABLE_RANGE = 50;
const DISABLE_DURATION = 5;

export function updateRansomware(dt: number): void {
  // Ransomware enemies disable nearby towers
  for (const [enemyId, enemy] of gameState.enemies) {
    if (enemy.enemyType !== EnemyType.Ransomware) continue;

    const enemyPos = gameState.positions.get(enemyId);
    if (!enemyPos) continue;

    for (const [towerId, tower] of gameState.towers) {
      if (tower.disabled) continue;

      const towerPos = gameState.positions.get(towerId);
      if (!towerPos) continue;

      const dx = enemyPos.x - towerPos.x;
      const dy = enemyPos.y - towerPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= DISABLE_RANGE) {
        tower.disabled = true;
        tower.disableTimer = DISABLE_DURATION;
        eventBus.emit('tower:disabled', { entityId: towerId, duration: DISABLE_DURATION });
      }
    }
  }

  // Tick down disable timers for all disabled towers
  for (const [_towerId, tower] of gameState.towers) {
    if (!tower.disabled) continue;

    tower.disableTimer -= dt;
    if (tower.disableTimer <= 0) {
      tower.disabled = false;
      tower.disableTimer = 0;
    }
  }
}
