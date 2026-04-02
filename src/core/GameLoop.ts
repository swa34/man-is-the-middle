import { TICK_MS } from '../constants';

const TICK_S = TICK_MS / 1000;

export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private running: boolean = false;
  private rafId: number = 0;
  private updateFn: (dt: number) => void;
  private renderFn: (alpha: number) => void;

  constructor(updateFn: (dt: number) => void, renderFn: (alpha: number) => void) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = 0;
    this.accumulator = 0;
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  stop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private loop(timestamp: number): void {
    if (!this.running) return;

    if (this.lastTime === 0) {
      this.lastTime = timestamp;
    }

    let frameTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Clamp frame time to avoid spiral of death (cap at 250ms)
    if (frameTime > 250) {
      frameTime = 250;
    }

    this.accumulator += frameTime;

    while (this.accumulator >= TICK_MS) {
      this.updateFn(TICK_S);
      this.accumulator -= TICK_MS;
    }

    // alpha is how far we are between ticks, useful for interpolated rendering
    const alpha = this.accumulator / TICK_MS;
    this.renderFn(alpha);

    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }
}
