import { gameState } from '../core/GameState';
import { TowerType } from '../types';

/** Module-level map storing towerId -> targetId */
export const towerTargets: Map<number, number> = new Map();

export function updateTowerTargeting(_dt: number): void {
  towerTargets.clear();

  for (const [towerId, tower] of gameState.towers) {
    if (tower.disabled) continue;

    // Sniffer and Honeypot are passive: no targeting
    if (tower.towerType === TowerType.Sniffer || tower.towerType === TowerType.Honeypot) continue;

    const towerPos = gameState.positions.get(towerId);
    if (!towerPos) continue;

    // Gather enemies in range
    const candidates: { id: number; dist: number; radius: number; x: number; y: number }[] = [];

    for (const [enemyId, enemy] of gameState.enemies) {
      // Skip stealthed enemies unless this is a Sniffer (already excluded above)
      if (enemy.stealth && !enemy.revealed) continue;

      const enemyPos = gameState.positions.get(enemyId);
      if (!enemyPos) continue;

      const dx = towerPos.x - enemyPos.x;
      const dy = towerPos.y - enemyPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= tower.range) {
        candidates.push({
          id: enemyId,
          dist,
          radius: enemyPos.radius,
          x: enemyPos.x,
          y: enemyPos.y,
        });
      }
    }

    if (candidates.length === 0) continue;

    let targetId: number;

    switch (tower.towerType) {
      case TowerType.Firewall: {
        // Closest to the tower
        candidates.sort((a, b) => a.dist - b.dist);
        targetId = candidates[0].id;
        break;
      }

      case TowerType.IDS: {
        // Closest to hub (lowest radius)
        candidates.sort((a, b) => a.radius - b.radius);
        targetId = candidates[0].id;
        break;
      }

      case TowerType.Encryption: {
        // Enemy nearest to the center of the densest cluster
        const AOE_RADIUS = 60;
        let bestId = candidates[0].id;
        let bestCount = 0;

        for (const c of candidates) {
          let count = 0;
          for (const other of candidates) {
            const dx = c.x - other.x;
            const dy = c.y - other.y;
            if (Math.sqrt(dx * dx + dy * dy) <= AOE_RADIUS) {
              count++;
            }
          }
          if (count > bestCount || (count === bestCount && c.radius < candidates.find(cc => cc.id === bestId)!.radius)) {
            bestCount = count;
            bestId = c.id;
          }
        }

        targetId = bestId;
        break;
      }

      default:
        continue;
    }

    towerTargets.set(towerId, targetId);
  }
}
