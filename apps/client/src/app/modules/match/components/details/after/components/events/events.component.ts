import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { EventWithResult } from '@lib/models';

import { FixtureStore } from '../../../../../store';

import { MatchEventComponent } from './components';
import { TimeTotalPipe } from './pipes';

@Component({
  selector: 'reelscore-match-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatchEventComponent, TimeTotalPipe],
  styles: `
    :host { @apply flex flex-col; }
    section { @apply flex flex-col my-5 gap-5 py-5 bg-white; }
    .event-row { @apply flex gap-5 items-center; }
    .event-row > .team {  @apply flex-1; }
    .home { @apply text-right; }
    .result { @apply text-rs-font-size-body-2; }
    mat-icon {
      @apply align-middle;
      &.yellow-card { @apply text-yellow-500; }
      &.red-card { @apply text-red-500; }
    }
    .time { @apply text-rs-font-size-body-2; }
  `,
  template: `
    <section>
      @for (event of data(); track $index) { @if (homeTeamId(); as homeId) { @if
      (awayTeamId(); as awayId) {
      <div class="event-row">
        <div class="team home">
          @if (event.team.id === homeId) {
          <reelscore-match-event [event]="event" [homeTeamId]="homeId" />
          } @else {
          <span class="time">{{ event | timeTotal }}'</span>
          }
        </div>

        <div class="event-icon">
          @if (event.type === 'Goal' && event.detail !== "Missed Penalty") {
          <span class="result">
            <span [class.font-bold]="event.team.id === homeId">
              {{ event.result.home }}
            </span>
            <span>&nbsp;-&nbsp;</span>
            <span [class.font-bold]="event.team.id === awayId">
              {{ event.result.away }}
            </span>
          </span>
          } @else if (event.detail === "Missed Penalty") {
          <mat-icon>close</mat-icon>
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
          <span class="time">{{ event | timeTotal }}'</span>
          }
        </div>
      </div>
      }}}
    </section>
  `,
})
export class MatchEventsComponent {
  data = input.required<EventWithResult[]>();

  fixtureStore = inject(FixtureStore);

  homeTeamId = computed(() => this.fixtureStore.fixture()?.data.teams.home.id);
  awayTeamId = computed(() => this.fixtureStore.fixture()?.data.teams.away.id);
}
