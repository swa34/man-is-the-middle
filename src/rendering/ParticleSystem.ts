import { camera } from '../core/Camera';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const particles: Particle[] = [];
const MAX_PARTICLES = 500;

export function spawnParticles(
  x: number,
  y: number,
  count: number,
  color: string,
  speed: number,
  life: number,
): void {
  const spawnCount = Math.min(count, MAX_PARTICLES - particles.length);
  for (let i = 0; i < spawnCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = speed * (0.3 + Math.random() * 0.7);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life,
      maxLife: life,
      color,
      size: 1 + Math.random() * 2,
    });
  }
}

export function updateParticles(dt: number): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;

    // Slow down over time
    p.vx *= 1 - dt * 2;
    p.vy *= 1 - dt * 2;

    if (p.life <= 0) {
      // Swap with last and pop for O(1) removal
      particles[i] = particles[particles.length - 1];
      particles.pop();
    }
  }
}

export function renderParticles(ctx: CanvasRenderingContext2D): void {
  for (const p of particles) {
    const screen = camera.gameToScreen(p.x, p.y);
    const alpha = Math.max(0, p.life / p.maxLife);
    const size = p.size * camera.scale * alpha;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
}
