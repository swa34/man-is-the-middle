import { eventBus } from '../core/EventBus';

let announcerEl: HTMLElement | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

export function showAnnouncement(text: string, duration: number = 2000): void {
  if (!announcerEl) return;

  // Clear any pending hide
  if (hideTimeout !== null) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  announcerEl.textContent = text;
  announcerEl.classList.add('visible');

  hideTimeout = setTimeout(() => {
    if (announcerEl) {
      announcerEl.classList.remove('visible');
    }
    hideTimeout = null;
  }, duration);
}

export function initWaveAnnouncer(): void {
  announcerEl = document.getElementById('wave-announcer');

  eventBus.on('wave:start', (data) => {
    showAnnouncement(`WAVE ${data.waveNumber} INCOMING`, 2000);
  });

  eventBus.on('wave:complete', (data) => {
    showAnnouncement(`WAVE ${data.waveNumber} CLEARED`, 1500);
  });
}
