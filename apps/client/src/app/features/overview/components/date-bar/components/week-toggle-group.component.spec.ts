import { TestBed } from '@angular/core/testing';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { By } from '@angular/platform-browser';

import type { DateString } from '@lib/shared';

import { DateService } from '../../../services';

import { WeekToggleGroupComponent } from './week-toggle-group.component';

describe('WeekToggleGroupComponent', () => {
  const weekdays: DateString[] = [
    '2026-08-10',
    '2026-08-11',
    '2026-08-12',
    '2026-08-13',
    '2026-08-14',
    '2026-08-15',
    '2026-08-16',
  ];

  const dateServiceMock = {
    today: jest.fn(() => '2026-08-15'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekToggleGroupComponent],
      providers: [
        {
          provide: DateService,
          useValue: dateServiceMock,
        },
      ],
    }).compileComponents();
  });

  const createComponent = (selectedDay: DateString = '2026-08-12') => {
    const fixture = TestBed.createComponent(WeekToggleGroupComponent);

    fixture.componentRef.setInput('selectedDay', selectedDay);
    fixture.componentRef.setInput('calendarWeek', 33);
    fixture.componentRef.setInput('weekdays', weekdays);
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();

    return fixture;
  };

  it('should select the previous day when clicking the previous button', () => {
    const fixture = createComponent('2026-08-12');
    const emitSpy = jest.spyOn(fixture.componentInstance.dateSelected, 'emit');

    const previousButton = fixture.nativeElement.querySelector(
      '[data-testid="week-toggle-prev-btn"]'
    ) as HTMLButtonElement;

    previousButton.click();

    expect(emitSpy).toHaveBeenCalledWith('2026-08-11');
  });

  it('should select the next day when clicking the next button', () => {
    const fixture = createComponent('2026-08-12');
    const emitSpy = jest.spyOn(fixture.componentInstance.dateSelected, 'emit');

    const nextButton = fixture.nativeElement.querySelector(
      '[data-testid="week-toggle-next-btn"]'
    ) as HTMLButtonElement;

    nextButton.click();

    expect(emitSpy).toHaveBeenCalledWith('2026-08-13');
  });

  it('should display all weekdays from Monday to Sunday', () => {
    const fixture = createComponent();

    const toggles = fixture.debugElement.queryAll(
      By.directive(MatButtonToggle)
    );

    const labels = toggles.map((toggle) =>
      toggle.nativeElement.textContent.trim()
    );

    expect(labels).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('should mark the selected day as active', () => {
    const fixture = createComponent('2026-08-12');

    const toggles = fixture.debugElement.queryAll(
      By.directive(MatButtonToggle)
    );

    const selectedToggle = toggles.find(
      (toggle) => toggle.componentInstance.value === '2026-08-12'
    );

    expect(selectedToggle).toBeDefined();
    expect(selectedToggle?.componentInstance.checked).toBe(true);
  });
});
