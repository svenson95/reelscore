import { Location } from '@angular/common';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';

import { getTodayDateString } from '@lib/shared';

import { routes } from '../../../app.routes';
import { GLOBAL_SERVICE_PROVIDERS, LeagueService } from '../../services';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let location: Location;
  let router: Router;
  let leagueService: LeagueService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(routes), ...GLOBAL_SERVICE_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);

    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    leagueService = TestBed.inject(LeagueService);

    fixture.detectChanges();
  });

  it(`should display 'reelscore' logo`, () => {
    // Arrange
    const logo = fixture.debugElement.query(By.css('rs-logo'));

    // Assert
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.textContent).toContain('reelscore');
  });

  it('should route to start on logo-toggle click', async () => {
    // Arrange
    const testLocation = '/2026-08-14/bundesliga-2/1576148';

    await router.navigateByUrl(testLocation);

    expect(location.path()).toBe(testLocation);

    // Act
    const button = fixture.debugElement.query(
      By.css('[data-testid="app-logo"]')
    );
    button.nativeElement.click();

    await fixture.whenStable();

    // Assert
    expect(location.path()).toBe('/' + getTodayDateString());
  });

  it('should initialize without selected league', () => {
    expect(leagueService.selectedLeague()).toBeUndefined();
  });
});
