import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { destroyEntity } from '../core/EntityManager';
import { TowerDefinitions } from '../gameplay/TowerDefinitions';
import { canAfford, spend } from '../systems/EconomySystem';
import { upgradeTower } from '../gameplay/UpgradeSystem';
import { SELL_REFUND_RATIO } from '../constants';

let infoPanel: HTMLElement | null = null;
let nameEl: HTMLElement | null = null;
let statsEl: HTMLElement | null = null;
let upgradeBtn: HTMLElement | null = null;
let sellBtn: HTMLElement | null = null;

export function initTowerInfo(): void {
  infoPanel = document.getElementById('tower-info');
  nameEl = document.getElementById('tower-info-name');
  statsEl = document.getElementById('tower-info-stats');
  upgradeBtn = document.getElementById('tower-upgrade-btn');
  sellBtn = document.getElementById('tower-sell-btn');

  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      const towerId = gameState.selectedTowerId;
      if (towerId === null) return;

      const success = upgradeTower(towerId);
      if (success) {
        // Refresh the info display
        showTowerInfo(towerId);
      }
    });
  }

  if (sellBtn) {
    sellBtn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      const towerId = gameState.selectedTowerId;
      if (towerId === null) return;

      const tower = gameState.towers.get(towerId);
      if (!tower) return;

      const def = TowerDefinitions[tower.towerType];
      const refund = Math.floor(def.cost * SELL_REFUND_RATIO);

      destroyEntity(towerId);
      eventBus.emit('tower:sold', { entityId: towerId, refund });

      gameState.selectedTowerId = null;
      hideTowerInfo();
    });
  }

  // Hide info when tower is destroyed by other means
  eventBus.on('tower:sold', () => {
    // Already handled above for manual sells, but good for external sells
  });
}

export function showTowerInfo(towerId: number): void {
  const tower = gameState.towers.get(towerId);
  if (!tower || !infoPanel || !nameEl || !statsEl || !upgradeBtn) return;

  const def = TowerDefinitions[tower.towerType];

  nameEl.textContent = `${def.name} (Lv ${tower.level + 1})`;

  statsEl.innerHTML = [
    `<div>Damage: ${tower.damage}</div>`,
    `<div>Range: ${tower.range}</div>`,
    `<div>Cooldown: ${tower.cooldown.toFixed(1)}s</div>`,
  ].join('');

  // Upgrade button state
  const maxLevel = def.upgrades.length; // upgrades array length = max upgrade count
  if (tower.level >= maxLevel) {
    upgradeBtn.textContent = 'MAX LEVEL';
    upgradeBtn.classList.add('disabled');
  } else {
    const upgradeCost = def.upgrades[tower.level].cost;
    upgradeBtn.textContent = `Upgrade (${upgradeCost} CR)`;
    if (canAfford(upgradeCost)) {
      upgradeBtn.classList.remove('disabled');
    } else {
      upgradeBtn.classList.add('disabled');
    }
  }

  // Sell button
  if (sellBtn) {
    const refund = Math.floor(def.cost * SELL_REFUND_RATIO);
    sellBtn.textContent = `Sell (+${refund} CR)`;
  }

  infoPanel.classList.remove('hidden');
}

export function hideTowerInfo(): void {
  if (infoPanel) {
    infoPanel.classList.add('hidden');
  }
}
