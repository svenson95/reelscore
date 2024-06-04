import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
  imports: [NgIf, MatchStatisticsComponent],
  styles: ``,
  template: `
    <!-- <futbet-match-events /> -->
    <ng-container *ngIf="statistics() as stats">
      <futbet-match-statistics [data]="stats.response" />
    </ng-container>
    <!-- <futbet-match-lineups /> -->
  `,
})
export class MatchDetailsAfterComponent {
  fixtureId = input.required<FixtureId>();

  fs = inject(FixtureStatisticsService);
  statistics = this.fs.statistics;
}
