import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { MatchDTO } from '@lib/models';
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
    :host { @apply flex flex-col gap-10; }
  `,
  template: `
    @if(events(); as e) { @if (e !== undefined) {
    <futbet-match-events [data]="e.response" />
    } } @if (statistics(); as s) { @if (s !== undefined) {
    <futbet-match-statistics [data]="s.response" />
    } }

    <!-- <futbet-match-lineups /> -->
  `,
})
export class MatchDetailsAfterComponent {
  fixture = input.required<MatchDTO>();

  fss = inject(FixtureStatisticsService);
  statistics = this.fss.statistics;

  fes = inject(FixtureEventsService);
  events = this.fes.events;
}
