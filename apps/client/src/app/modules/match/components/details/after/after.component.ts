import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { FixtureDTO } from '@lib/models';
import {
  FixtureEventsService,
  FixtureStatisticsService,
} from '../../../services';
import { MatchEventsComponent, MatchStatisticsComponent } from './components';

@Component({
  selector: 'futbet-match-details-after',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchStatisticsComponent, MatchEventsComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if(events(); as events) { @if (events !== undefined) {
    <futbet-match-events [data]="events" />
    } } @if (statistics(); as s) { @if (s !== undefined) {
    <futbet-match-statistics [data]="s.response" />
    } }

    <!-- <futbet-match-lineups /> -->
  `,
})
export class MatchDetailsAfterComponent {
  fixture = input.required<FixtureDTO>();

  fss = inject(FixtureStatisticsService);
  statistics = this.fss.statistics;

  fes = inject(FixtureEventsService);
  events = this.fes.events;
}
