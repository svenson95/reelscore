import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StandingsTableComponent } from '@app/shared';
import { StandingsDTO } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

@Component({
  selector: 'rs-match-fixture-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host ::ng-deep rs-standings-table {
      @apply sm:min-w-[500px] sm:mx-auto;
    }
    section { @apply flex flex-col px-2 py-5 md:p-5 gap-5; }
  `,
  template: `
    <h3 class="match-section-title">TABELLEN</h3>
    <section>
      @if (standings() !== null) { @if
      (hasMultipleGroups(standings()!.league.id)) { @for (multipleStanding of
      standings()!.league.standings; track $index) {
      <rs-standings-table
        [ranks]="multipleStanding"
        [league]="standings()!.league"
      />
      } } @else {
      <rs-standings-table
        [ranks]="standings()!.league.standings![0]"
        [league]="standings()!.league"
      />
      @if (standings()!.league.standings!.length === 3) {
      <rs-standings-table
        [ranks]="standings()!.league.standings![1]"
        [league]="standings()!.league"
        header="Heimtabelle"
      />
      <rs-standings-table
        [ranks]="standings()!.league.standings![2]"
        [league]="standings()!.league"
        header="Auswärtstabelle"
      />
      } } } @else {
      <p class="no-data">Tabellen werden geladen ...</p>
      }
    </section>
  `,
})
export class MatchFixtureStandingsComponent {
  standings = input.required<StandingsDTO | null>();

  hasMultipleGroups = isCompetitionWithMultipleGroups;
}
