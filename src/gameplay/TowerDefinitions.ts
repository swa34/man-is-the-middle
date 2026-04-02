import { TowerType } from '../types';
import type { TowerDefinition } from '../types';
import { COLORS } from '../constants';

export const TowerDefinitions: Record<TowerType, TowerDefinition> = {
  [TowerType.Firewall]: {
    type: TowerType.Firewall,
    name: 'Firewall',
    description: 'Basic damage tower with moderate range',
    cost: 50,
    range: 100,
    damage: 10,
    cooldown: 1.0,
    special: 'none',
    color: COLORS.firewall,
    upgrades: [
      { cost: 40, damage: 15, range: 110, cooldown: 0.9 },
      { cost: 80, damage: 25, range: 120, cooldown: 0.8 },
    ],
  },
  [TowerType.IDS]: {
    type: TowerType.IDS,
    name: 'IDS',
    description: 'Intrusion Detection System - reveals stealth enemies',
    cost: 60,
    range: 120,
    damage: 5,
    cooldown: 1.5,
    special: 'reveal',
    color: COLORS.ids,
    upgrades: [
      { cost: 50, damage: 8, range: 140, cooldown: 1.3 },
      { cost: 100, damage: 12, range: 160, cooldown: 1.0 },
    ],
  },
  [TowerType.Encryption]: {
    type: TowerType.Encryption,
    name: 'Encryption',
    description: 'Slows enemies in range',
    cost: 70,
    range: 90,
    damage: 3,
    cooldown: 2.0,
    special: 'slow',
    color: COLORS.encryption,
    upgrades: [
      { cost: 60, damage: 5, range: 100, cooldown: 1.8 },
      { cost: 120, damage: 8, range: 110, cooldown: 1.5 },
    ],
  },
  [TowerType.Sniffer]: {
    type: TowerType.Sniffer,
    name: 'Sniffer',
    description: 'Long range, high damage, slow fire rate',
    cost: 80,
    range: 180,
    damage: 25,
    cooldown: 3.0,
    special: 'none',
    color: COLORS.sniffer,
    upgrades: [
      { cost: 70, damage: 35, range: 200, cooldown: 2.7 },
      { cost: 140, damage: 50, range: 220, cooldown: 2.4 },
    ],
  },
  [TowerType.Honeypot]: {
    type: TowerType.Honeypot,
    name: 'Honeypot',
    description: 'Lures enemies toward it, absorbing hits',
    cost: 60,
    range: 100,
    damage: 0,
    cooldown: 0,
    special: 'lure',
    color: COLORS.honeypot,
    upgrades: [
      { cost: 50, damage: 0, range: 120, cooldown: 0 },
      { cost: 100, damage: 0, range: 140, cooldown: 0 },
    ],
  },
};
