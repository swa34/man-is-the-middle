import { gameState } from '../core/GameState';
import { canAfford } from '../systems/EconomySystem';
import { TowerDefinitions } from '../gameplay/TowerDefinitions';
import { TowerType } from '../types';

let hpBar: HTMLElement | null = null;
let hpText: HTMLElement | null = null;
let waveNumber: HTMLElement | null = null;
let creditsAmount: HTMLElement | null = null;
let towerButtons: HTMLElement[] = [];

const towerTypeMap: Record<string, TowerType> = {
  firewall: TowerType.Firewall,
  ids: TowerType.IDS,
  encryption: TowerType.Encryption,
  sniffer: TowerType.Sniffer,
  honeypot: TowerType.Honeypot,
};

export function initHUD(): void {
  hpBar = document.getElementById('hp-bar');
  hpText = document.getElementById('hp-text');
  waveNumber = document.getElementById('wave-number');
  creditsAmount = document.getElementById('credits-amount');
  towerButtons = Array.from(document.querySelectorAll<HTMLElement>('.tower-btn'));
}

export function updateHUD(): void {
  const { hub, wave, economy } = gameState;

  // HP bar
  if (hpBar) {
    const hpPercent = (hub.hp / hub.maxHp) * 100;
    hpBar.style.width = `${Math.max(0, hpPercent)}%`;

    if (hpPercent < 30) {
      hpBar.style.backgroundColor = '#ff3344';
    } else {
      hpBar.style.backgroundColor = '';
    }
  }

  // HP text
  if (hpText) {
    hpText.textContent = `${Math.ceil(hub.hp)}/${hub.maxHp}`;
  }

  // Wave number
  if (waveNumber) {
    waveNumber.textContent = String(wave.current);
  }

  // Credits
  if (creditsAmount) {
    creditsAmount.textContent = String(economy.credits);
  }

  // Tower button disabled states
  for (const btn of towerButtons) {
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
