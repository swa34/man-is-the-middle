import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';

export function initEconomy(): void {
  eventBus.on('enemy:killed', (data) => {
    gameState.economy.credits += data.reward;
    eventBus.emit('credits:changed', { amount: gameState.economy.credits });
  });

  eventBus.on('tower:sold', (data) => {
    gameState.economy.credits += data.refund;
    eventBus.emit('credits:changed', { amount: gameState.economy.credits });
  });
}

export function canAfford(cost: number): boolean {
  return gameState.economy.credits >= cost;
}

export function spend(cost: number): boolean {
  if (!canAfford(cost)) return false;
  gameState.economy.credits -= cost;
  eventBus.emit('credits:changed', { amount: gameState.economy.credits });
  return true;
}
