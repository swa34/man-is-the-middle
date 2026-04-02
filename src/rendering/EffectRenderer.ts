import { camera } from '../core/Camera';
import { gameState } from '../core/GameState';
import { COLORS } from '../constants';

export interface VisualEffect {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  duration: number;
  elapsed: number;
}

const activeEffects: VisualEffect[] = [];

export function addVisualEffect(effect: Omit<VisualEffect, 'elapsed'>): void {
  activeEffects.push({ ...effect, elapsed: 0 });
}

export function renderEffects(ctx: CanvasRenderingContext2D, dt: number): void {
  // Update and render active effects
  for (let i = activeEffects.length - 1; i >= 0; i--) {
    const effect = activeEffects[i];
    effect.elapsed += dt;

    if (effect.elapsed >= effect.duration) {
      activeEffects.splice(i, 1);
      continue;
    }

    const progress = effect.elapsed / effect.duration;
    const currentRadius = effect.radius + (effect.maxRadius - effect.radius) * progress;
    const alpha = 1 - progress;

    const screen = camera.gameToScreen(effect.x, effect.y);
    const screenRadius = currentRadius * camera.scale;

    // Expanding ring
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = (2 + (1 - progress) * 2) * camera.scale;
    ctx.globalAlpha = alpha * 0.8;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, screenRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner fill
    ctx.fillStyle = effect.color;
    ctx.globalAlpha = alpha * 0.15;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, screenRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1.0;
  }

  // Tower disable effects (red crackling around disabled towers)
  for (const [entityId, tower] of gameState.towers) {
    if (!tower.disabled) continue;
    const pos = gameState.positions.get(entityId);
    const renderable = gameState.renderables.get(entityId);
    if (!pos || !renderable) continue;

    const screen = camera.gameToScreen(pos.x, pos.y);
    const size = renderable.size * camera.scale;

    // Crackling red lines
    ctx.strokeStyle = 'rgba(255, 50, 50, 0.7)';
    ctx.lineWidth = 1.5;
    const numCrackles = 5;
    const time = performance.now() / 1000;
    for (let i = 0; i < numCrackles; i++) {
      const baseAngle = (i / numCrackles) * Math.PI * 2 + time * 3;
      const innerR = size * 0.6;
      const outerR = size * 1.5;
      const midAngle = baseAngle + (Math.sin(time * 10 + i * 2.7) * 0.4);
      ctx.beginPath();
      ctx.moveTo(
        screen.x + Math.cos(baseAngle) * innerR,
        screen.y + Math.sin(baseAngle) * innerR,
      );
      ctx.lineTo(
        screen.x + Math.cos(midAngle) * (innerR + outerR) * 0.5,
        screen.y + Math.sin(midAngle) * (innerR + outerR) * 0.5,
      );
      ctx.lineTo(
        screen.x + Math.cos(baseAngle + 0.2) * outerR,
        screen.y + Math.sin(baseAngle + 0.2) * outerR,
      );
      ctx.stroke();
    }
  }

  // Honeypot lure radius (amber dashed circle)
  for (const [entityId, lure] of gameState.lures) {
    const pos = gameState.positions.get(entityId);
    if (!pos) continue;

    const screen = camera.gameToScreen(pos.x, pos.y);
    const lureScreenRadius = lure.attractRadius * camera.scale;

    ctx.strokeStyle = COLORS.honeypot;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, lureScreenRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
  }

  // Sniffer reveal radius (green dashed circle) - show for IDS towers with reveal special
  for (const [entityId, tower] of gameState.towers) {
    // IDS towers reveal stealth enemies in their range
    if (tower.towerType !== 'ids') continue;
    if (tower.disabled) continue;

    const pos = gameState.positions.get(entityId);
    if (!pos) continue;

    const screen = camera.gameToScreen(pos.x, pos.y);
    const rangeScreenRadius = tower.range * camera.scale;

    ctx.strokeStyle = COLORS.sniffer;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, rangeScreenRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
  }
}
