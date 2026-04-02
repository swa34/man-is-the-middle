import { ARENA_PADDING } from '../constants';

export class Camera {
  centerX: number = 0;
  centerY: number = 0;
  scale: number = 1;

  resize(canvasWidth: number, canvasHeight: number, arenaRadius: number): void {
    this.centerX = canvasWidth / 2;
    this.centerY = canvasHeight / 2;
    const fitRadius = Math.min(canvasWidth, canvasHeight) / 2 - ARENA_PADDING;
    this.scale = fitRadius / arenaRadius;
  }

  gameToScreen(gx: number, gy: number): { x: number; y: number } {
    return {
      x: this.centerX + gx * this.scale,
      y: this.centerY + gy * this.scale,
    };
  }

  screenToGame(sx: number, sy: number): { x: number; y: number } {
    return {
      x: (sx - this.centerX) / this.scale,
      y: (sy - this.centerY) / this.scale,
    };
  }

  polarToGame(angle: number, radius: number): { x: number; y: number } {
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }
}

export const camera = new Camera();
