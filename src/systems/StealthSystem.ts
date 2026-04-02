import { gameState } from '../core/GameState';
import { EnemyType, TowerType } from '../types';

const AUTO_REVEAL_RADIUS = 150;

export function updateStealth(_dt: number): void {
  // Reset all stealth enemies to hidden
  for (const [enemyId, enemy] of gameState.enemies) {
    if (!enemy.stealth) continue;

    // Default: not revealed
    enemy.revealed = false;

    // Auto-reveal when close to hub
    const pos = gameState.positions.get(enemyId);
    if (pos && pos.radius < AUTO_REVEAL_RADIUS) {
      enemy.revealed = true;
      continue;
    }
  }

  // Sniffer towers reveal enemies within range
  for (const [towerId, tower] of gameState.towers) {
    if (tower.towerType !== TowerType.Sniffer) continue;
    if (tower.disabled) continue;

    const towerPos = gameState.positions.get(towerId);
    if (!towerPos) continue;

    for (const [enemyId, enemy] of gameState.enemies) {
      if (!enemy.stealth) continue;
      if (enemy.revealed) continue;

      const enemyPos = gameState.positions.get(enemyId);
      if (!enemyPos) continue;

      const dx = towerPos.x - enemyPos.x;
      const dy = towerPos.y - enemyPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= tower.range) {
        enemy.revealed = true;
      }
    }
  }

  // Update renderable alpha for stealth enemies
  for (const [enemyId, enemy] of gameState.enemies) {
    if (!enemy.stealth) continue;
    const renderable = gameState.renderables.get(enemyId);
    if (renderable) {
      renderable.alpha = enemy.revealed ? 1 : 0.3;
    }
  }
}
