import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LeagueService } from '@app/services';
import { NextFixturesStore } from '../store';
import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'reelscore-competition-next-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixturesListComponent],
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
}
