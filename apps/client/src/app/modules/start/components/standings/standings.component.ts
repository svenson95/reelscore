import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LeagueService, RouteService } from '@app/services';
import { StandingsService } from '../../services';
import { TableComponent } from './components';

@Component({
  selector: 'reelscore-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, TableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (isLoading()) {
    <mat-spinner class="my-10 mx-auto" diameter="20" />
    } @else if (topFiveStandings() === null) {
    <p class="no-data">Keine Tabellen gefunden.</p>
    } @else { @for (standings of topFiveStandings(); track standings.league.id)
    {
    <reelscore-standings-table [data]="standings" />
    } }
  `,
})
export class StandingsComponent {
  ls = inject(LeagueService);
  ss = inject(StandingsService);
  rs = inject(RouteService);

  topFiveStandings = this.ss.topFiveStandings;

  isLoading = computed<boolean>(() => this.topFiveStandings() === null);
}
