import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabPanelDirective, TabSwipeDirective } from '../directives';

import type { TabNavigationItem } from './tab-navigation.component';
import { TabViewComponent } from './tab-view.component';

@Component({
  imports: [TabViewComponent, TabPanelDirective],
  template: `<rs-tab-view [tabs]="tabs()" [(selectedIndex)]="selected">
    <ng-template rsTabPanel><p>First</p></ng-template>
    <ng-template rsTabPanel><p>Second</p></ng-template>
    <ng-template rsTabPanel><input aria-label="Notes" /></ng-template>
  </rs-tab-view>`,
})
class TabViewHostComponent {
  readonly selected = signal(0);
  readonly tabs = signal<TabNavigationItem[]>([
    { label: 'First', icon: 'info' },
    { label: 'Second', icon: 'info' },
    { label: 'Third', icon: 'info' },
  ]);
}

describe('TabViewComponent', () => {
  it('releases outgoing panels after their own animation and retains visited input state', () => {
    const fixture = TestBed.createComponent(TabViewHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).toBeNull();

    fixture.componentInstance.selected.set(2);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;
    input.value = 'Keep my notes';
    const outgoing = fixture.nativeElement.querySelector(
      '.slide-out'
    ) as HTMLElement;
    const child = outgoing.querySelector('p');
    child?.dispatchEvent(new Event('animationend', { bubbles: true }));
    fixture.detectChanges();
    expect(outgoing.style.display).toBe('');

    outgoing.dispatchEvent(new Event('animationend'));
    fixture.detectChanges();
    expect(outgoing.style.display).toBe('none');

    fixture.componentInstance.selected.set(1);
    fixture.detectChanges();
    fixture.componentInstance.selected.set(2);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).toBe(input);
    expect(input.value).toBe('Keep my notes');
  });

  it('bounds swipe navigation, skips disabled targets, and resets a disabled selection', () => {
    const fixture = TestBed.createComponent(TabViewHostComponent);
    fixture.detectChanges();
    const swipe = fixture.debugElement
      .query(By.directive(TabSwipeDirective))
      .injector.get(TabSwipeDirective);
    swipe.tabSwipe.emit(-1);
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe(0);

    fixture.componentInstance.tabs.update((tabs) =>
      tabs.map((tab, index) => ({ ...tab, disabled: index === 1 }))
    );
    fixture.detectChanges();
    swipe.tabSwipe.emit(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe(0);

    fixture.componentInstance.selected.set(2);
    fixture.detectChanges();
    swipe.tabSwipe.emit(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe(2);

    fixture.componentInstance.tabs.update((tabs) =>
      tabs.map((tab, index) => ({ ...tab, disabled: index === 2 }))
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe(0);
  });
});
