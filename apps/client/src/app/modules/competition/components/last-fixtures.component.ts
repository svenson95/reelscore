import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  FIRST_ROUNDS,
  isReversedSingleRoundCompetition,
  LeagueService,
} from '@app/shared';
import type { CompetitionId } from '@lib/models';
import { isCompetitionWithOneFixture } from '@lib/shared';

import { LastFixturesStore } from '../store';

import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'rs-competition-last-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, FixturesListComponent],
  styles: `
    :host { @apply rs-competition-tab flex-col gap-rs2 overflow-hidden; }
    button { @apply shadow-rs3; }
  `,
  template: `
    @let fixtureGroups = fixturesData(); @if (fixtureGroups !== null) { @if
    (fixtureGroups.length > 0) { @for (fixtureGroup of fixtureGroups; track
    $index) {
    <rs-competition-fixtures-list
      [fixtures]="fixtureGroup"
      [competition]="competitionId()"
      [isLoading]="isLoading()"
    />
    } } @else {
    <p class="no-data">Keine vergangenen Spiele</p>
    } @if (showLoadAllButton()) {
    <button mat-flat-button (click)="loadAllLastFixtures(competitionId())">
      Alle anzeigen
    </button>
    } } @else if (isLoading()) {
    <p class="no-data">Spiele werden geladen ...</p>
    }
  `,
})
export class LastFixturesComponent {
  private readonly store = inject(LastFixturesStore);
  private readonly leagueService = inject(LeagueService);

  readonly fixturesData = this.store.fixtures;

  readonly isLoading = this.store.isLoading;
  private readonly showAll = this.store.showAll;

  readonly competition = this.leagueService.selectedLeague;

  readonly competitionId = computed<CompetitionId>(
    () => this.competition()?.id ?? -1
  );

  readonly isFirstRound = computed<boolean>(() => {
    const fixtures = this.fixturesData();

    if (!fixtures || fixtures.length === 0 || fixtures[0].length === 0) {
      return false;
    }

    const round = fixtures[0][0].league.round;

    return FIRST_ROUNDS.includes(round);
  });

  readonly isCompetitionWithOneFixture = computed<boolean>(() => {
    const id = this.competition()?.id;

    return id ? isCompetitionWithOneFixture(id) : false;
  });

  readonly showLoadAllButton = computed<boolean>(() => {
    const competitionId = this.competition()?.id;

    return (
      !this.isFirstRound() &&
      !this.isCompetitionWithOneFixture() &&
      !isReversedSingleRoundCompetition(competitionId) &&
      !this.showAll()
    );
  });

  loadAllLastFixtures(id: CompetitionId): void {
    this.store.loadLastFixtures(id, true);
  }
}
