import { signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { LiveRefreshService, REFRESH_INTERVAL_SECONDS } from '../services';

import { RefreshTickerComponent } from './refresh-ticker.component';

describe('RefreshTickerComponent', () => {
  const isRunning = signal(false);
  const timer = signal(REFRESH_INTERVAL_SECONDS);

  const liveRefreshServiceMock = {
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
          provide: LiveRefreshService,
          useValue: liveRefreshServiceMock,
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

  it('should restore the visual progress from the current timer', () => {
    timer.set(10);
    isRunning.set(true);

    fixture.detectChanges();

    const expectedProgress =
      ((REFRESH_INTERVAL_SECONDS - timer()) / REFRESH_INTERVAL_SECONDS) * 100;

    expect(element.style.getPropertyValue('--refresh-progress')).toBe(
      `${expectedProgress}%`
    );
  });

  it('should update the visual progress when the timer changes', () => {
    isRunning.set(true);
    timer.set(12);

    fixture.detectChanges();

    expect(element.style.getPropertyValue('--refresh-progress')).toBe('40%');

    timer.set(9);
    fixture.detectChanges();

    expect(element.style.getPropertyValue('--refresh-progress')).toBe('55%');
  });

  it('should show full progress when timer reaches zero', () => {
    timer.set(0);
    isRunning.set(true);

    fixture.detectChanges();

    expect(element.style.getPropertyValue('--refresh-progress')).toBe('100%');
  });

  it('should reset visual progress with the timer', () => {
    timer.set(0);
    isRunning.set(true);

    fixture.detectChanges();

    expect(element.style.getPropertyValue('--refresh-progress')).toBe('100%');

    timer.set(REFRESH_INTERVAL_SECONDS);
    fixture.detectChanges();

    expect(element.style.getPropertyValue('--refresh-progress')).toBe('0%');
  });

  it('should hide active progress when ticker is disabled', () => {
    isRunning.set(true);

    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    expect(element.classList.contains('is-active')).toBe(false);
  });

  it('should restore active progress with the current timer when enabled again', () => {
    isRunning.set(true);
    timer.set(10);

    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    expect(element.classList.contains('is-active')).toBe(false);

    timer.set(5);
    fixture.detectChanges();

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(element.classList.contains('is-active')).toBe(true);

    const expectedProgress =
      ((REFRESH_INTERVAL_SECONDS - 5) / REFRESH_INTERVAL_SECONDS) * 100;

    expect(element.style.getPropertyValue('--refresh-progress')).toBe(
      `${expectedProgress}%`
    );
  });
});
