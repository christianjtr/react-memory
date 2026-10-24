import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });
}

if (typeof globalThis.ResizeObserver !== 'function') {
  class ResizeObserverMock {
    observe(): void {
      return;
    }

    unobserve(): void {
      return;
    }

    disconnect(): void {
      return;
    }
  }

  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
