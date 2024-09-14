import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StandingsTableComponent } from '@app/components';
import { isCompetitionWithMultipleGroups } from '@lib/shared';
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
    } } } @else if (store.isLoading()) {
    <p class="no-data">Tabelle wird geladen ...</p>
    }
  `,
})
export class CompetitionStandingsComponent {
  store = inject(CompetitionStandingsStore);
  standings = this.store.standings;

  hasMultipleGroups = isCompetitionWithMultipleGroups;
}
