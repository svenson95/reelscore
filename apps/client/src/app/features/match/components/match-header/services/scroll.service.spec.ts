import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let scrollService: ScrollService;
  let animationWrapper: HTMLElement;
  let pendingAnimationFrames: Map<number, FrameRequestCallback>;
  let nextAnimationFrameId: number;
  let currentScrollPosition: number;

  const originalScrollDescriptor = Object.getOwnPropertyDescriptor(
    window,
    'scrollY'
  ) ?? {
    value: 0,
    writable: true,
    configurable: true,
  };

  const flushAnimationFrames = () => {
    const frameCallbacks = [...pendingAnimationFrames.values()];

    pendingAnimationFrames.clear();

    for (const callback of frameCallbacks) {
      callback(0);
    }
  };

  beforeEach(() => {
    pendingAnimationFrames = new Map();
    nextAnimationFrameId = 0;
    currentScrollPosition = 0;

    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        nextAnimationFrameId += 1;
        pendingAnimationFrames.set(nextAnimationFrameId, callback);

        return nextAnimationFrameId;
      });

    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((frameId) => {
      pendingAnimationFrames.delete(frameId);
    });

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => currentScrollPosition,
    });

    TestBed.configureTestingModule({ providers: [ScrollService] });
    scrollService = TestBed.inject(ScrollService);

    animationWrapper = document.createElement('div');
    Object.defineProperty(animationWrapper, 'scrollHeight', {
      value: 200,
      configurable: true,
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.restoreAllMocks();
    Object.defineProperty(window, 'scrollY', originalScrollDescriptor);
  });

  it('measures the wrapper, coalesces scroll frames and clamps collapse progress', () => {
    currentScrollPosition = 50;

    scrollService.setAnimationWrapper(new ElementRef(animationWrapper));
    scrollService.observeScrollPosition();
    flushAnimationFrames();

    expect(animationWrapper.style.getPropertyValue('--highlights-height')).toBe(
      '200px'
    );
    expect(scrollService.hasVisibleHeight()).toBe(true);

    currentScrollPosition = 150;
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));

    expect(pendingAnimationFrames.size).toBe(1);

    flushAnimationFrames();

    expect(
      animationWrapper.style.getPropertyValue('--highlights-progress')
    ).toBe('0.5');

    currentScrollPosition = 400;
    window.dispatchEvent(new Event('scroll'));
    flushAnimationFrames();

    expect(
      animationWrapper.style.getPropertyValue('--highlights-progress')
    ).toBe('1');
    expect(scrollService.hasVisibleHeight()).toBe(false);

    currentScrollPosition = 25;
    window.dispatchEvent(new Event('scroll'));
    flushAnimationFrames();

    expect(
      animationWrapper.style.getPropertyValue('--highlights-progress')
    ).toBe('0');
  });

  it('remeasures on resize and resets visibility when its wrapper is removed', () => {
    scrollService.setAnimationWrapper(new ElementRef(animationWrapper));
    scrollService.observeScrollPosition();
    flushAnimationFrames();

    Object.defineProperty(animationWrapper, 'scrollHeight', { value: 400 });
    window.dispatchEvent(new Event('resize'));
    flushAnimationFrames();

    expect(animationWrapper.style.getPropertyValue('--highlights-height')).toBe(
      '400px'
    );

    scrollService.setAnimationWrapper(null);

    expect(scrollService.hasVisibleHeight()).toBe(false);
  });

  it('observes only once and cancels pending work and listeners on destruction', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    scrollService.observeScrollPosition();
    scrollService.observeScrollPosition();

    const scrollListenerRegistrations = addEventListenerSpy.mock.calls.filter(
      ([eventType]) => eventType === 'scroll'
    );

    expect(scrollListenerRegistrations).toHaveLength(1);
    expect(pendingAnimationFrames.size).toBe(1);

    TestBed.resetTestingModule();

    expect(pendingAnimationFrames.size).toBe(0);

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));

    expect(pendingAnimationFrames.size).toBe(0);

    scrollService.destroy();
  });
});
