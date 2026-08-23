import { signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { PageRefreshService, REFRESH_INTERVAL_SECONDS } from '../services';

import { RefreshTickerComponent } from './refresh-ticker.component';

describe('RefreshTickerComponent', () => {
  const isRunning = signal(false);
  const timer = signal(REFRESH_INTERVAL_SECONDS);

  const pageRefreshServiceMock = {
    isRunning: isRunning.asReadonly(),
    timer: timer.asReadonly(),
  };

  let fixture: ComponentFixture<RefreshTickerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    isRunning.set(false);
    timer.set(REFRESH_INTERVAL_SECONDS);

    await TestBed.configureTestingModule({
      imports: [RefreshTickerComponent],
      providers: [
        {
          provide: PageRefreshService,
          useValue: pageRefreshServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RefreshTickerComponent);
    element = fixture.nativeElement;

    fixture.detectChanges();
  });

  it('should display the refresh ticker', () => {
    expect(element.querySelector('.ticker')).not.toBeNull();
  });

  it('should not provide a manual refresh button', () => {
    expect(element.querySelector('button')).toBeNull();
  });

  it('should expose the current timer value', () => {
    timer.set(10);
    fixture.detectChanges();

    expect(element.getAttribute('data-timer')).toBe('10');
  });

  it('should mark the ticker as active while auto refresh is running', () => {
    expect(element.classList.contains('is-active')).toBe(false);

    isRunning.set(true);
    fixture.detectChanges();

    expect(element.classList.contains('is-active')).toBe(true);
  });

  it('should remove the active state when auto refresh stops', () => {
    isRunning.set(true);
    fixture.detectChanges();

    expect(element.classList.contains('is-active')).toBe(true);

    isRunning.set(false);
    fixture.detectChanges();

    expect(element.classList.contains('is-active')).toBe(false);
  });

  it('should restore the visual progress when auto refresh resumes', () => {
    timer.set(10);
    isRunning.set(true);

    fixture.detectChanges();

    expect(element.style.getPropertyValue('--refresh-progress-offset')).toBe(
      '-5s'
    );
  });
});
