import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { THEME_SERVICE_PROVIDER, ThemeService } from './theme.service';

describe('ThemeService', () => {
  it('uses the default light preference when the server document has no window', () => {
    TestBed.configureTestingModule({
      providers: [
        THEME_SERVICE_PROVIDER,
        { provide: DOCUMENT, useValue: { defaultView: null } },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.isSystemDark()).toBe(false);
  });

  it('tolerates a window without matchMedia during server rendering', () => {
    TestBed.configureTestingModule({
      providers: [
        THEME_SERVICE_PROVIDER,
        { provide: DOCUMENT, useValue: { defaultView: {} } },
      ],
    });

    expect(() => TestBed.inject(ThemeService)).not.toThrow();
    expect(TestBed.inject(ThemeService).isSystemDark()).toBe(false);
  });

  it('tracks the browser system preference and removes its listener on destroy', () => {
    const mediaQuery = {
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as MediaQueryList;
    const matchMedia = jest.fn().mockReturnValue(mediaQuery);

    TestBed.configureTestingModule({
      providers: [
        THEME_SERVICE_PROVIDER,
        { provide: DOCUMENT, useValue: { defaultView: { matchMedia } } },
      ],
    });

    const service = TestBed.inject(ThemeService);
    const changeListener = jest.mocked(mediaQuery.addEventListener).mock
      .calls[0][1] as (event: MediaQueryListEvent) => void;

    expect(service.isSystemDark()).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');

    changeListener({ matches: false } as MediaQueryListEvent);
    expect(service.isSystemDark()).toBe(false);

    TestBed.resetTestingModule();

    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      changeListener
    );
  });
});
