import { camera } from './core/Camera';
import { gameState } from './core/GameState';
import { GameLoop } from './core/GameLoop';
import { GameStatus } from './types';
import { ARENA_PADDING } from './constants';

// Systems
import { initEconomy } from './systems/EconomySystem';
import { updateWaves } from './systems/WaveSystem';
import { updateHoneypot, resetHoneypotTracking } from './systems/HoneypotSystem';
import { updateMovement } from './systems/MovementSystem';
import { updateStealth } from './systems/StealthSystem';
import { updateTowerTargeting } from './systems/TowerTargetingSystem';
import { updateTowerFiring } from './systems/TowerFiringSystem';
import { updateCollisions } from './systems/CollisionSystem';
import { updateRansomware } from './systems/RansomwareSystem';
import { updateEffects } from './systems/EffectSystem';
import { updateHealth } from './systems/HealthSystem';

// Rendering
import { render } from './rendering/Renderer';
import { updateParticles } from './rendering/ParticleSystem';

// UI
import { initHUD, updateHUD } from './ui/HUD';
import { initWaveAnnouncer } from './ui/WaveAnnouncer';
import { initGameOverScreen } from './ui/GameOverScreen';
import { initTowerSelector } from './input/TowerSelector';
import { initTowerInfo } from './ui/TowerInfoTooltip';

// Input
import { initInput } from './input/InputManager';

// --- Canvas setup ---
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function resizeCanvas(): void {
  const size = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
  const arenaRadius = size / 2 - ARENA_PADDING;
  camera.resize(size, size, arenaRadius);
  gameState.updateArenaRadius(arenaRadius);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- Initialize all systems ---
function initSystems(): void {
  initEconomy();
  initHUD();
  initWaveAnnouncer();
  initGameOverScreen();
  initTowerSelector();
  initTowerInfo();
  initInput(canvas);
}

initSystems();

// --- Update function ---
function update(dt: number): void {
  if (gameState.gameStatus !== GameStatus.Playing) return;

  updateWaves(dt);
  updateHoneypot(dt);
  updateMovement(dt);
  updateStealth(dt);
  updateTowerTargeting(dt);
  updateTowerFiring(dt);
  updateCollisions(dt);
  updateRansomware(dt);
  updateEffects(dt);
  updateHealth(dt);
  updateParticles(dt);
  updateHUD();
}

// --- Render function ---
function renderFrame(alpha: number): void {
  render(ctx, alpha);
}

// --- Game loop ---
const gameLoop = new GameLoop(update, renderFrame);
gameLoop.start();

// --- Restart handler ---
window.addEventListener('game:restart', () => {
  initSystems();
  resetHoneypotTracking();
});
