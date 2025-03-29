import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { CompetitionRoundPipe } from '@app/shared';
import { FixtureStore } from '../../../../../store';

@Component({
  selector: 'reelscore-match-fixture-data',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CompetitionRoundPipe],
  styles: `
      ul { @apply py-5; }
      li:not(:last-of-type) .item { @apply pb-2; }
      .item { @apply flex justify-center px-4 gap-6 text-rs-color-text-3; }
      .item > *:not(.key) { @apply flex-2 sm:flex-1; }
      .key { @apply text-rs-color-orange text-right tracking-wider font-extralight flex-1; }
      span { @apply text-rs-font-size-body-2;}
    `,
  template: `
    <ul>
      <li>
        <div class="item">
          <span class="key">Spieltag</span>
          <span> {{ data()!.league.round | competitionRound }} </span>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Stadion</span>
          <span>
            {{ data()!.fixture.venue.name }}
          </span>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Stadt</span>
          <span>
            {{ data()!.fixture.venue.city }}
          </span>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Schiedsrichter</span>
          <span>{{ data()!.fixture.referee }}</span>
        </div>
      </li>
    </ul>
  `,
})
export class MatchFixtureDataComponent {
  fixtureStore = inject(FixtureStore);
  data = computed(() => this.fixtureStore.fixture()?.data);
}
