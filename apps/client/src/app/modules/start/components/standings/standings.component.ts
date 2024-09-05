import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { FilterService } from '@app/services';
import { StandingsStore } from '../../../../store';
import { StandingStore } from '../../store';
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
    @if (standings.standings()) { @if (standings.isLoading() &&
    standings.standings()?.length === 0) {
    <p class="no-data">Tabellen werden geladen ...</p>
    } @else if (standings.error()) {
    <p class="no-data">Fehler beim Laden der Tabellen.</p>
    } @else if (standings.standings()?.length === 0) {
    <p class="no-data">Keine Tabellen gefunden.</p>
    } @else if (isFiltering() && !!standing.standing()) {
    <reelscore-standings-table [data]="standing.standing()!" />
    } @else { @for (standings of standings.standings(); track
    standings.league.id) {
    <reelscore-standings-table [data]="standings" />
    } } }
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
