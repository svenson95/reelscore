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
    @if (fixtures() !== null) { @if (fixtures()!.length > 1) { @for
    (multipleFixtures of fixtures()!; track $index) {
    <reelscore-competition-fixtures-list
      [fixtures]="multipleFixtures"
      [competition]="competition()!.id"
      [isLoading]="isLoading()"
    />
    } } @else if (fixtures()!.length === 1) {
    <reelscore-competition-fixtures-list
      [fixtures]="fixtures()![0]"
      [competition]="competition()!.id"
      [isLoading]="isLoading()"
    />
    } @else if (fixtures()!.length === 0) {
    <p class="no-data">Keine anstehenden Spiele</p>
    } } @else if (isLoading()) {
    <p class="no-data">Spiele werden geladen ...</p>
    }
  `,
})
export class NextFixturesComponent {
  store = inject(NextFixturesStore);
  fixtures = this.store.fixtures;
  isLoading = this.store.isLoading;

  leagueService = inject(LeagueService);
  competition = this.leagueService.selectedLeague;
}
