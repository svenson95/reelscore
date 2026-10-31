import { TestBed } from '@angular/core/testing';

import { TabNavigationComponent } from './tab-navigation.component';

describe('TabNavigationComponent', () => {
  const tabs = [
    { label: 'Details', icon: 'info' },
    { label: 'Statistics', icon: 'assessment' },
    { label: 'Report', icon: 'article', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabNavigationComponent],
    }).compileComponents();
  });

  const createComponent = () => {
    const fixture = TestBed.createComponent(TabNavigationComponent);

    fixture.componentRef.setInput('ariaLabel', 'Match navigation');
    fixture.componentRef.setInput('tabs', tabs);
    fixture.componentRef.setInput('selectedIndex', 0);
    fixture.detectChanges();

    return fixture;
  };

  it('emits the selected enabled tab index', () => {
    const fixture = createComponent();
    const selectedIndexChange = jest.spyOn(
      fixture.componentInstance.selectedIndexChange,
      'emit'
    );
    const buttons = fixture.nativeElement.querySelectorAll('button');

    buttons[1].click();

    expect(selectedIndexChange).toHaveBeenCalledWith(1);
  });

  it('does not emit for the selected or a disabled tab', () => {
    const fixture = createComponent();
    const selectedIndexChange = jest.spyOn(
      fixture.componentInstance.selectedIndexChange,
      'emit'
    );
    const buttons = fixture.nativeElement.querySelectorAll('button');

    buttons[0].click();
    buttons[2].click();

    expect(selectedIndexChange).not.toHaveBeenCalled();
    expect(buttons[2].disabled).toBe(true);
  });

  it('exposes accessible labels and the selected state', () => {
    const fixture = createComponent();
    const group = fixture.nativeElement.querySelector('[role="group"]');
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(group.getAttribute('aria-label')).toBe('Match navigation');
    expect(buttons[0].getAttribute('aria-label')).toBe('Details');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[0].textContent).toContain('Details');
    expect(buttons[1].textContent).toContain('Statistics');
    expect(
      fixture.nativeElement.querySelector('.active-indicator')
    ).not.toBeNull();
  });
  it('clears the indicator when the selected tab no longer exists', () => {
    const fixture = createComponent();
    fixture.componentRef.setInput('selectedIndex', 99);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector(
      '.tab-navigation'
    ) as HTMLElement;
    expect(group.style.getPropertyValue('--indicator-width')).toBe('0px');
  });
  it('realigns the indicator when the viewport changes', () => {
    const fixture = createComponent();
    const button = fixture.nativeElement.querySelector(
      'button'
    ) as HTMLButtonElement;
    Object.defineProperty(button, 'offsetLeft', { value: 32 });
    Object.defineProperty(button, 'offsetWidth', { value: 48 });

    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector(
      '.tab-navigation'
    ) as HTMLElement;
    expect(group.style.getPropertyValue('--indicator-left')).toBe('32px');
    expect(group.style.getPropertyValue('--indicator-width')).toBe('48px');
  });
});
