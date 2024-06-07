import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { FixtureId, MatchDTO } from '@lib/models';
import {
  FixtureEventsService,
  FixtureStatisticsService,
} from '../../../services';
import { MatchEventsComponent, MatchStatisticsComponent } from './components';

@Component({
  selector: 'futbet-match-details-after',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatchStatisticsComponent, MatchEventsComponent],
  styles: `
    :host { @apply flex flex-col gap-10; }
  `,
  template: `
    <ng-container *ngIf="events() as e">
      <futbet-match-events [data]="e.response" />
    </ng-container>

    <ng-container *ngIf="statistics() as s">
      <futbet-match-statistics [data]="s.response" />
    </ng-container>

    <!-- <futbet-match-lineups /> -->
  `,
})
export class MatchDetailsAfterComponent {
  fixtureId = input.required<FixtureId>();
  fixture = input.required<MatchDTO>();

  fss = inject(FixtureStatisticsService);
  statistics = this.fss.statistics;

  fes = inject(FixtureEventsService);
  events = this.fes.events;
}
