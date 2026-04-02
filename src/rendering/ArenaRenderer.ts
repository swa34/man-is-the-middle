import { camera } from '../core/Camera';
import { gameState } from '../core/GameState';
import { COLORS, HUB_RADIUS, RADIAL_LINE_COUNT, RING_RATIOS } from '../constants';

interface DataFlowDot {
  angle: number;
  radius: number;
  speed: number;
  ringIndex: number;
}

const dataFlowDots: DataFlowDot[] = [];
let dotsInitialized = false;

function initDataFlowDots(): void {
  dataFlowDots.length = 0;
  for (let ring = 0; ring < RING_RATIOS.length; ring++) {
    const dotCount = 6 + ring * 3;
    for (let i = 0; i < dotCount; i++) {
      dataFlowDots.push({
        angle: Math.random() * Math.PI * 2,
        radius: RING_RATIOS[ring] * gameState.arenaRadius,
        speed: 0.15 + Math.random() * 0.3,
        ringIndex: ring,
      });
    }
  }
  dotsInitialized = true;
}

export function renderArena(ctx: CanvasRenderingContext2D, time: number): void {
  const { arenaRadius } = gameState;

  // Dark background fill
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (!dotsInitialized) {
    initDataFlowDots();
  }

  // Dashed radial lines from hub to arena edge
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 8]);
  for (let i = 0; i < RADIAL_LINE_COUNT; i++) {
    const angle = (i / RADIAL_LINE_COUNT) * Math.PI * 2;
    const innerX = Math.cos(angle) * HUB_RADIUS;
    const innerY = Math.sin(angle) * HUB_RADIUS;
    const outerX = Math.cos(angle) * arenaRadius;
    const outerY = Math.sin(angle) * arenaRadius;
    const start = camera.gameToScreen(innerX, innerY);
    const end = camera.gameToScreen(outerX, outerY);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Concentric ring guides at each placement ring radius
  for (let i = 0; i < RING_RATIOS.length; i++) {
    const ringRadius = RING_RATIOS[i] * arenaRadius;
    const center = camera.gameToScreen(0, 0);
    const screenRadius = ringRadius * camera.scale;

    ctx.strokeStyle = COLORS.ring;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center.x, center.y, screenRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Arena outer boundary
  const center = camera.gameToScreen(0, 0);
  const outerScreenRadius = arenaRadius * camera.scale;
  ctx.strokeStyle = COLORS.gridBright;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(center.x, center.y, outerScreenRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Data flow dots moving outward along rings for ambiance
  for (const dot of dataFlowDots) {
    dot.angle += dot.speed * 0.016; // approx per-frame at 60fps
    if (dot.angle > Math.PI * 2) dot.angle -= Math.PI * 2;

    // Update radius to track arena resizes
    dot.radius = RING_RATIOS[dot.ringIndex] * arenaRadius;

    const gx = Math.cos(dot.angle) * dot.radius;
    const gy = Math.sin(dot.angle) * dot.radius;
    const screen = camera.gameToScreen(gx, gy);

    const alpha = 0.2 + 0.15 * Math.sin(time * 2 + dot.angle * 3);
    ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 1.5 * camera.scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central hub: filled circle with pulsing glow
  const hubCenter = camera.gameToScreen(0, 0);
  const hubScreenRadius = HUB_RADIUS * camera.scale;
  const pulse = 0.5 + 0.5 * Math.sin(time * 2);

  // Outer glow
  const glowRadius = hubScreenRadius * (1.3 + 0.2 * pulse);
  const glowGradient = ctx.createRadialGradient(
    hubCenter.x, hubCenter.y, hubScreenRadius * 0.5,
    hubCenter.x, hubCenter.y, glowRadius,
  );
  glowGradient.addColorStop(0, `rgba(0, 255, 136, ${0.15 + 0.1 * pulse})`);
  glowGradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(hubCenter.x, hubCenter.y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Hub fill
  ctx.fillStyle = `rgba(0, 255, 136, ${0.15 + 0.05 * pulse})`;
  ctx.beginPath();
  ctx.arc(hubCenter.x, hubCenter.y, hubScreenRadius, 0, Math.PI * 2);
  ctx.fill();

  // Hub border
  ctx.strokeStyle = COLORS.hub;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(hubCenter.x, hubCenter.y, hubScreenRadius, 0, Math.PI * 2);
  ctx.stroke();
}
