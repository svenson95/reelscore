import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { ReplayAnimationOnNavigationDirective } from './replay-animation-on-navigation.directive';

@Component({
  standalone: true,
  imports: [ReplayAnimationOnNavigationDirective],
  template: `<div class="animate-fade-in" rsReplayAnimationOnNavigation></div>`,
})
class TestHostComponent {}

describe('ReplayAnimationOnNavigationDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let routerEvents: Subject<unknown>;
  let animationFrameCallback: FrameRequestCallback | undefined;

  beforeEach(() => {
    routerEvents = new Subject();
    animationFrameCallback = undefined;

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: Router, useValue: { events: routerEvents.asObservable() } },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('restarts an active animation after navigation', () => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        animationFrameCallback = callback;
        return 1;
      });

    const element = fixture.nativeElement.querySelector('div') as HTMLElement;

    routerEvents.next(new NavigationEnd(1, '/before', '/after'));

    expect(element.classList.contains('animate-fade-in')).toBe(false);
    expect(animationFrameCallback).toBeDefined();

    animationFrameCallback?.(0);

    expect(element.classList.contains('animate-fade-in')).toBe(true);
  });
});
