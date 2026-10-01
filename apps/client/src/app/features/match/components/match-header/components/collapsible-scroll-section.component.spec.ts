import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { renderComponent } from '../../../../../../testing/match-components.testing';

import { ScrollService } from '../services';

import { CollapsibleScrollSection } from './collapsible-scroll-section.component';

const scrollServiceMock = {
  hasVisibleHeight: signal(true),
  setAnimationWrapper: jest.fn(),
};

describe('CollapsibleScrollSection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CollapsibleScrollSection],
      providers: [{ provide: ScrollService, useValue: scrollServiceMock }],
    });
  });

  afterEach(() => jest.useRealTimers());

  it('registers its wrapper and toggles the accessible expanded state', () => {
    jest.useFakeTimers();

    const componentFixture = renderComponent(CollapsibleScrollSection, {});
    const collapseButton =
      componentFixture.nativeElement.querySelector('button');

    expect(scrollServiceMock.setAnimationWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        nativeElement:
          componentFixture.nativeElement.querySelector('.animation-wrapper'),
      })
    );
    expect(collapseButton.getAttribute('aria-expanded')).toBe('true');

    collapseButton.click();
    componentFixture.detectChanges();

    expect(collapseButton.getAttribute('aria-expanded')).toBe('false');
    expect(
      componentFixture.nativeElement.querySelector(
        '.animation-wrapper--manual-active'
      )
    ).not.toBeNull();

    jest.advanceTimersByTime(200);
    collapseButton.click();
    componentFixture.detectChanges();
    jest.advanceTimersByTime(30);
    componentFixture.detectChanges();

    expect(collapseButton.getAttribute('aria-expanded')).toBe('true');
    expect(
      componentFixture.nativeElement.querySelector(
        '.animation-wrapper--manual-animating'
      )
    ).not.toBeNull();

    jest.advanceTimersByTime(200);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector(
        '.animation-wrapper--manual-animating'
      )
    ).toBeNull();

    const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

    collapseButton.click();

    const animationTimerCallIndex = setTimeoutSpy.mock.calls.findIndex(
      ([, delayMs]) => delayMs === 230
    );
    const animationTimerId =
      setTimeoutSpy.mock.results[animationTimerCallIndex].value;

    componentFixture.destroy();

    expect(scrollServiceMock.setAnimationWrapper).toHaveBeenLastCalledWith(
      null
    );
    expect(clearTimeoutSpy).toHaveBeenCalledWith(animationTimerId);
  });

  it('hides the button when scroll has consumed all visible height', () => {
    const componentFixture = renderComponent(CollapsibleScrollSection, {});

    scrollServiceMock.hasVisibleHeight.set(false);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement
        .querySelector('button')
        .classList.contains('opacity-0')
    ).toBe(true);

    scrollServiceMock.hasVisibleHeight.set(true);
  });
});
