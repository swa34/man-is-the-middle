import { EnemyType } from '../types';
import type { WaveDefinition } from '../types';
import { WAVE_PREP_TIME } from '../constants';

export const WaveDefinitions: WaveDefinition[] = [
  // Wave 1: Simple intro
  {
    prepTime: WAVE_PREP_TIME,
    enemies: [
      {
        type: EnemyType.PingFlood,
        count: 6,
        startAngle: 0,
        angleSpread: Math.PI * 2,
        delayBetween: 0.8,
        startDelay: 0,
      },
    ],
  },
  // Wave 2: More ping floods + trojans
  {
    prepTime: WAVE_PREP_TIME,
    enemies: [
      {
        type: EnemyType.PingFlood,
        count: 8,
        startAngle: 0,
        angleSpread: Math.PI,
        delayBetween: 0.6,
        startDelay: 0,
      },
      {
        type: EnemyType.Trojan,
        count: 3,
        startAngle: Math.PI,
        angleSpread: Math.PI,
        delayBetween: 1.2,
        startDelay: 2,
      },
    ],
  },
  // Wave 3: Mixed with phishing
  {
    prepTime: WAVE_PREP_TIME,
    enemies: [
      {
        type: EnemyType.PingFlood,
        count: 10,
        startAngle: 0,
        angleSpread: Math.PI * 2,
        delayBetween: 0.5,
        startDelay: 0,
      },
      {
        type: EnemyType.Phishing,
        count: 4,
        startAngle: Math.PI * 0.5,
        angleSpread: Math.PI,
        delayBetween: 1.0,
        startDelay: 1,
      },
      {
        type: EnemyType.Trojan,
        count: 3,
        startAngle: Math.PI * 1.5,
        angleSpread: Math.PI * 0.5,
        delayBetween: 1.5,
        startDelay: 3,
      },
    ],
  },
  // Wave 4: Ransomware appears
  {
    prepTime: WAVE_PREP_TIME,
    enemies: [
      {
        type: EnemyType.PingFlood,
        count: 12,
        startAngle: 0,
        angleSpread: Math.PI * 2,
        delayBetween: 0.4,
        startDelay: 0,
      },
      {
        type: EnemyType.Ransomware,
        count: 2,
        startAngle: Math.PI,
        angleSpread: Math.PI * 0.5,
        delayBetween: 2.0,
        startDelay: 2,
      },
      {
        type: EnemyType.Phishing,
        count: 5,
        startAngle: 0,
        angleSpread: Math.PI,
        delayBetween: 0.8,
        startDelay: 4,
      },
    ],
  },
  // Wave 5: Boss wave
  {
    prepTime: WAVE_PREP_TIME,
    enemies: [
      {
        type: EnemyType.PingFlood,
        count: 8,
        startAngle: 0,
        angleSpread: Math.PI * 2,
        delayBetween: 0.5,
        startDelay: 0,
      },
      {
        type: EnemyType.DDoSBoss,
        count: 1,
        startAngle: Math.PI,
        angleSpread: 0,
        delayBetween: 0,
        startDelay: 3,
      },
      {
        type: EnemyType.Ransomware,
        count: 3,
        startAngle: Math.PI * 0.5,
        angleSpread: Math.PI,
        delayBetween: 1.5,
        startDelay: 5,
      },
    ],
  },
];
