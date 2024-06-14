import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { EventDTO } from '@lib/models';
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
      @for (event of data(); track $index) {
      <div class="event-row">
        <div class="team home">
          @if (event.team.id === homeTeamId()) { @if (homeTeamId(); as homeId) {
          @if (awayTeamId(); as awayId) {
          <futbet-match-event
            [event]="event"
            [goals]="goals()"
            [homeTeamId]="homeId"
            [awayTeamId]="awayId"
          />
          }}} @else {
          <span class="time">{{ event.time.elapsed + event.time.extra }}'</span>
          }
        </div>

        <div class="event-icon">
          <mat-icon
            [class.yellow-card]="
              event.type === 'Card' && event.detail === 'Yellow Card'
            "
            [class.red-card]="
              event.type === 'Card' && event.detail === 'Red Card'
            "
          >
            @switch(event.type) { @case("Goal") { sports_soccer } @case("subst")
            { sync } @case("Card") { style } @case("Var") { visibility } }
          </mat-icon>
        </div>

        <div class="team away">
          @if (event.team.id === awayTeamId()) { @if (homeTeamId(); as homeId) {
          @if (awayTeamId(); as awayId) {
          <futbet-match-event
            [event]="event"
            [goals]="goals()"
            [homeTeamId]="homeId"
            [awayTeamId]="awayId"
          />
          }}} @else {
          <span class="time">{{ event.time.elapsed + event.time.extra }}'</span>
          }
        </div>
      </div>
      }
    </section>
  `,
})
export class MatchEventsComponent {
  data = input.required<EventDTO[]>();
  fs = inject(FixtureService);

  homeTeamId = computed(() => this.fs.fixture()?.teams.home.id);
  awayTeamId = computed(() => this.fs.fixture()?.teams.away.id);

  goals = computed(() => this.data().filter((e) => e.type === 'Goal'));
}
