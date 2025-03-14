import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { StandingsDTO } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

import {
  FilterService,
  StandingsStore,
  StandingsTableComponent,
} from '../../../../../../shared';

@Component({
  selector: 'reelscore-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (isLoading()) {
    <p class="no-data">Tabellen werden geladen ...</p>
    } @else if (isFiltering() && dayStandings() !== null && dayStandings() !==
    undefined) { @if (hasMultipleGroups(dayStandings()!.league.id)) { @for
    (multipleStanding of dayStandings()!.league.standings; track $index) {
    <reelscore-standings-table
      [ranks]="multipleStanding"
      [league]="dayStandings()!.league"
    />
    } } @else {
    <reelscore-standings-table
      [ranks]="dayStandings()!.league.standings![0]"
      [league]="dayStandings()!.league"
    />

    @if (dayStandings()!.league.standings!.length === 3) {
    <reelscore-standings-table
      [ranks]="dayStandings()!.league.standings![1]"
      [league]="dayStandings()!.league"
      header="Heimtabelle"
    />
    <reelscore-standings-table
      [ranks]="dayStandings()!.league.standings![2]"
      [league]="dayStandings()!.league"
      header="Auswärtstabelle"
    />
    } } } @else if (weekStandings().length > 0) { @for (standings of
    weekStandings(); track standings.league.id) {
    <reelscore-standings-table
      [ranks]="standings.league.standings![0]"
      [league]="standings.league"
    />
    } } @else if (error()) {
    <p class="no-data">Fehler beim Laden der Tabellen.</p>
    } @else if (!isLoading()) {
    <p class="no-data">Keine Tabellen gefunden.</p>
    }
  `,
})
export class StandingsComponent {
  standingStore = inject(StandingsStore);
  weekStandings = input.required<StandingsDTO[]>();
  isLoading = input.required<boolean>();
  error = input.required<string | null>();

  standingsStore = inject(StandingsStore);
  dayStandings = this.standingsStore.standings;

  filterService = inject(FilterService);
  isFiltering = computed<boolean>(
    () => this.filterService.selectedCompetition() !== null
  );

  hasMultipleGroups = isCompetitionWithMultipleGroups;
}
