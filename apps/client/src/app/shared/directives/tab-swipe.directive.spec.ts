import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabSwipeDirective } from './tab-swipe.directive';

@Component({
  imports: [TabSwipeDirective],
  template: '<div rsTabSwipe><button>Action</button></div>',
})
class SwipeHostComponent {}

describe('TabSwipeDirective', () => {
  it('ignores mouse input, controls, short and vertical gestures, and cancelled pointers', () => {
    const fixture = TestBed.createComponent(SwipeHostComponent);
    fixture.detectChanges();
    const host = fixture.debugElement.query(By.directive(TabSwipeDirective));
    const emit = jest.spyOn(
      host.injector.get(TabSwipeDirective).tabSwipe,
      'emit'
    );
    const start = {
      pointerType: 'touch',
      pointerId: 1,
      clientX: 100,
      clientY: 100,
      target: host.nativeElement,
    };
    const finish = { ...start, clientX: 20 };

    host.triggerEventHandler('pointerdown', { ...start, pointerType: 'mouse' });
    host.triggerEventHandler('pointerup', finish);
    host.triggerEventHandler('pointerdown', {
      ...start,
      target: host.nativeElement.querySelector('button'),
    });
    host.triggerEventHandler('pointerup', finish);
    host.triggerEventHandler('pointerdown', start);
    host.triggerEventHandler('pointerup', { ...finish, clientX: 90 });
    host.triggerEventHandler('pointerdown', start);
    host.triggerEventHandler('pointerup', { ...finish, clientY: 300 });
    host.triggerEventHandler('pointerdown', start);
    host.triggerEventHandler('pointercancel', {});
    host.triggerEventHandler('pointerup', finish);

    expect(emit).not.toHaveBeenCalled();

    host.triggerEventHandler('pointerdown', start);
    host.triggerEventHandler('pointerup', finish);
    expect(emit).toHaveBeenLastCalledWith(1);
    host.triggerEventHandler('pointerdown', start);
    host.triggerEventHandler('pointerup', { ...finish, clientX: 180 });
    expect(emit).toHaveBeenLastCalledWith(-1);
  });
});
