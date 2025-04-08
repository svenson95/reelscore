import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { StatisticDTO } from '@lib/models';
import { StatisticList } from './models';

@Component({
  selector: 'rs-match-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col my-10 gap-5; }
    :host > div { @apply flex; }
    :host > div > div { @apply basis-6/12; }
    :host > div > div > div { @apply flex gap-5 justify-center; }
    h4, li { @apply text-rs-color-text-3 text-rs-font-size-body-2 md:text-rs-font-size-body-1;}
    h4 { @apply text-rs-color-orange text-center mb-2 tracking-widest font-extralight text-rs-font-size-body-2; }
  `,
  template: `
    <div>
      <div class="shotsTotal">
        <h4>Schüsse</h4>
        <div>
          <ul>
            <li>{{ stats().shotsTotal.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().shotsTotal.away }}</li>
          </ul>
        </div>
      </div>

      <div class="shotsOnGoal">
        <h4>Torschüsse</h4>
        <div>
          <ul>
            <li>{{ stats().shotsOnGoal.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().shotsOnGoal.away }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="ballPossession">
        <h4>Ballbesitz</h4>
        <div>
          <ul>
            <li>{{ stats().ballPossession.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().ballPossession.away }}</li>
          </ul>
        </div>
      </div>

      <div class="cornerKicks">
        <h4>Eckstöße</h4>
        <div>
          <ul>
            <li>{{ stats().cornerKicks.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().cornerKicks.away }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="fouls">
        <h4>Fouls</h4>
        <div>
          <ul>
            <li>{{ stats().fouls.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().fouls.away }}</li>
          </ul>
        </div>
      </div>

      <div class="offsides">
        <h4>Abseits</h4>
        <div>
          <ul>
            <li>{{ stats().offsides.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().offsides.away }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="passesTotal">
        <h4>Pässe insgesamt</h4>
        <div>
          <ul>
            <li>{{ stats().passesTotal.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().passesTotal.away }}</li>
          </ul>
        </div>
      </div>

      <div class="passAccuracy">
        <h4>Pass Qoute</h4>
        <div>
          <ul>
            <li>{{ stats().passAccuracy.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().passAccuracy.away }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="yellowCards">
        <h4>Gelbe Karten</h4>
        <div>
          <ul>
            <li>{{ stats().yellowCards.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().yellowCards.away }}</li>
          </ul>
        </div>
      </div>

      <div class="redCards">
        <h4>Rote Karten</h4>
        <div>
          <ul>
            <li>{{ stats().redCards.home }}</li>
          </ul>

          <ul>
            <li>{{ stats().redCards.away }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class MatchStatisticsComponent {
  data = input.required<StatisticDTO[]>();
  stats = computed(() => StatisticList.init(this.data()));
}
