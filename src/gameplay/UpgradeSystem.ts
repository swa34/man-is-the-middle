import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { TowerDefinitions } from './TowerDefinitions';
import { canAfford, spend } from '../systems/EconomySystem';

export function upgradeTower(towerId: number): boolean {
  const tower = gameState.towers.get(towerId);
  if (!tower) return false;

  const def = TowerDefinitions[tower.towerType];
  const maxUpgrades = def.upgrades.length;

  if (tower.level >= maxUpgrades) return false;

  const upgrade = def.upgrades[tower.level];

  if (!canAfford(upgrade.cost)) return false;

  spend(upgrade.cost);

  tower.damage = upgrade.damage;
  tower.range = upgrade.range;
  tower.cooldown = upgrade.cooldown;
  tower.level += 1;

  // Update lure radius if it's a honeypot
  const lure = gameState.lures.get(towerId);
  if (lure) {
    lure.attractRadius = upgrade.range;
  }

  eventBus.emit('tower:upgraded', { entityId: towerId, level: tower.level });

  return true;
}
