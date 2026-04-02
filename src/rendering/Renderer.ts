import { camera } from '../core/Camera';
import { gameState } from '../core/GameState';
import { SNAP_THRESHOLD } from '../constants';
import { renderArena } from './ArenaRenderer';
import { renderTowers, renderTowerGhost } from './TowerRenderer';
import { renderEnemies } from './EnemyRenderer';
import { renderProjectiles } from './ProjectileRenderer';
import { renderEffects } from './EffectRenderer';
import { updateParticles, renderParticles } from './ParticleSystem';
import type { PlacementSlot } from '../types';

let mouseScreenX = 0;
let mouseScreenY = 0;

export function setMousePosition(x: number, y: number): void {
  mouseScreenX = x;
  mouseScreenY = y;
}

function findNearestSlot(): { slot: PlacementSlot; distance: number } | null {
  const gamePos = camera.screenToGame(mouseScreenX, mouseScreenY);
  let nearest: PlacementSlot | null = null;
  let nearestDist = Infinity;

  for (const ring of gameState.placementSlots) {
    for (const slot of ring) {
      const dx = slot.x - gamePos.x;
      const dy = slot.y - gamePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = slot;
      }
    }
  }

  if (!nearest) return null;

  // Convert snap threshold from screen to game coordinates
  const snapThresholdGame = SNAP_THRESHOLD / camera.scale;
  if (nearestDist > snapThresholdGame) return null;

  return { slot: nearest, distance: nearestDist };
}

function renderPlacementPreview(ctx: CanvasRenderingContext2D, time: number): void {
  const selectedType = gameState.selectedTowerType;
  if (!selectedType) return;

  const result = findNearestSlot();
  if (!result) return;

  const { slot } = result;
  const available = !slot.occupied;

  renderTowerGhost(ctx, selectedType, slot.x, slot.y, available, time);
}

export function render(ctx: CanvasRenderingContext2D, alpha: number): void {
  const time = performance.now() / 1000;
  const dt = 1 / 60; // fixed dt approximation for effects

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Render in layer order
  renderArena(ctx, time);
  renderEffects(ctx, dt);
  renderTowers(ctx, time);
  renderEnemies(ctx, time);
  renderProjectiles(ctx, time);

  // Particles: update and render
  updateParticles(dt);
  renderParticles(ctx);

  // Placement preview on top
  renderPlacementPreview(ctx, time);
}
