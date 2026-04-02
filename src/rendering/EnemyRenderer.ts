import { camera } from '../core/Camera';
import { gameState } from '../core/GameState';
import { EnemyType } from '../types';
import { COLORS } from '../constants';

// Track previous health values to detect damage for flash effect
const prevHealthMap: Map<number, number> = new Map();
const damageFlashTimers: Map<number, number> = new Map();
const FLASH_DURATION = 0.12; // seconds

function drawPingFlood(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number): void {
  const s = size * camera.scale;
  ctx.fillStyle = COLORS.pingFlood;
  ctx.beginPath();
  ctx.moveTo(sx, sy - s);
  ctx.lineTo(sx + s * 0.8, sy + s * 0.6);
  ctx.lineTo(sx - s * 0.8, sy + s * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawTrojan(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number): void {
  const s = size * camera.scale;
  ctx.fillStyle = COLORS.trojan;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const px = sx + Math.cos(angle) * s;
    const py = sy + Math.sin(angle) * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ff8844';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawPhishing(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number): void {
  const s = size * camera.scale;
  ctx.strokeStyle = COLORS.phishing;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  // Hook shape
  ctx.beginPath();
  ctx.moveTo(sx, sy - s * 1.2);
  ctx.lineTo(sx, sy + s * 0.3);
  ctx.arc(sx + s * 0.4, sy + s * 0.3, s * 0.4, Math.PI, 0, true);
  ctx.stroke();
  // Barb
  ctx.beginPath();
  ctx.moveTo(sx, sy - s * 1.2);
  ctx.lineTo(sx - s * 0.3, sy - s * 0.8);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function drawRansomware(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, time: number): void {
  const s = size * camera.scale;
  // Pulsing aura
  const pulse = 0.5 + 0.5 * Math.sin(time * 4);
  ctx.fillStyle = `rgba(255, 34, 102, ${0.1 + 0.1 * pulse})`;
  ctx.beginPath();
  ctx.arc(sx, sy, s * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Lock body
  ctx.fillStyle = COLORS.ransomware;
  ctx.fillRect(sx - s * 0.7, sy - s * 0.2, s * 1.4, s * 1.0);
  // Shackle
  ctx.strokeStyle = COLORS.ransomware;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sx, sy - s * 0.2, s * 0.45, Math.PI, 0);
  ctx.stroke();
  // Keyhole
  ctx.fillStyle = '#1a0011';
  ctx.beginPath();
  ctx.arc(sx, sy + s * 0.15, s * 0.15, 0, Math.PI * 2);
  ctx.fill();
}

function drawDDoSBoss(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, time: number): void {
  const s = size * camera.scale;
  // Pulsing outer aura
  const pulse = 0.5 + 0.5 * Math.sin(time * 3);
  ctx.fillStyle = `rgba(255, 0, 68, ${0.08 + 0.08 * pulse})`;
  ctx.beginPath();
  ctx.arc(sx, sy, s * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Octagon
  ctx.fillStyle = COLORS.ddosBoss;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 8;
    const px = sx + Math.cos(angle) * s;
    const py = sy + Math.sin(angle) * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ff4466';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner skull-like detail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.arc(sx - s * 0.25, sy - s * 0.15, s * 0.2, 0, Math.PI * 2);
  ctx.arc(sx + s * 0.25, sy - s * 0.15, s * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawHpBar(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, current: number, max: number): void {
  const barWidth = size * camera.scale * 2.2;
  const barHeight = 3 * camera.scale;
  const barX = sx - barWidth / 2;
  const barY = sy - size * camera.scale - 6 * camera.scale;

  // Background
  ctx.fillStyle = COLORS.enemyHpBarBg;
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // HP fill
  const hpRatio = Math.max(0, current / max);
  const fillColor = hpRatio > 0.5 ? COLORS.hpBar : hpRatio > 0.25 ? '#ffaa00' : COLORS.enemyHpBar;
  ctx.fillStyle = fillColor;
  ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
}

export function renderEnemies(ctx: CanvasRenderingContext2D, time: number): void {
  // Update damage flash timers
  const dt = 1 / 60; // approximate frame delta
  for (const [id, timer] of damageFlashTimers) {
    const newTimer = timer - dt;
    if (newTimer <= 0) {
      damageFlashTimers.delete(id);
    } else {
      damageFlashTimers.set(id, newTimer);
    }
  }

  for (const [entityId, enemy] of gameState.enemies) {
    const pos = gameState.positions.get(entityId);
    const health = gameState.healths.get(entityId);
    const renderable = gameState.renderables.get(entityId);
    if (!pos || !health || !renderable) continue;

    const screen = camera.gameToScreen(pos.x, pos.y);
    const size = renderable.size;

    // Detect damage for flash
    const prevHp = prevHealthMap.get(entityId);
    if (prevHp !== undefined && health.current < prevHp) {
      damageFlashTimers.set(entityId, FLASH_DURATION);
    }
    prevHealthMap.set(entityId, health.current);

    // Stealth: semi-transparent when stealthed and not revealed
    const isStealthed = enemy.stealth && !enemy.revealed;
    if (isStealthed) {
      ctx.globalAlpha = 0.2;
    }

    // Flash white when taking damage
    const isFlashing = damageFlashTimers.has(entityId);

    ctx.save();
    if (isFlashing) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
    }

    // Draw enemy shape
    switch (enemy.enemyType) {
      case EnemyType.PingFlood:
        drawPingFlood(ctx, screen.x, screen.y, size);
        break;
      case EnemyType.Trojan:
        drawTrojan(ctx, screen.x, screen.y, size);
        break;
      case EnemyType.Phishing:
        drawPhishing(ctx, screen.x, screen.y, size);
        break;
      case EnemyType.Ransomware:
        drawRansomware(ctx, screen.x, screen.y, size, time);
        break;
      case EnemyType.DDoSBoss:
        drawDDoSBoss(ctx, screen.x, screen.y, size, time);
        break;
    }

    // White flash overlay
    if (isFlashing) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, size * camera.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // HP bar (always visible even when stealthed at reduced alpha)
    drawHpBar(ctx, screen.x, screen.y, size, health.current, health.max);

    // Reset alpha
    ctx.globalAlpha = 1.0;
  }

  // Clean up stale entries
  for (const id of prevHealthMap.keys()) {
    if (!gameState.enemies.has(id)) {
      prevHealthMap.delete(id);
      damageFlashTimers.delete(id);
    }
  }
}
