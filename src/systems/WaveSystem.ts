import { gameState } from '../core/GameState';
import { createEnemy } from '../core/EntityManager';
import { eventBus } from '../core/EventBus';
import { GameStatus, WaveState } from '../types';
import type { SpawnEntry } from '../types';
import { WaveDefinitions } from '../gameplay/WaveDefinitions';
import { TOTAL_WAVES, WAVE_PREP_TIME } from '../constants';

export function updateWaves(dt: number): void {
  if (gameState.gameStatus !== GameStatus.Playing) return;

  const wave = gameState.wave;

  switch (wave.state) {
    case WaveState.Preparing: {
      wave.prepTimer -= dt;
      if (wave.prepTimer <= 0) {
        // Load next wave
        const waveIndex = wave.current; // 0-indexed: wave.current starts at 0, incremented before preparing
        if (waveIndex >= WaveDefinitions.length) {
          // No more wave definitions, victory
          gameState.gameStatus = GameStatus.Victory;
          eventBus.emit('game:victory', {});
          return;
        }

        const waveDef = WaveDefinitions[waveIndex];
        const spawnQueue: SpawnEntry[] = [];

        for (const group of waveDef.enemies) {
          for (let i = 0; i < group.count; i++) {
            const angle = group.startAngle + (group.count > 1
              ? (i / (group.count - 1)) * group.angleSpread - group.angleSpread / 2
              : 0);

            spawnQueue.push({
              enemyType: group.type,
              angle,
              delay: group.startDelay + i * group.delayBetween,
              spawned: false,
            });
          }
        }

        wave.spawnQueue = spawnQueue;
        wave.enemiesRemaining = spawnQueue.length;
        wave.spawnTimer = 0;
        wave.state = WaveState.Active;

        eventBus.emit('wave:start', { waveNumber: wave.current + 1 });
      }
      break;
    }

    case WaveState.Active: {
      wave.spawnTimer += dt;

      // Spawn enemies whose delay has been reached
      for (const entry of wave.spawnQueue) {
        if (!entry.spawned && wave.spawnTimer >= entry.delay) {
          entry.spawned = true;
          createEnemy(entry.enemyType, entry.angle, gameState.arenaRadius);
        }
      }

      // Check if wave is complete: all spawned AND no enemies left
      const allSpawned = wave.spawnQueue.every(e => e.spawned);
      const noEnemiesLeft = gameState.enemies.size === 0;

      if (allSpawned && noEnemiesLeft) {
        wave.state = WaveState.Complete;
        eventBus.emit('wave:complete', { waveNumber: wave.current + 1 });
      }

      // Update enemies remaining count
      wave.enemiesRemaining = gameState.enemies.size +
        wave.spawnQueue.filter(e => !e.spawned).length;

      break;
    }

    case WaveState.Complete: {
      if (wave.current + 1 < TOTAL_WAVES) {
        wave.current++;
        wave.state = WaveState.Preparing;
        wave.prepTimer = WAVE_PREP_TIME;
      } else {
        gameState.gameStatus = GameStatus.Victory;
        eventBus.emit('game:victory', {});
      }
      break;
    }
  }
}
