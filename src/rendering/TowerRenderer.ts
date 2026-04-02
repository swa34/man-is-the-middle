import { camera } from '../core/Camera';
import { gameState } from '../core/GameState';
import { TowerType } from '../types';
import { COLORS } from '../constants';
import { TowerDefinitions } from '../gameplay/TowerDefinitions';

function drawFirewall(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, _time: number): void {
  const s = size * camera.scale;
  // Shield/rectangle shape with glow
  ctx.shadowColor = COLORS.firewall;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.firewall;
  ctx.beginPath();
  // Shield: rounded rectangle
  const w = s * 1.6;
  const h = s * 2;
  ctx.roundRect(sx - w / 2, sy - h / 2, w, h, s * 0.3);
  ctx.fill();
  ctx.strokeStyle = '#ffaa44';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Inner line decoration
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx - w * 0.25, sy - h * 0.15);
  ctx.lineTo(sx + w * 0.25, sy - h * 0.15);
  ctx.moveTo(sx - w * 0.25, sy + h * 0.1);
  ctx.lineTo(sx + w * 0.25, sy + h * 0.1);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawIDS(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, _time: number): void {
  const s = size * camera.scale;
  ctx.strokeStyle = COLORS.ids;
  ctx.lineWidth = 2;
  // Outer circle (eye)
  ctx.beginPath();
  ctx.arc(sx, sy, s, 0, Math.PI * 2);
  ctx.stroke();
  // Crosshair lines
  ctx.beginPath();
  ctx.moveTo(sx - s * 1.4, sy);
  ctx.lineTo(sx - s * 0.5, sy);
  ctx.moveTo(sx + s * 0.5, sy);
  ctx.lineTo(sx + s * 1.4, sy);
  ctx.moveTo(sx, sy - s * 1.4);
  ctx.lineTo(sx, sy - s * 0.5);
  ctx.moveTo(sx, sy + s * 0.5);
  ctx.lineTo(sx, sy + s * 1.4);
  ctx.stroke();
  // Inner dot
  ctx.fillStyle = COLORS.ids;
  ctx.beginPath();
  ctx.arc(sx, sy, s * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawEncryption(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, time: number): void {
  const s = size * camera.scale;
  const rotation = time * 1.5;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(rotation);
  // Padlock body
  ctx.fillStyle = COLORS.encryption;
  ctx.fillRect(-s * 0.7, -s * 0.2, s * 1.4, s * 1.2);
  // Padlock shackle
  ctx.strokeStyle = COLORS.encryption;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -s * 0.2, s * 0.5, Math.PI, 0);
  ctx.stroke();
  // Keyhole
  ctx.fillStyle = '#1a0a2e';
  ctx.beginPath();
  ctx.arc(0, s * 0.25, s * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-s * 0.08, s * 0.25, s * 0.16, s * 0.4);
  ctx.restore();
}

function drawSniffer(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, time: number): void {
  const s = size * camera.scale;
  // Antenna base
  ctx.fillStyle = COLORS.sniffer;
  ctx.beginPath();
  ctx.moveTo(sx - s * 0.8, sy + s);
  ctx.lineTo(sx + s * 0.8, sy + s);
  ctx.lineTo(sx, sy - s * 0.3);
  ctx.closePath();
  ctx.fill();
  // Antenna mast
  ctx.strokeStyle = COLORS.sniffer;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx, sy - s * 0.3);
  ctx.lineTo(sx, sy - s * 1.2);
  ctx.stroke();
  // Radar sweep
  const sweepAngle = (time * 3) % (Math.PI * 2);
  ctx.strokeStyle = `rgba(68, 255, 68, 0.6)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(sx, sy - s * 1.2, s * 0.8, sweepAngle, sweepAngle + 0.8);
  ctx.stroke();
  // Sweep fill
  ctx.fillStyle = `rgba(68, 255, 68, 0.15)`;
  ctx.beginPath();
  ctx.moveTo(sx, sy - s * 1.2);
  ctx.arc(sx, sy - s * 1.2, s * 0.8, sweepAngle, sweepAngle + 0.8);
  ctx.closePath();
  ctx.fill();
}

function drawHoneypot(ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, _time: number): void {
  const s = size * camera.scale;
  // Hexagonal pot shape
  ctx.fillStyle = COLORS.honeypot;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const px = sx + Math.cos(angle) * s;
    const py = sy + Math.sin(angle) * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffcc44';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Inner detail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const px = sx + Math.cos(angle) * s * 0.5;
    const py = sy + Math.sin(angle) * s * 0.5;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

const towerDrawers: Record<TowerType, (ctx: CanvasRenderingContext2D, sx: number, sy: number, size: number, time: number) => void> = {
  [TowerType.Firewall]: drawFirewall,
  [TowerType.IDS]: drawIDS,
  [TowerType.Encryption]: drawEncryption,
  [TowerType.Sniffer]: drawSniffer,
  [TowerType.Honeypot]: drawHoneypot,
};

export function renderTowers(ctx: CanvasRenderingContext2D, time: number): void {
  for (const [entityId, tower] of gameState.towers) {
    const pos = gameState.positions.get(entityId);
    const renderable = gameState.renderables.get(entityId);
    if (!pos || !renderable) continue;

    const screen = camera.gameToScreen(pos.x, pos.y);
    const def = TowerDefinitions[tower.towerType];
    const size = renderable.size;

    // Range circle when selected
    if (gameState.selectedTowerId === entityId) {
      const rangeScreen = tower.range * camera.scale;
      ctx.strokeStyle = `rgba(255, 255, 255, 0.25)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, rangeScreen, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Range fill
      ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, rangeScreen, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw tower shape
    const drawer = towerDrawers[tower.towerType];
    if (drawer) {
      drawer(ctx, screen.x, screen.y, size, time);
    }

    // Disabled overlay (red X)
    if (tower.disabled) {
      ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
      ctx.lineWidth = 3;
      const crossSize = size * camera.scale * 1.2;
      ctx.beginPath();
      ctx.moveTo(screen.x - crossSize, screen.y - crossSize);
      ctx.lineTo(screen.x + crossSize, screen.y + crossSize);
      ctx.moveTo(screen.x + crossSize, screen.y - crossSize);
      ctx.lineTo(screen.x - crossSize, screen.y + crossSize);
      ctx.stroke();
    }

    // Level indicators (small dots below the tower)
    if (tower.level > 0) {
      const dotSpacing = 6 * camera.scale;
      const totalWidth = (tower.level - 1) * dotSpacing;
      const startX = screen.x - totalWidth / 2;
      const dotY = screen.y + size * camera.scale + 6 * camera.scale;

      ctx.fillStyle = def.color;
      for (let i = 0; i < tower.level; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * dotSpacing, dotY, 2 * camera.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export function renderTowerGhost(
  ctx: CanvasRenderingContext2D,
  towerType: TowerType,
  gx: number,
  gy: number,
  available: boolean,
  time: number,
): void {
  const screen = camera.gameToScreen(gx, gy);
  const def = TowerDefinitions[towerType];
  const size = 10; // default ghost tower size

  ctx.globalAlpha = 0.5;

  // Draw the tower shape
  const drawer = towerDrawers[towerType];
  if (drawer) {
    drawer(ctx, screen.x, screen.y, size, time);
  }

  ctx.globalAlpha = 1.0;

  // Range circle
  const rangeScreen = def.range * camera.scale;
  ctx.strokeStyle = available ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 51, 68, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, rangeScreen, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Slot highlight
  const slotRadius = 8 * camera.scale;
  ctx.fillStyle = available ? COLORS.slotAvailable : COLORS.slotOccupied;
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, slotRadius, 0, Math.PI * 2);
  ctx.fill();
}
