import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import {
  EXAMPLE_FIXTURE,
  readElementText,
  renderComponent,
} from '@testing/client';

import { MatchFixturesTableComponent } from './components';

import { MatchLatestFixturesComponent } from './latest-fixtures.component';

describe('MatchLatestFixturesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchLatestFixturesComponent],
      providers: [provideRouter([])],
    });
  });

  it('transitions from skeletons through failure and empty states to both team tables', () => {
    const componentFixture = renderComponent(MatchLatestFixturesComponent, {
      isLoading: true,
      error: 'failed',
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('.fixtures-skeleton')
    ).toHaveLength(2);
    expect(
      componentFixture.nativeElement.querySelectorAll('.skeleton-row')
    ).toHaveLength(10);
    expect(
      componentFixture.nativeElement.querySelectorAll('.skeleton-team-header')
    ).toHaveLength(2);
    expect(
      componentFixture.nativeElement.querySelectorAll('.skeleton-form-value')
    ).toHaveLength(20);

    componentFixture.componentRef.setInput('isLoading', false);
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Fehler beim Laden der Spiele'
    );

    componentFixture.componentRef.setInput('error', null);
    componentFixture.detectChanges();

    expect(readElementText(componentFixture.nativeElement)).toContain(
      'Keine Spiele gefunden'
    );

    componentFixture.componentRef.setInput('data', EXAMPLE_FIXTURE);
    componentFixture.componentRef.setInput('latestFixtures', {
      home: [EXAMPLE_FIXTURE],
      away: [],
    });
    componentFixture.detectChanges();

    const teamTables = componentFixture.debugElement.queryAll(
      By.directive(MatchFixturesTableComponent)
    );

    expect(teamTables).toHaveLength(2);
    expect(teamTables[0].componentInstance.team()).toEqual(
      EXAMPLE_FIXTURE.teams.home
    );
    expect(teamTables[1].componentInstance.team()).toEqual(
      EXAMPLE_FIXTURE.teams.away
    );
    expect(teamTables[0].nativeElement.querySelectorAll('a')).toHaveLength(1);
    expect(readElementText(teamTables[1].nativeElement)).toContain(
      'Keine Spiele gefunden'
    );
  });

  it('opens the performance explanation and restores the info button colors after closing', async () => {
    const view = renderComponent(MatchLatestFixturesComponent, {});
    const menu = await TestbedHarnessEnvironment.loader(view).getHarness(
      MatMenuHarness
    );
    const button = view.nativeElement.querySelector(
      'button[aria-label="Performance-Bewertung erklären"]'
    );

    await menu.open();

    expect(await menu.isOpen()).toBe(true);
    expect(
      document.body.querySelector('.performance-info')?.textContent
    ).toContain('Gut gespielt');
    expect(button.style.getPropertyValue('--rs-button-bg-color')).toBe(
      'var(--rs-color-primary)'
    );
    expect(button.style.getPropertyValue('--mat-icon-color')).toBe(
      'var(--rs-color-text-3)'
    );

    await menu.close();

    expect(await menu.isOpen()).toBe(false);
    expect(button.style.getPropertyValue('--rs-button-bg-color')).toBe('');
    expect(button.style.getPropertyValue('--mat-icon-color')).toBe(
      'var(--rs-color-text-1)'
    );
  });
});
