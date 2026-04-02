import { gameState } from '../core/GameState';

export function updateEffects(dt: number): void {
  for (const [entityId, effects] of gameState.effects) {
    // Tick down each effect
    for (let i = effects.length - 1; i >= 0; i--) {
      effects[i].remaining -= dt;
      if (effects[i].remaining <= 0) {
        effects.splice(i, 1);
      }
    }

    // Clean up empty effects arrays
    if (effects.length === 0) {
      gameState.effects.delete(entityId);
    }
  }
}
