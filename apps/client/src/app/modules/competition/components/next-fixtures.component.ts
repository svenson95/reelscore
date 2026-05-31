import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { LeagueService } from '@app/shared';
import type { CompetitionId } from '@lib/models';

import { NextFixturesStore } from '../store';

import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'rs-competition-next-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixturesListComponent],
  styles: `
    :host { @apply rs-competition-tab flex-col; }
  `,
  template: `
    @let fixtureGroups = fixtures(); @if (fixtureGroups !== null) { @if
    (fixtureGroups.length > 0) { @for (fixtureGroup of fixtureGroups; track
    $index) {
    <rs-competition-fixtures-list
      [fixtures]="fixtureGroup"
      [competition]="competitionId()"
      [isLoading]="isLoading()"
    />
    } } @else {
    <p class="no-data">Keine anstehenden Spiele</p>
    } } @else if (isLoading()) {
    <p class="no-data">Spiele werden geladen ...</p>
    }
  `,
})
export class NextFixturesComponent {
  private readonly store = inject(NextFixturesStore);
  private readonly leagueService = inject(LeagueService);

  readonly fixtures = this.store.fixtures;
  readonly isLoading = this.store.isLoading;

  private readonly competition = this.leagueService.selectedLeague;

  readonly competitionId = computed<CompetitionId>(
    () => this.competition()?.id ?? -1
  );
}
