import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { StandingsDTO } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

import { StandingsTableComponent } from '../../../../../../../shared';

@Component({
  selector: 'rs-match-fixture-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host {
      rs-standings-table {
        @apply sm:min-w-[500px] sm:mx-auto;
      }
      .standings-container { @apply flex flex-col px-2 py-5 md:p-5 gap-5; }
    }
  `,
  template: `
    <h3 class="match-section-title">TABELLEN</h3>
    <div class="standings-container">
      @let data = standings(); @if (data !== null) { @if (hasMultipleGroups()) {
      @for (multipleStanding of data.league.standings; track $index) {
      <rs-standings-table [ranks]="multipleStanding" [league]="data.league" />
      } } @else {
      <rs-standings-table
        [ranks]="data.league.standings![0]"
        [league]="data.league"
      />
      @if (showHomeAndAwayStandings()) {
      <rs-standings-table
        [ranks]="data.league.standings![1]"
        [league]="data.league"
        header="Heimtabelle"
      />
      <rs-standings-table
        [ranks]="data.league.standings![2]"
        [league]="data.league"
        header="Auswärtstabelle"
      />
      } } } @else {
      <p class="no-data">Tabellen werden geladen ...</p>
      }
    </div>
  `,
})
export class MatchFixtureStandingsComponent {
  standings = input.required<StandingsDTO | null>();

  hasMultipleGroups = computed<boolean>(() => {
    const standings = this.standings();
    if (!standings) return false;
    return isCompetitionWithMultipleGroups(standings.league.id);
  });

  showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.standings();
    if (!standings) return false;
    return standings.league.standings?.length === 3;
  });
}
