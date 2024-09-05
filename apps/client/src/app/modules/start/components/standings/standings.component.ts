import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { FilterService } from '@app/services';
import { StandingsStore, StandingStore } from '../../../../store';
import { TableComponent } from './components';

@Component({
  selector: 'reelscore-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (isFiltering() && !!standing.standing()) {
    <reelscore-standings-table [data]="standing.standing()!" />
    } @else if (standings.standings()) { @for (standings of
    standings.standings(); track standings.league.id) {
    <reelscore-standings-table [data]="standings" />
    } } @else {
    <p class="no-data">
      @if (standings.isLoading()) { Tabellen werden geladen ... } @else { @if
      (standings.error()) { Fehler beim Laden der Tabellen. } @else if
      (standings.standings()?.length === 0) { Keine Tabellen gefunden. } @else {
      Keine Tabelle für diesen Wettbewerb gefunden. } }
    </p>
    }
  `,
})
export class StandingsComponent {
  standingStore = inject(StandingStore);
  standingsStore = inject(StandingsStore);
  standing = this.standingStore;
  standings = this.standingsStore;

  filterService = inject(FilterService);
  isFiltering = computed<boolean>(
    () => this.filterService.selectedCompetition() !== null
  );
}
