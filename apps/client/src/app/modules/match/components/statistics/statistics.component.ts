import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { FixtureStatisticsResponse } from '@lib/models';
import { StatisticList } from './models';

@Component({
  selector: 'futbet-match-statistics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col bg-white border-[1px]; }
    section { @apply flex flex-col my-5 gap-5; }
    section > div { @apply flex; }
    div > div { @apply basis-6/12; }
    div > div > div { @apply flex gap-5 justify-center; }
    h4, li { @apply text-fb-font-size-body-2 md:text-fb-font-size-body-1;}
    h4 { @apply text-fb-color-text-2 text-center mb-2; }
  `,
  template: `
    <h3 class="match-section-title">STATISTIKEN</h3>
    <section>
      <div>
        <div>
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

        <div>
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
        <div>
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

        <div>
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
        <div>
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

        <div>
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
        <div>
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

        <div>
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
        <div>
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

        <div>
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
    </section>
  `,
})
export class MatchStatisticsComponent {
  data = input.required<FixtureStatisticsResponse[]>();

  stats = computed(() => StatisticList.init(this.data()));
}
