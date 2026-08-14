import { TestBed } from '@angular/core/testing';

import { STARTUP_SERVICE_PROVIDER, StartupService } from './startup.service';

describe('StartupService', () => {
  let service: StartupService;
  let now: number;

  const createInitializer = (): HTMLElement => {
    const initializer = document.createElement('div');

    initializer.id = 'app-initializer';
    initializer.classList.add('app-initializer');

    document.body.appendChild(initializer);

    return initializer;
  };

  beforeEach(() => {
    now = 0;

    jest.useFakeTimers();

    jest.spyOn(performance, 'now').mockImplementation(() => now);

    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(now);
        return 1;
      });

    TestBed.configureTestingModule({
      providers: [STARTUP_SERVICE_PROVIDER],
    });

    service = TestBed.inject(StartupService);
  });

  afterEach(() => {
    document.getElementById('app-initializer')?.remove();

    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should keep initializer visible until minimum visible duration has elapsed', () => {
    const initializer = createInitializer();

    now = 100;

    service.hideAppInitializer();

    jest.advanceTimersByTime(699);

    expect(initializer.classList).not.toContain('app-initializer--hidden');

    jest.advanceTimersByTime(1);

    expect(initializer.classList).toContain('app-initializer--hidden');
  });

  it('should hide initializer without additional delay if minimum visible duration already elapsed', () => {
    const initializer = createInitializer();

    now = 1_000;

    service.hideAppInitializer();

    jest.advanceTimersByTime(0);

    expect(initializer.classList).toContain('app-initializer--hidden');
  });

  it('should remove initializer after fade duration', () => {
    const initializer = createInitializer();

    service.removeAppInitializerElement();

    expect(initializer.classList).toContain('app-initializer--hidden');
    expect(document.getElementById('app-initializer')).toBe(initializer);

    jest.advanceTimersByTime(299);

    expect(document.getElementById('app-initializer')).toBe(initializer);

    jest.advanceTimersByTime(1);

    expect(document.getElementById('app-initializer')).toBeNull();
  });

  it('should do nothing if initializer does not exist', () => {
    expect(() => service.removeAppInitializerElement()).not.toThrow();

    expect(document.getElementById('app-initializer')).toBeNull();
  });
});
