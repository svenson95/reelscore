import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FixtureStatisticsDTO } from '@lib/models';

import { MatchStatisticsComponent } from '../../../components';

@Component({
  selector: 'futbet-match-details-after',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchStatisticsComponent],
  styles: ``,
  template: `
    <!-- <futbet-match-events /> -->
    <futbet-match-statistics [data]="statistics()" />
    <!-- <futbet-match-lineups /> -->
  `,
})
export class MatchDetailsAfterComponent {
  statistics = input.required<FixtureStatisticsDTO>();
}
