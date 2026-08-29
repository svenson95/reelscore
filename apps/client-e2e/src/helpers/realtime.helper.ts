import type { Page } from '@playwright/test';

export const mockRealtimeConnected = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    class MockEventSource {
      static readonly CONNECTING = 0;
      static readonly OPEN = 1;
      static readonly CLOSED = 2;

      readonly url: string;
      readonly withCredentials = false;

      readyState = MockEventSource.CONNECTING;

      onopen: ((event: Event) => void) | null = null;
      onmessage: ((event: MessageEvent<string>) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;

      constructor(url: string | URL) {
        this.url = url.toString();

        setTimeout(() => {
          if (this.readyState === MockEventSource.CLOSED) {
            return;
          }

          this.readyState = MockEventSource.OPEN;
          this.onopen?.(new Event('open'));
        });
      }

      close(): void {
        this.readyState = MockEventSource.CLOSED;
      }

      addEventListener(): void {
        // empty
      }

      removeEventListener(): void {
        // empty
      }

      dispatchEvent(): boolean {
        return true;
      }
    }

    window.EventSource = MockEventSource as unknown as typeof EventSource;
  });
};

export const mockRealtimeUnavailable = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    class MockEventSource {
      static readonly CONNECTING = 0;
      static readonly OPEN = 1;
      static readonly CLOSED = 2;

      readonly url: string;
      readonly withCredentials = false;

      readyState = MockEventSource.CONNECTING;

      onopen: ((event: Event) => void) | null = null;
      onmessage: ((event: MessageEvent<string>) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;

      private errorTimeout?: ReturnType<typeof setTimeout>;

      constructor(url: string | URL) {
        this.url = url.toString();

        this.errorTimeout = setTimeout(() => {
          if (this.readyState === MockEventSource.CLOSED) {
            return;
          }

          this.readyState = MockEventSource.CLOSED;
          this.onerror?.(new Event('error'));
        }, 50);
      }

      close(): void {
        this.readyState = MockEventSource.CLOSED;

        if (this.errorTimeout !== undefined) {
          clearTimeout(this.errorTimeout);
          this.errorTimeout = undefined;
        }
      }

      addEventListener(): void {
        // empty
      }

      removeEventListener(): void {
        // empty
      }

      dispatchEvent(): boolean {
        return true;
      }
    }

    window.EventSource = MockEventSource as unknown as typeof EventSource;
  });
};
