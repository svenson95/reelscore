import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  hasMultipleGroups,
  PageTitleComponent,
  showHomeAndAwayStandings,
  StandingsTableComponent,
} from '@app/shared';
import type { StandingRanks, StandingsDTO, StandingsLeague } from '@lib/models';

@Component({
  selector: 'rs-match-fixture-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, StandingsTableComponent],
  styles: `
    :host {
      rs-standings-table {
        @apply sm:min-w-[500px] sm:mx-auto shadow-rs3;
      }

      .standings-container {
        @apply flex flex-col px-3 py-rs1 gap-rs1;
      }
    }
  `,
  template: `
    <rs-page-title title="Tabellen" />

    <div class="standings-container">
      @let leagueData = league(); @let groups = standingGroups(); @if
      (leagueData && groups.length) { @if (hasMultipleGroups()) { @for
      (multipleStanding of groups; track $index) {
      <rs-standings-table [ranks]="multipleStanding" [league]="leagueData" />
      } } @else {
      <rs-standings-table [ranks]="groups[0]" [league]="leagueData" />

      @if (showHomeAndAwayStandings()) {
      <rs-standings-table
        [ranks]="groups[1]"
        [league]="leagueData"
        header="Heimtabelle"
      />

      <rs-standings-table
        [ranks]="groups[2]"
        [league]="leagueData"
        header="Auswärtstabelle"
      />
      } } } @else if (isLoading()) {
      <p class="no-data">Tabellen werden geladen ...</p>
      }
    </div>
  `,
})
export class MatchFixtureStandingsComponent {
  readonly standings = input.required<StandingsDTO | null>();
  readonly isLoading = input.required<boolean>();

  readonly league = computed<StandingsLeague | null>(
    () => this.standings()?.league ?? null
  );
  readonly standingGroups = computed<StandingRanks[][]>(
    () => this.league()?.standings ?? []
  );

  readonly hasMultipleGroups = computed<boolean>(() => {
    const standings = this.standings();

    return standings ? hasMultipleGroups(standings) : false;
  });

  readonly showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.standings();

    return standings ? showHomeAndAwayStandings(standings) : false;
  });
}
