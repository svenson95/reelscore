import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { FixtureStore } from '../../../../../../../store';

@Component({
  selector: 'reelscore-match-fixture-data',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
      :host { @apply bg-white border-[1px] rounded-fb; }
      ul { @apply py-2;}
      .item { @apply flex justify-center py-2 gap-5; }
      .item > *:not(.key) { @apply flex-[2] sm:flex-1; }
      .key { @apply text-fb-color-text-2 text-right flex-1; }
      span { @apply text-fb-font-size-body-2 md:text-fb-font-size-body-1;}
    `,
  template: `
    <ul>
      <li>
        <div class="item">
          <span class="key">Spieltag</span>
          <span> {{ round() }} </span>
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
  fs = inject(FixtureStore);
  data = this.fs.fixture;

  round = computed(() => {
    const rnd = this.data()!.league.round;
    const idx = rnd.lastIndexOf('-') + 2;
    return rnd.slice(idx, rnd.length);
  });
}
