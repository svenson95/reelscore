import { TestBed } from '@angular/core/testing';

import { EXAMPLE_FIXTURE } from '../../../../../../../../testing/fixtures.mock';
import {
  readElementTexts,
  renderComponent,
} from '../../../../../../../../testing/match-components.testing';

import { MatchStatisticsComponent } from './statistics.component';

describe('MatchStatisticsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatchStatisticsComponent] });
  });

  it('pairs statistics by type rather than order and preserves zero and percentages', () => {
    const componentFixture = renderComponent(MatchStatisticsComponent, {
      data: [
        {
          team: EXAMPLE_FIXTURE.teams.home,
          statistics: [
            { type: 'Total Shots', value: 0 },
            { type: 'Ball Possession', value: '60%' },
          ],
        },
        {
          team: EXAMPLE_FIXTURE.teams.away,
          statistics: [
            { type: 'Ball Possession', value: '40%' },
            { type: 'Total Shots', value: 5 },
          ],
        },
      ],
    });

    expect(
      readElementTexts(componentFixture.nativeElement, '.shotsTotal span')
    ).toEqual(['0', '5']);
    expect(
      readElementTexts(componentFixture.nativeElement, '.ballPossession span')
    ).toEqual(['60%', '40%']);

    componentFixture.componentRef.setInput('data', []);
    componentFixture.detectChanges();

    expect(
      readElementTexts(componentFixture.nativeElement, '.shotsTotal span')
    ).toEqual(['-', '-']);
    expect(
      readElementTexts(componentFixture.nativeElement, '.yellowCards span')
    ).toEqual(['0', '0']);
  });

  it('uses placeholders for absent away values', () => {
    const componentFixture = renderComponent(MatchStatisticsComponent, {
      data: [
        {
          team: EXAMPLE_FIXTURE.teams.home,
          statistics: [
            { type: 'Total passes', value: 123 },
            { type: 'Red Cards', value: null },
          ],
        },
      ],
    });

    expect(
      readElementTexts(componentFixture.nativeElement, '.passesTotal span')
    ).toEqual(['123', '-']);
    expect(
      readElementTexts(componentFixture.nativeElement, '.redCards span')
    ).toEqual(['0', '0']);
  });
});
