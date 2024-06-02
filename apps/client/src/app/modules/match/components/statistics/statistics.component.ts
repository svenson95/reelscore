import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { FixtureStatisticsDTO } from '@lib/models';

import { StatisticList } from './models';

@Component({
  selector: 'futbet-match-statistics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    section { @apply my-5; }
    div { @apply flex gap-5 justify-center mb-5; }
    h3 { @apply pb-2 mb-2 border-b-[1px] text-center; } // todo refac 
    h4, li { @apply text-fb-font-size-body-2 md:text-fb-font-size-body-1;}
    h4 { @apply text-fb-color-text-2 text-center mb-2; }
  `,
  template: `
    <h3>STATISTIKEN</h3>
    <section>
      <h4>Ballbesitz</h4>
      <div>
        <ul>
          <li>{{ stats().ballPossession.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().ballPossession.away }}</li>
        </ul>
      </div>

      <h4>Schüsse insgesamt</h4>
      <div>
        <ul>
          <li>{{ stats().shotsTotal.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().shotsTotal.away }}</li>
        </ul>
      </div>

      <h4>Schüsse</h4>
      <div>
        <ul>
          <li>{{ stats().shotsOnGoal.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().shotsOnGoal.away }}</li>
        </ul>
      </div>

      <h4>Schüsse aufs Tor</h4>
      <div>
        <ul>
          <li>{{ stats().shotsOnGoal.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().shotsOnGoal.away }}</li>
        </ul>
      </div>

      <h4>Eckstöße</h4>
      <div>
        <ul>
          <li>{{ stats().cornerKicks.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().cornerKicks.away }}</li>
        </ul>
      </div>

      <h4>Fouls</h4>
      <div>
        <ul>
          <li>{{ stats().fouls.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().fouls.away }}</li>
        </ul>
      </div>

      <h4>Geblockte Schüsse</h4>
      <div>
        <ul>
          <li>{{ stats().goalkeeperSaves.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().goalkeeperSaves.away }}</li>
        </ul>
      </div>

      <h4>Abseits</h4>
      <div>
        <ul>
          <li>{{ stats().offsides.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().offsides.away }}</li>
        </ul>
      </div>

      <h4>Pässe insgesamt</h4>
      <div>
        <ul>
          <li>{{ stats().passesTotal.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().passesTotal.away }}</li>
        </ul>
      </div>

      <h4>Pass Qoute</h4>
      <div>
        <ul>
          <li>{{ stats().passAccuracy.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().passAccuracy.away }}</li>
        </ul>
      </div>

      <h4>Gelbe Karten</h4>
      <div>
        <ul>
          <li>{{ stats().yellowCards.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().yellowCards.away }}</li>
        </ul>
      </div>

      <h4>Rote Karten</h4>
      <div>
        <ul>
          <li>{{ stats().redCards.home }}</li>
        </ul>

        <ul>
          <li>{{ stats().redCards.away }}</li>
        </ul>
      </div>
    </section>
  `,
})
export class MatchStatisticsComponent {
  data = input.required<FixtureStatisticsDTO>();

  stats = computed(() => StatisticList.init(this.data().response));
}
