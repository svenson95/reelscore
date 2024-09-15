import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { isCompetitionWithMultipleGroups } from '@lib/shared';
import {
  FilterService,
  StandingsStore,
  StandingsTableComponent,
  TopFiveStandingsStore,
} from '../../../../shared';

@Component({
  selector: 'reelscore-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (isFiltering() && !!standings()) { @if
    (hasMultipleGroups(standings()!.league.id)) { @for (multipleStanding of
    standings()!.league.standings; track $index) {
    <reelscore-standings-table
      [ranks]="multipleStanding"
      [league]="standings()!.league"
    />
    } } @else {
    <reelscore-standings-table
      [ranks]="standings()!.league.standings![0]"
      [league]="standings()!.league"
    />
    @if (standings()!.league.standings!.length === 3) {
    <reelscore-standings-table
      [ranks]="standings()!.league.standings![1]"
      [league]="standings()!.league"
      header="Heimtabelle"
    />
    <reelscore-standings-table
      [ranks]="standings()!.league.standings![2]"
      [league]="standings()!.league"
      header="Auswärtstabelle"
    />
    } } } @else if (topFiveStandings()) { @for (standings of topFiveStandings();
    track standings.league.id) {
    <reelscore-standings-table
      [ranks]="standings.league.standings![0]"
      [league]="standings.league"
    />
    } } @else {
    <p class="no-data">
      @if (topFiveStandingsStore.isLoading()) { Tabellen werden geladen ... }
      @else { @if (topFiveStandingsStore.error()) { Fehler beim Laden der
      Tabellen. } @else if (topFiveStandings()?.length === 0) { Keine Tabellen
      gefunden. } @else { Keine Tabelle für diesen Wettbewerb gefunden. } }
    </p>
    }
  `,
})
export class StandingsComponent {
  standingStore = inject(StandingsStore);
  standings = this.standingStore.standings;

  topFiveStandingsStore = inject(TopFiveStandingsStore);
  topFiveStandings = this.topFiveStandingsStore.topFiveStandings;

  filterService = inject(FilterService);
  isFiltering = computed<boolean>(
    () => this.filterService.selectedCompetition() !== null
  );

  hasMultipleGroups = isCompetitionWithMultipleGroups;
}
