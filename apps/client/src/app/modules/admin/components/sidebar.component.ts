import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DatabaseService } from '../service';

@Component({
  selector: 'futbet-admin-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col w-[250px] shrink-0 gap-10; }
    .group-title { @apply text-fb-color-text-2 border-b-[1px] pb-2 mb-2; }
    .group-title, li { @apply px-3 py-1 text-fb-font-size-body-2; }
    li span:last-of-type { @apply float-right; }
  `,
  template: `
    <section class="nav">
      <h4 class="group-title">Übersicht</h4>
      <ul>
        <li>Standings</li>
        <li>Fixtures</li>
        <li>Fixture-Statistics</li>
      </ul>
    </section>

    <section class="nav">
      <h4 class="group-title">Daten laden</h4>
      <ul>
        <li>Standings</li>
        <li>Fixtures</li>
        <li>Fixture-Statistics</li>
      </ul>
    </section>

    <section class="overview">
      <h4 class="group-title">Details</h4>
      <ul>
        <li>
          <span>Datensätze insgesamt:</span>
          <span>{{ totalLength() }}</span>
        </li>
        <li>
          <span>Standings Datensätze:</span>
          <span>{{ standingsLength() }}</span>
        </li>
        <li>
          <span>Fixtures Datensätze:</span>
          <span>{{ fixturesLength() }}</span>
        </li>
        <li>
          <span>Fixture-Statistics Datensätze:</span>
          <span>{{ fixtureStatisticsLength() }}</span>
        </li>
      </ul>
    </section>
  `,
})
export class SidebarComponent {
  ds = inject(DatabaseService);

  standingsLength = toSignal(this.ds.getAllStandingsCount());
  fixturesLength = toSignal(this.ds.getAllFixturesCount());
  fixtureStatisticsLength = toSignal(this.ds.getAllFixtureStatisticsCount());

  totalLength = computed(() => {
    const standings = this.standingsLength();
    const fixtures = this.fixturesLength();
    const fixtureStatistics = this.fixtureStatisticsLength();
    if (!standings || !fixtures || !fixtureStatistics) return 0;
    return fixtures + fixtureStatistics + standings;
  });
}
