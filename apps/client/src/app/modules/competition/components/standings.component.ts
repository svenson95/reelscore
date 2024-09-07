import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StandingsTableComponent } from '@app/components';
import { CompetitionStandingsStore } from '../store/standings.store';

@Component({
  selector: 'reelscore-competition-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (store.standings() !== null) { @if
    (standings()!.league.standings!.length > 0) { @for (multipleStanding of
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
    } } @else if (store.isLoading()) {
    <p class="no-data">Tabelle wird geladen ...</p>
    }
  `,
})
export class CompetitionStandingsComponent {
  store = inject(CompetitionStandingsStore);
  standings = this.store.standings;
}
