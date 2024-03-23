import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let fixture: ComponentFixture<LogoComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture.detectChanges();
    router.initialNavigation();
  });

  /* Class Tests */
  it(`should navigate to root on logo clicked`, fakeAsync(() => {
    const component = fixture.componentInstance;
    const nativeElement = fixture.debugElement.nativeElement;
    const path = location.path();

    spyOn(component, 'onLogoClick');
    const button = nativeElement.querySelector('button');
    button.click();
    tick();

    expect(component.onLogoClick).toHaveBeenCalled();
    expect(path).toBe('');
  }));

  /* DOM Tests */
  it(`should navigate to root on logo clicked`, fakeAsync(() => {
    const component = fixture.componentInstance;
    const nativeElement = fixture.debugElement.nativeElement;
    const path = location.path();

    spyOn(component, 'onLogoClick');
    const button = nativeElement.querySelector('button');
    button.click();
    tick();

    expect(component.onLogoClick).toHaveBeenCalled();
    expect(path).toBe('');
  }));

  // TODO: check how to set disabled state for this test
  // it("shouldn't trigger action if disabled input is defined", () => {
  //   const nativeElement = fixture.debugElement.nativeElement;
  //   const isDisabled = fixture.componentInstance.isDisabled();
  //   const isClickable = !isDisabled;
  //   const button = nativeElement.querySelector('button[mat-button]');

  //   // Assert
  //   expect(isDisabled && button?.disabled).toBeTrue();
  //   expect(isClickable && !button?.disabled).toBeTrue();
  // });
});
