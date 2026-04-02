import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { GameStatus } from '../types';

export function initGameOverScreen(): void {
  const gameOverScreen = document.getElementById('game-over-screen');
  const gameOverTitle = document.getElementById('game-over-title');
  const gameOverMessage = document.getElementById('game-over-message');
  const finalWave = document.getElementById('final-wave');
  const restartBtn = document.getElementById('restart-btn');
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');

  // Game Over
  eventBus.on('game:over', () => {
    if (!gameOverScreen || !gameOverTitle || !gameOverMessage || !finalWave) return;

    gameOverTitle.textContent = 'BREACH DETECTED';
    gameOverTitle.classList.remove('victory');
    gameOverMessage.textContent = 'Your network has been compromised.';
    finalWave.textContent = String(gameState.wave.current);

    gameOverScreen.classList.remove('hidden');
  });

  // Victory
  eventBus.on('game:victory', () => {
    if (!gameOverScreen || !gameOverTitle || !gameOverMessage || !finalWave) return;

    gameOverTitle.textContent = 'NETWORK SECURED';
    gameOverTitle.classList.add('victory');
    gameOverMessage.textContent = 'All threats have been neutralized. System integrity maintained.';
    finalWave.textContent = String(gameState.wave.current);

    gameOverScreen.classList.remove('hidden');
  });

  // Restart button
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (!gameOverScreen) return;

      gameOverScreen.classList.add('hidden');
      eventBus.clear();
      gameState.reset();
      gameState.gameStatus = GameStatus.Playing;

      // Re-initialize event listeners by reloading
      // This is handled by the main game loop re-init; we emit a synthetic restart
      // The main module should listen for this or the caller should re-init systems
      window.dispatchEvent(new CustomEvent('game:restart'));
    });
  }

  // Start button
  if (startBtn && startScreen) {
    startBtn.addEventListener('click', () => {
      startScreen.classList.add('hidden');
      gameState.gameStatus = GameStatus.Playing;
      gameState.wave.current = 1;
      gameState.wave.prepTimer = 0; // Start immediately
      eventBus.emit('wave:start', { waveNumber: 1 });
    });
  }
}
