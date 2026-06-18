import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type { StatisticDTO } from '@lib/models';

import { StatisticList } from './models';

@Component({
  selector: 'rs-match-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col m-3 gap-5 py-rs2 bg-rs-alt-bg rounded-fb shadow-rs3; }
    :host > div { @apply flex; }
    :host > div > div { @apply basis-6/12; }
    :host > div > div > div { @apply flex gap-5 justify-center; }
    h4, li { @apply text-rs-color-text-1 text-rs-font-size-body-2 md:text-rs-font-size-body-1;}
    h4 { @apply text-rs-color-primary text-center mb-2 tracking-widest font-extralight text-rs-font-size-body-2; }
  `,
  template: `
    @let statistics = stats();
    <div>
      <div class="shotsTotal">
        <h4>Schüsse</h4>
        <div>
          <ul>
            <li>{{ statistics.shotsTotal?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.shotsTotal?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>

      <div class="shotsOnGoal">
        <h4>Torschüsse</h4>
        <div>
          <ul>
            <li>{{ statistics.shotsOnGoal?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.shotsOnGoal?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="ballPossession">
        <h4>Ballbesitz</h4>
        <div>
          <ul>
            <li>{{ statistics.ballPossession?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.ballPossession?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>

      <div class="cornerKicks">
        <h4>Eckstöße</h4>
        <div>
          <ul>
            <li>{{ statistics.cornerKicks?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.cornerKicks?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="fouls">
        <h4>Fouls</h4>
        <div>
          <ul>
            <li>{{ statistics.fouls?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.fouls?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>

      <div class="offsides">
        <h4>Abseits</h4>
        <div>
          <ul>
            <li>{{ statistics.offsides?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.offsides?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="passesTotal">
        <h4>Pässe insgesamt</h4>
        <div>
          <ul>
            <li>{{ statistics.passesTotal?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.passesTotal?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>

      <div class="passAccuracy">
        <h4>Pass Qoute</h4>
        <div>
          <ul>
            <li>{{ statistics.passAccuracy?.home ?? '-' }}</li>
          </ul>

          <ul>
            <li>{{ statistics.passAccuracy?.away ?? '-' }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <div class="yellowCards">
        <h4>Gelbe Karten</h4>
        <div>
          <ul>
            <li>{{ statistics.yellowCards?.home ?? 0 }}</li>
          </ul>

          <ul>
            <li>{{ statistics.yellowCards?.away ?? 0 }}</li>
          </ul>
        </div>
      </div>

      <div class="redCards">
        <h4>Rote Karten</h4>
        <div>
          <ul>
            <li>{{ statistics.redCards?.home ?? 0 }}</li>
          </ul>

          <ul>
            <li>{{ statistics.redCards?.away ?? 0 }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class MatchStatisticsComponent {
  readonly data = input.required<StatisticDTO[]>();
  readonly stats = computed<StatisticList>(() =>
    StatisticList.init(this.data())
  );
}
