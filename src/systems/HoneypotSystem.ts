import { gameState } from '../core/GameState';
import { destroyEntity } from '../core/EntityManager';

const HONEYPOT_HIT_RADIUS = 20;

/** Track which enemy-honeypot pairs have already registered a hit */
const hitPairs: Set<string> = new Set();

function pairKey(enemyId: number, honeypotId: number): string {
  return `${enemyId}:${honeypotId}`;
}

export function updateHoneypot(_dt: number): void {
  // Clean up stale pairs (entities that no longer exist)
  for (const key of hitPairs) {
    const [eStr, hStr] = key.split(':');
    const enemyId = parseInt(eStr, 10);
    const honeypotId = parseInt(hStr, 10);
    if (!gameState.entities.has(enemyId) || !gameState.entities.has(honeypotId)) {
      hitPairs.delete(key);
    }
  }

  const lureIds = [...gameState.lures.keys()];

  for (const honeypotId of lureIds) {
    const lure = gameState.lures.get(honeypotId);
    if (!lure) continue;

    const honeypotPos = gameState.positions.get(honeypotId);
    if (!honeypotPos) continue;

    for (const [enemyId] of gameState.enemies) {
      const enemyPos = gameState.positions.get(enemyId);
      if (!enemyPos) continue;

      const dx = honeypotPos.x - enemyPos.x;
      const dy = honeypotPos.y - enemyPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= HONEYPOT_HIT_RADIUS) {
        const key = pairKey(enemyId, honeypotId);
        if (!hitPairs.has(key)) {
          hitPairs.add(key);
          lure.hitsRemaining--;

          if (lure.hitsRemaining <= 0) {
            destroyEntity(honeypotId);
            break; // This honeypot is gone, move to next
          }
        }
      }
    }
  }
}

/** Clear tracked hit pairs (call on game reset) */
export function resetHoneypotTracking(): void {
  hitPairs.clear();
}
