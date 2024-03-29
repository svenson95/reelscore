import { Location } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes(routes),
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  /* Class Tests */
  it('should start with "/" route', fakeAsync(() => {
    // Arrange
    const path = location.path();

    // Act
    tick();

    // Assert
    expect(path).toBe('/');
  }));

  /* DOM Tests */
  it('should display header, router and footer', () => {
    // Arrange
    const header = fixture.nativeElement.querySelector('header');
    const router = fixture.nativeElement.querySelector('router-outlet');
    const footer = fixture.nativeElement.querySelector('footer');

    // Act
    fixture.detectChanges();

    // Assert
    expect(header).toBeTruthy();
    expect(router).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain(
  //     'Welcome client'
  //   );
  // });
});
