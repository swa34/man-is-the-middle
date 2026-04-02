import { camera } from '../core/Camera';
import { gameState } from '../core/GameState';

export function renderProjectiles(ctx: CanvasRenderingContext2D, time: number): void {
  for (const [entityId, projectile] of gameState.projectiles) {
    const pos = gameState.positions.get(entityId);
    const renderable = gameState.renderables.get(entityId);
    if (!pos) continue;

    const screen = camera.gameToScreen(pos.x, pos.y);
    const color = renderable?.color ?? '#00e5ff';
    const isAoe = projectile.aoeRadius > 0;
    const baseSize = isAoe ? 4 : 2.5;
    const size = baseSize * camera.scale;

    // Calculate trail direction from position angle
    // Trail extends opposite to direction of movement
    const targetPos = gameState.positions.get(projectile.targetId);
    let trailDx = 0;
    let trailDy = 0;
    if (targetPos) {
      const dx = targetPos.x - pos.x;
      const dy = targetPos.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        // Trail goes opposite to movement direction
        trailDx = -(dx / dist) * 12 * camera.scale;
        trailDy = -(dy / dist) * 12 * camera.scale;
      }
    }

    // Trail line
    ctx.strokeStyle = color;
    ctx.lineWidth = (isAoe ? 2.5 : 1.5) * camera.scale;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(screen.x + trailDx, screen.y + trailDy);
    ctx.lineTo(screen.x, screen.y);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Glowing dot
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
    ctx.fill();

    // Bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }
}
