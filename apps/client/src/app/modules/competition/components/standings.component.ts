import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { StandingsTableComponent } from '@app/components';
import { CompetitionRoundPipe } from '@app/pipes';
import { LeagueService } from '@app/services';
import { CompetitionStandingsStore } from '../store/standings.store';
import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'reelscore-competition-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FixturesListComponent,
    CompetitionRoundPipe,
    StandingsTableComponent,
  ],
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
    } } @else if (store.isLoading()) { Tabelle wird geladen ... }
  `,
})
export class CompetitionStandingsComponent {
  store = inject(CompetitionStandingsStore);
  standings = this.store.standings;

  leagueService = inject(LeagueService);
  competition = this.leagueService.selectedLeague;

  leagueEffect = effect(
    async () => {
      const competition = this.competition();
      if (!competition) return;
      await this.store.loadStandings(competition.id);
    },
    { allowSignalWrites: true }
  );
}
