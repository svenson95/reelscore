import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { LeagueService } from '@app/services';
import { FixtureDTO } from '@lib/models';
import { loadFixtures, selectFixtures } from '../../../../store';
import { CompetitionFixtures, FilteredCompetitions } from '../../models';
import { MatchDayListComponent } from './components';

@Component({
  selector: 'reelscore-match-day',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, NgIf, MatchDayListComponent],
  styles: `
    :host { @apply flex flex-col; }

    reelscore-match-day-list:not(:last-child) {
        @apply flex flex-col mb-5;
    }
  `,
  template: `
    <ng-container *ngIf="data$ | async as data">
      @if (data.isLoading && data.fixtures.length === 0) {
      <p class="no-data">Spiele werden geladen ...</p>
      } @else if (data.error) {
      <p class="no-data">Fehler beim Laden der Spiele.</p>
      } @else if (data.fixtures.length === 0) {
      <p class="no-data">Es finden keine Spiele statt.</p>
      } @else { @for (competition of competitions(); track competition.name) {
      <reelscore-match-day-list [competition]="competition" />
      } }
    </ng-container>
  `,
})
export class MatchDayComponent implements OnInit {
  ls = inject(LeagueService);
  store = inject(Store);
  data$ = this.store.select(selectFixtures);
  data = toSignal(this.data$);

  ngOnInit(): void {
    this.store.dispatch(loadFixtures());
  }

  competitions = computed<CompetitionFixtures[] | undefined>(() => {
    const data = this.data()?.fixtures;
    const selectedLeague = this.ls.selectedLeague();
    if (data === undefined) return undefined;

    const competitions = [...new Set(data.map((f) => f.league.name))];
    const fixtures = competitions.map((c) => this.filterByCompetition(c, data));

    const filtered = new FilteredCompetitions(fixtures).byLeague(
      selectedLeague?.label
    );
    return filtered.competitions;
  });

  filterByCompetition = (name: string, data: FixtureDTO[]) => ({
    name,
    image: data.find((f) => f.league.name === name)?.league.flag || 'error',
    fixtures: data.filter((f) => f.league.name === name),
  });
}
