import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { CompetitionRoundPipe } from '@app/pipes';
import { LeagueService } from '@app/services';
import { NextFixturesStore } from '../store';
import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'reelscore-competition-next-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FixturesListComponent, CompetitionRoundPipe],
  styles: `
    :host { @apply flex flex-col gap-5; }
    section:first-of-type { @apply flex justify-between; }
    p { @apply text-fb-font-size-body-2; }
  `,
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
export class NextFixturesComponent {
  store = inject(NextFixturesStore);
  leagueService = inject(LeagueService);
  competition = this.leagueService.selectedLeague;

  leagueEffect = effect(
    async () => {
      const competition = this.competition();
      if (!competition) return;
      await this.store.loadNextFixtures(competition.id);
    },
    { allowSignalWrites: true }
  );
}
