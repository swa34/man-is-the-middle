import { setMousePosition } from '../rendering/Renderer';
import { handlePointerDown, handlePointerUp } from './PlacementHandler';

export function initInput(canvas: HTMLCanvasElement): void {
  function getCanvasCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  // Mouse events
  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    handlePointerDown(x, y);
  });

  canvas.addEventListener('mouseup', (_e: MouseEvent) => {
    handlePointerUp();
  });

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    setMousePosition(x, y);
  });

  // Touch events
  canvas.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
      setMousePosition(x, y);
      handlePointerDown(x, y);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e: TouchEvent) => {
    e.preventDefault();
    handlePointerUp();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
      setMousePosition(x, y);
    }
  }, { passive: false });
}
