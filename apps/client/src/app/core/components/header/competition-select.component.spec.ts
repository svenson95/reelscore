import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { provideRouter, Router } from '@angular/router';

import { SHARED_PROVIDERS } from '@app/shared';

import { CompetitionSelectComponent } from './competition-select.component';

describe('CompetitionSelectComponent', () => {
  let fixture: ComponentFixture<CompetitionSelectComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionSelectComponent],
      providers: [
        provideRouter([{ path: 'competition/:competitionUrl', children: [] }]),
        ...SHARED_PROVIDERS,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompetitionSelectComponent);
    fixture.componentRef.setInput('selectedCompetition', undefined);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('navigates to the selected competition', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const select = await loader.getHarness(MatSelectHarness);

    await select.open();
    await select.clickOptions({ text: 'Bundesliga' });
    await fixture.whenStable();

    expect(router.url).toBe('/competition/bundesliga');
  });

  it('exposes each competition as a link for browser context-menu actions', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const select = await loader.getHarness(MatSelectHarness);

    await select.open();

    const competitionLink = document.querySelector<HTMLAnchorElement>(
      'a[href="/competition/bundesliga"]'
    );

    expect(competitionLink).not.toBeNull();
  });
});
