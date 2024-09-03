import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { loadStandings, selectStandings } from '../../../../store';
import { FilterService } from '../../services';
import { StandingStore } from '../../store';
import { TableComponent } from './components';

@Component({
  selector: 'reelscore-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    <ng-container *ngIf="data$ | async as data">
      @if (data.isLoading && data.standings.length === 0) {
      <p class="no-data">Tabellen werden geladen ...</p>
      } @else if (data.error) {
      <p class="no-data">Fehler beim Laden der Tabellen.</p>
      } @else if (data.standings.length === 0) {
      <p class="no-data">Keine Tabellen gefunden.</p>
      } @else if (isFiltering() && !!standing()) {
      <reelscore-standings-table [data]="standing()!" />
      } @else { @for (standings of data.standings; track standings.league.id) {
      <reelscore-standings-table [data]="standings" />
      } }
    </ng-container>
  `,
})
export class StandingsComponent implements OnInit {
  store = inject(Store);
  standingStore = inject(StandingStore);
  standing = this.standingStore.standing;

  fs = inject(FilterService);
  isFiltering = computed<boolean>(() => this.fs.selectedCompetition() !== null);

  ngOnInit(): void {
    this.store.dispatch(loadStandings());
  }

  data$ = this.store.select(selectStandings);
}
