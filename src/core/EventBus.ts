import type { GameEvents } from '../types';

class EventBus {
  private listeners: Map<string, Set<Function>> = new Map();

  on<K extends keyof GameEvents>(event: K, callback: (data: GameEvents[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off<K extends keyof GameEvents>(event: K, callback: (data: GameEvents[K]) => void): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  emit<K extends keyof GameEvents>(event: K, data: GameEvents[K]): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const callback of set) {
        callback(data);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
