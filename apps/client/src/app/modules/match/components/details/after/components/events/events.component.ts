import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { timeTotal } from '@lib/models';
import { FixtureStore } from '../../../../../../../store';
import { EventsStore } from '../../../../../store/events.store';
import { MatchEventComponent } from './components';

@Component({
  selector: 'reelscore-match-events',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatchEventComponent],
  styles: `
    :host { @apply flex flex-col; }
    section { @apply flex flex-col my-5 gap-5; }
    .event-row { @apply flex gap-5 items-center; }
    .event-row > .team {  @apply flex-1; }
    .home { @apply text-right; }
    .result { @apply text-fb-font-size-body-2; }
    mat-icon {
      @apply align-middle;
      &.yellow-card { @apply text-yellow-500; }
      &.red-card { @apply text-red-500; }
    }
    .time { @apply text-fb-font-size-body-2; }
  `,
  template: `
    <section>
      @for (event of events(); track $index) { @if (homeTeamId(); as homeId) {
      @if (awayTeamId(); as awayId) {
      <div class="event-row">
        <div class="team home">
          @if (event.team.id === homeId) {
          <reelscore-match-event [event]="event" [homeTeamId]="homeId" />
          } @else {
          <span class="time">{{ timeTotal(event) }}'</span>
          }
        </div>

        <div class="event-icon">
          @if (event.type === "Goal") {
          <span class="result">
            <span [class.font-bold]="event.team.id === homeId">
              {{ event.result.home }}
            </span>
            <span>&nbsp;-&nbsp;</span>
            <span [class.font-bold]="event.team.id === awayId">
              {{ event.result.away }}
            </span>
          </span>
          } @else {
          <mat-icon
            [class.yellow-card]="
              event.type === 'Card' && event.detail === 'Yellow Card'
            "
            [class.red-card]="
              event.type === 'Card' && event.detail === 'Red Card'
            "
          >
            @switch(event.type) { @case("subst") { sync } @case("Card") { style
            } @case("Var") { visibility } }
          </mat-icon>
          }
        </div>

        <div class="team away">
          @if (event.team.id === awayId) {
          <reelscore-match-event [event]="event" [homeTeamId]="homeId" />
          } @else {
          <span class="time">{{ timeTotal(event) }}'</span>
          }
        </div>
      </div>
      }}}
    </section>
  `,
})
export class MatchEventsComponent {
  es = inject(EventsStore);
  events = this.es.events;

  fs = inject(FixtureStore);
  fixture = this.fs.fixture;

  homeTeamId = computed(() => this.fixture()?.teams.home.id);
  awayTeamId = computed(() => this.fixture()?.teams.away.id);

  timeTotal = timeTotal;
}
