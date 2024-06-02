import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
    <futbet-match-statistics
      *ngIf="statistics() | async as data"
      [data]="data"
    />
    <!-- <futbet-match-lineups /> -->
  `,
})
export class MatchDetailsAfterComponent {
  fixtureId = input.required<FixtureId>();
  fs = inject(FixtureStatisticsService);

  statistics = computed(() =>
    this.fs.requestFixtureStatistics(this.fixtureId())
  );
}
