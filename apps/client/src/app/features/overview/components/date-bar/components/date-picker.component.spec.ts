import { TestBed } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent],
    }).compileComponents();
  });

  const createComponent = () => {
    const fixture = TestBed.createComponent(DatePickerComponent);

    fixture.componentRef.setInput('selectedDay', '2026-08-10');
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();

    return fixture;
  };

  it('should display the selected date', () => {
    const fixture = createComponent();

    const selectedDate = fixture.nativeElement.querySelector(
      '[data-testid="selected-date"]'
    ) as HTMLElement;

    expect(selectedDate.textContent?.trim()).toBe('10.08.26');
  });

  it('should emit the selected date when a date is chosen', () => {
    const fixture = createComponent();
    const emitSpy = jest.spyOn(fixture.componentInstance.dateSelected, 'emit');

    fixture.componentInstance.updateDate(new Date(2026, 7, 15));

    expect(emitSpy).toHaveBeenCalledWith('2026-08-15');
  });

  it('should not emit a date when the selected value is null', () => {
    const fixture = createComponent();
    const emitSpy = jest.spyOn(fixture.componentInstance.dateSelected, 'emit');

    fixture.componentInstance.updateDate(null);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
