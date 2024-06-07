import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { combineLatest, map } from 'rxjs';
import { AdminService, DatabaseService } from '../../../services';

@Component({
  selector: 'futbet-admin-sidebar-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    .group-title { @apply text-fb-color-text-2 border-b-[1px] pb-2 mb-2; }
    .group-title, li { @apply px-3 py-1 text-fb-font-size-body-2; }
    li span:last-of-type { @apply float-right; }
  `,
  template: `
    <h4 class="group-title">Details</h4>
    <ul>
      <li>
        <span>Datensätze insgesamt:</span>
        <span>{{ totalLength() }}</span>
      </li>
      <li>
        <span>Standings Datensätze:</span>
        <span>{{ details()?.standingsLength }}</span>
      </li>
      <li>
        <span>Fixtures Datensätze:</span>
        <span>{{ details()?.fixturesLength }}</span>
      </li>
      <li>
        <span>Fixture-Statistics Datensätze:</span>
        <span>{{ details()?.statisticsLength }}</span>
      </li>
      <li>
        <span>Fixture-Events Datensätze:</span>
        <span>{{ details()?.eventsLength }}</span>
      </li>
    </ul>
  `,
})
export class SidebarDetailsComponent {
  ds = inject(DatabaseService);
  as = inject(AdminService);

  details = toSignal(
    combineLatest([
      this.ds.getAllStandingsCount(),
      this.ds.getAllFixturesCount(),
      this.ds.getAllFixtureStatisticsCount(),
      this.ds.getAllFixtureEventsCount(),
    ]).pipe(
      map(
        ([
          standingsLength,
          fixturesLength,
          statisticsLength,
          eventsLength,
        ]) => ({
          standingsLength,
          fixturesLength,
          statisticsLength,
          eventsLength,
        })
      )
    )
  );

  totalLength = computed(() => {
    const standings = this.details()?.standingsLength;
    const fixtures = this.details()?.fixturesLength;
    const fixtureStatistics = this.details()?.statisticsLength;
    const fixtureEvents = this.details()?.statisticsLength;
    if (!standings || !fixtures || !fixtureStatistics || !fixtureEvents) {
      return null;
    }
    return fixtures + fixtureStatistics + standings + fixtureEvents;
  });
}
