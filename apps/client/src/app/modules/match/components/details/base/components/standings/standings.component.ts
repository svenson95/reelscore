import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  StandingsTableComponent,
  hasMultipleGroups,
  showHomeAndAwayStandings,
} from '@app/shared';
import type { StandingsDTO } from '@lib/models';

@Component({
  selector: 'rs-match-fixture-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host {
      rs-standings-table {
        @apply sm:min-w-[500px] sm:mx-auto shadow-rs2;
      }
      .standings-container { @apply flex flex-col px-3 py-3 gap-rs1; }
    }
  `,
  template: `
    <h2>Tabellen</h2>

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

  readonly league = computed(() => this.standings()?.league ?? null);
  readonly standingGroups = computed(() => this.league()?.standings ?? []);

  readonly hasMultipleGroups = computed<boolean>(() => {
    const standings = this.standings();
    if (standings === null) return false;

    return hasMultipleGroups(standings);
  });

  readonly showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.standings();
    if (standings === null) return false;

    return showHomeAndAwayStandings(standings);
  });
}
