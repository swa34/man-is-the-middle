import { camera } from '../core/Camera';
import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { createTower, destroyEntity } from '../core/EntityManager';
import { canAfford, spend } from '../systems/EconomySystem';
import { TowerDefinitions } from '../gameplay/TowerDefinitions';
import { SNAP_THRESHOLD, SELL_REFUND_RATIO } from '../constants';
import { showTowerInfo, hideTowerInfo } from '../ui/TowerInfoTooltip';
import type { PlacementSlot } from '../types';

function findNearestSlot(gameX: number, gameY: number): PlacementSlot | null {
  let nearest: PlacementSlot | null = null;
  let nearestDist = Infinity;

  for (const ring of gameState.placementSlots) {
    for (const slot of ring) {
      const dx = slot.x - gameX;
      const dy = slot.y - gameY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = slot;
      }
    }
  }

  if (!nearest) return null;

  // Convert snap threshold from screen to game coordinates
  const snapThresholdGame = SNAP_THRESHOLD / camera.scale;
  if (nearestDist > snapThresholdGame) return null;

  return nearest;
}

function findTowerAtPosition(gameX: number, gameY: number): number | null {
  const tapThresholdGame = 30;
  let closestId: number | null = null;
  let closestDist = Infinity;

  for (const [id, _tower] of gameState.towers) {
    const pos = gameState.positions.get(id);
    if (!pos) continue;

    const dx = pos.x - gameX;
    const dy = pos.y - gameY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < tapThresholdGame && dist < closestDist) {
      closestDist = dist;
      closestId = id;
    }
  }

  return closestId;
}

export function handlePointerDown(canvasX: number, canvasY: number): void {
  const gamePos = camera.screenToGame(canvasX, canvasY);
  const selectedType = gameState.selectedTowerType;

  if (selectedType) {
    // Player wants to place a tower
    const slot = findNearestSlot(gamePos.x, gamePos.y);

    if (slot && !slot.occupied) {
      const def = TowerDefinitions[selectedType];

      if (canAfford(def.cost)) {
        spend(def.cost);
        const entityId = createTower(selectedType, slot.ring, slot.slot);
        eventBus.emit('tower:placed', { entityId, type: selectedType });
      } else {
        // Flash credits display to indicate insufficient funds
        const creditsEl = document.getElementById('credits-display');
        if (creditsEl) {
          creditsEl.classList.add('flash');
          setTimeout(() => creditsEl.classList.remove('flash'), 300);
        }
      }
    }

    // Deselect tower type after placement attempt
    gameState.selectedTowerType = null;
    // Remove selected class from all tower buttons
    const buttons = document.querySelectorAll('.tower-btn');
    buttons.forEach((btn) => btn.classList.remove('selected'));
  } else {
    // No tower type selected - check if tapping an existing tower
    const towerId = findTowerAtPosition(gamePos.x, gamePos.y);

    if (towerId !== null) {
      gameState.selectedTowerId = towerId;
      showTowerInfo(towerId);
    } else {
      gameState.selectedTowerId = null;
      hideTowerInfo();
    }
  }
}

export function handlePointerUp(): void {
  // Currently no drag-based mechanics; reserved for future use
}
