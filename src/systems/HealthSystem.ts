import { gameState } from '../core/GameState';
import { createEnemy, destroyEntity } from '../core/EntityManager';
import { eventBus } from '../core/EventBus';
import { EnemyType, GameStatus } from '../types';

export function updateHealth(dt: number): void {
  const enemyIds = [...gameState.enemies.keys()];

  for (const id of enemyIds) {
    // Entity may have been destroyed earlier in this loop
    if (!gameState.entities.has(id)) continue;

    const enemy = gameState.enemies.get(id);
    if (!enemy) continue;

    const health = gameState.healths.get(id);
    const pos = gameState.positions.get(id);

    // Check death
    if (health && health.current <= 0) {
      eventBus.emit('enemy:killed', {
        entityId: id,
        reward: enemy.reward,
        position: pos ? { ...pos } : { x: 0, y: 0, angle: 0, radius: 0 },
      });
      destroyEntity(id);
      continue;
    }

    // Check if enemy reached hub
    if (pos && pos.radius <= gameState.hub.radius) {
      gameState.hub.hp -= enemy.damageToHub;
      eventBus.emit('enemy:reachedHub', { entityId: id, damage: enemy.damageToHub });
      eventBus.emit('hub:damaged', { amount: enemy.damageToHub, remaining: gameState.hub.hp });
      destroyEntity(id);
      continue;
    }

    // DDoS Boss spawning behavior
    if (enemy.enemyType === EnemyType.DDoSBoss && pos) {
      enemy.spawnTimer += dt;
      if (enemy.spawnTimer >= enemy.spawnCooldown) {
        enemy.spawnTimer = 0;
        // Spawn 3 PingFlood enemies at boss angle +/- offset
        const offsets = [-0.15, 0, 0.15];
        for (const offset of offsets) {
          createEnemy(EnemyType.PingFlood, pos.angle + offset, gameState.arenaRadius);
        }
      }
    }
  }

  // Check hub death
  if (gameState.hub.hp <= 0) {
    gameState.hub.hp = 0;
    gameState.gameStatus = GameStatus.GameOver;
    eventBus.emit('game:over', {});
  }

  // Check honeypot destruction
  const lureIds = [...gameState.lures.keys()];
  for (const id of lureIds) {
    const lure = gameState.lures.get(id);
    if (lure && lure.hitsRemaining <= 0) {
      destroyEntity(id);
    }
  }
}
