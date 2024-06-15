import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { EventWithResult, timeTotal } from '@lib/models';
import { FixtureService } from '../../../../../services';
import { MatchEventComponent } from './components';

@Component({
  selector: 'futbet-match-events',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatchEventComponent],
  styles: `
    :host { @apply flex flex-col bg-white border-[1px] rounded-fb; }
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
    <h3 class="match-section-title">SPIELBERICHT</h3>
    <section>
      @for (event of data(); track $index) { @if (homeTeamId(); as homeId) { @if
      (awayTeamId(); as awayId) {

      <div class="event-row">
        <div class="team home">
          @if (event.team.id === homeId) {
          <futbet-match-event [event]="event" [homeTeamId]="homeId" />
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
          <futbet-match-event [event]="event" [homeTeamId]="homeId" />
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
  data = input.required<EventWithResult[]>();
  fs = inject(FixtureService);

  homeTeamId = computed(() => this.fs.fixture()?.teams.home.id);
  awayTeamId = computed(() => this.fs.fixture()?.teams.away.id);

  timeTotal = timeTotal;
}
