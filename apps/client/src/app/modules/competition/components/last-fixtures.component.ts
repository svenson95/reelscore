import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { CompetitionRoundPipe } from '@app/pipes';
import { LeagueService } from '@app/services';
import { LastFixturesStore } from '../store';
import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'reelscore-competition-last-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FixturesListComponent, CompetitionRoundPipe],
  template: `
    @if (store.fixtures() !== null) {
    <reelscore-competition-fixtures-list
      [fixtures]="store.fixtures()!"
      [competition]="competition()!.id"
      [isLoading]="store.isLoading()"
    />
    } @else if (store.isLoading()) { Spiele werden geladen ... }
  `,
})
export class LastFixturesComponent {
  store = inject(LastFixturesStore);
  leagueService = inject(LeagueService);
  competition = this.leagueService.selectedLeague;

  leagueEffect = effect(
    async () => {
      const competition = this.competition();
      if (!competition) return;
      await this.store.loadLastFixtures(competition.id);
    },
    { allowSignalWrites: true }
  );
}
