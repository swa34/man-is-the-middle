import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { TowerType } from '../types';
import { TowerDefinitions } from '../gameplay/TowerDefinitions';
import { canAfford } from '../systems/EconomySystem';
import { hideTowerInfo } from '../ui/TowerInfoTooltip';

const towerTypeMap: Record<string, TowerType> = {
  firewall: TowerType.Firewall,
  ids: TowerType.IDS,
  encryption: TowerType.Encryption,
  sniffer: TowerType.Sniffer,
  honeypot: TowerType.Honeypot,
};

let buttons: HTMLElement[] = [];

function updateAffordability(): void {
  for (const btn of buttons) {
    const towerKey = btn.getAttribute('data-tower');
    if (!towerKey) continue;

    const towerType = towerTypeMap[towerKey];
    if (!towerType) continue;

    const def = TowerDefinitions[towerType];
    if (canAfford(def.cost)) {
      btn.classList.remove('disabled');
    } else {
      btn.classList.add('disabled');
    }
  }
}

export function initTowerSelector(): void {
  buttons = Array.from(document.querySelectorAll<HTMLElement>('.tower-btn'));

  for (const btn of buttons) {
    btn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const towerKey = btn.getAttribute('data-tower');
      if (!towerKey) return;

      const towerType = towerTypeMap[towerKey];
      if (!towerType) return;

      // If clicking the already-selected button, deselect
      if (gameState.selectedTowerType === towerType) {
        gameState.selectedTowerType = null;
        btn.classList.remove('selected');
        return;
      }

      // Check affordability
      const def = TowerDefinitions[towerType];
      if (!canAfford(def.cost)) return;

      // Deselect all buttons, then select this one
      for (const other of buttons) {
        other.classList.remove('selected');
      }
      btn.classList.add('selected');

      gameState.selectedTowerType = towerType;

      // Clear any selected placed tower and hide its info panel
      gameState.selectedTowerId = null;
      hideTowerInfo();
    });
  }

  // Update affordability on credits change
  eventBus.on('credits:changed', () => {
    updateAffordability();
  });

  // Initial affordability check
  updateAffordability();
}
