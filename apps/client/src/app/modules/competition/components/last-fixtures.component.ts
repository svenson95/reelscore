import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LeagueService } from '@app/services';
import { LastFixturesStore } from '../store';
import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'reelscore-competition-last-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixturesListComponent],
  template: `
    @if (fixtures() !== null) {
    <reelscore-competition-fixtures-list
      [fixtures]="fixtures()!"
      [competition]="competition()!.id"
      [isLoading]="isLoading()"
    />
    } @else if (isLoading()) {
    <p class="no-data">Spiele werden geladen ...</p>
    }
  `,
})
export class LastFixturesComponent {
  store = inject(LastFixturesStore);
  fixtures = this.store.fixtures;
  isLoading = this.store.isLoading;

  leagueService = inject(LeagueService);
  competition = this.leagueService.selectedLeague;
}
