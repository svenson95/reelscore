import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';

import {
  createFixtureAnalysis,
  EXAMPLE_FIXTURE,
  renderComponent,
} from '@testing/client';

import { AnalysesEvaluationsComponent } from './evaluations.component';

describe('AnalysesEvaluationsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AnalysesEvaluationsComponent] });
  });

  it('expands match analyses, shows team alignment and reacts to the related team changing', async () => {
    const fixtureWithEvaluations = {
      ...EXAMPLE_FIXTURE,
      flatEvaluations: [
        { ...createFixtureAnalysis(), team: 'home' },
        { ...createFixtureAnalysis({ level: 'UNLUCKY' }), team: 'away' },
      ],
    };
    const componentFixture = renderComponent(AnalysesEvaluationsComponent, {
      fixtures: [fixtureWithEvaluations],
      relatedTeam: EXAMPLE_FIXTURE.teams.home,
    });
    const expansionPanel = await TestbedHarnessEnvironment.loader(
      componentFixture
    ).getHarness(MatExpansionPanelHarness);

    expect(await expansionPanel.isExpanded()).toBe(false);

    await expansionPanel.expand();

    expect(await expansionPanel.getTextContent()).toContain('Comment');

    const evaluationRows =
      componentFixture.nativeElement.querySelectorAll('.evaluation');

    expect(evaluationRows[0].classList.contains('is-related-team')).toBe(true);
    expect(evaluationRows[1].classList.contains('is-away')).toBe(true);

    componentFixture.componentRef.setInput(
      'relatedTeam',
      EXAMPLE_FIXTURE.teams.away
    );
    componentFixture.detectChanges();

    expect(evaluationRows[0].classList.contains('is-related-team')).toBe(false);
    expect(evaluationRows[1].classList.contains('is-related-team')).toBe(true);

    componentFixture.componentRef.setInput('fixtures', []);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('mat-expansion-panel')
    ).toBeNull();
  });
});
