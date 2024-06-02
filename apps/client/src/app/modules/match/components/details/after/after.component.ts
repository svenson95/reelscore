import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';

import { FixtureId } from '@lib/models';

import { FixtureStatisticsService } from '../../../../../services';
import { MatchStatisticsComponent } from '../../statistics/statistics.component';

@Component({
  selector: 'futbet-match-details-after',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchStatisticsComponent, NgIf, AsyncPipe],
  styles: ``,
  template: `
    <!-- <futbet-match-events /> -->
    @if (statistics()) {
    <futbet-match-statistics [data]="statistics()!" />
    }
    <!-- <futbet-match-lineups /> -->
  `,
})
export class MatchDetailsAfterComponent {
  fixtureId = input.required<FixtureId>();
  fs = inject(FixtureStatisticsService);

  idEffect = effect(
    () => {
      this.fs.fixtureId.set(this.fixtureId());
    },
    { allowSignalWrites: true }
  );

  statistics = this.fs.statistics;
}
