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
    :host { @apply flex flex-col m-3 gap-5 py-rs2 bg-rs-button-bg rounded-border2 shadow-rs3; }
    :host > div { @apply flex; }
    :host > div > div { @apply basis-6/12; }
    :host > div > div > div { @apply flex gap-5 justify-center; }
    h4, span { @apply text-rs-color-text-1 text-rs-font-size-body-2;}
    h4 { @apply text-rs-color-text-2 text-center mb-2 font-extralight; }
  `,
  template: `
    @let statistics = stats();
    <div>
      <div class="shotsTotal">
        <h4>Schüsse</h4>
        <div>
          <span>{{ statistics.shotsTotal?.home ?? '-' }}</span>
          <span>{{ statistics.shotsTotal?.away ?? '-' }}</span>
        </div>
      </div>

      <div class="shotsOnGoal">
        <h4>Torschüsse</h4>
        <div>
          <span>{{ statistics.shotsOnGoal?.home ?? '-' }}</span>
          <span>{{ statistics.shotsOnGoal?.away ?? '-' }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="ballPossession">
        <h4>Ballbesitz</h4>
        <div>
          <span>{{ statistics.ballPossession?.home ?? '-' }}</span>
          <span>{{ statistics.ballPossession?.away ?? '-' }}</span>
        </div>
      </div>

      <div class="cornerKicks">
        <h4>Eckstöße</h4>
        <div>
          <span>{{ statistics.cornerKicks?.home ?? '-' }}</span>
          <span>{{ statistics.cornerKicks?.away ?? '-' }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="fouls">
        <h4>Fouls</h4>
        <div>
          <span>{{ statistics.fouls?.home ?? '-' }}</span>
          <span>{{ statistics.fouls?.away ?? '-' }}</span>
        </div>
      </div>

      <div class="offsides">
        <h4>Abseits</h4>
        <div>
          <span>{{ statistics.offsides?.home ?? '-' }}</span>
          <span>{{ statistics.offsides?.away ?? '-' }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="passesTotal">
        <h4>Pässe insgesamt</h4>
        <div>
          <span>{{ statistics.passesTotal?.home ?? '-' }}</span>
          <span>{{ statistics.passesTotal?.away ?? '-' }}</span>
        </div>
      </div>

      <div class="passAccuracy">
        <h4>Pass Qoute</h4>
        <div>
          <span>{{ statistics.passAccuracy?.home ?? '-' }}</span>
          <span>{{ statistics.passAccuracy?.away ?? '-' }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="yellowCards">
        <h4>Gelbe Karten</h4>
        <div>
          <span>{{ statistics.yellowCards?.home ?? 0 }}</span>
          <span>{{ statistics.yellowCards?.away ?? 0 }}</span>
        </div>
      </div>

      <div class="redCards">
        <h4>Rote Karten</h4>
        <div>
          <span>{{ statistics.redCards?.home ?? 0 }}</span>
          <span>{{ statistics.redCards?.away ?? 0 }}</span>
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
