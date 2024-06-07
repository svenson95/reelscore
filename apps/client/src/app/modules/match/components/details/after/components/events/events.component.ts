import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { FixtureEventsResponse } from '@lib/models';
import { FixtureService } from '../../../../../services';

@Component({
  selector: 'futbet-match-events',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  styles: `
    :host { @apply flex flex-col bg-white border-[1px] rounded-fb; }
    section { @apply flex flex-col my-5 gap-5; }
    .event-row { @apply flex gap-5; }
    .event-row > .team {  @apply flex-1; }
    .home { @apply text-right; }
  `,
  template: `
    <h3 class="match-section-title">SPIELBERICHT</h3>
    <section>
      @for (item of data(); track $index) {
      <div class="event-row">
        <div class="team home">
          @if (item.team.id === homeTeamId()) { @switch(item.type) {
          @case('Goal') {
          <div class="event goal">
            @switch (item.detail) { @case('Normal Goal') {
            <div class="goal normal">
              <div>
                <span>{{ item.player.name }}</span>
                <span>{{ item.player.name }}</span>
              </div>
            </div>
            } }
          </div>

          <div class="event subst"></div>
          } } } @else {
          <span>{{ item.time.elapsed }}'</span>
          }
        </div>

        <div class="event-icon">
          <mat-icon>add</mat-icon>
        </div>

        <div class="team away">
          @if (item.team.id === awayTeamId()) {
          {{ item.type }}
          } @else {
          {{ item.time.elapsed }}' }
        </div>
      </div>
      }
    </section>
  `,
})
export class MatchEventsComponent {
  data = input.required<FixtureEventsResponse[]>();
  fs = inject(FixtureService);

  homeTeamId = computed(() => this.fs.fixture()?.teams.home.id);
  awayTeamId = computed(() => this.fs.fixture()?.teams.away.id);
}
