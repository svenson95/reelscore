import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  isFirstCompetitionRound,
  isReversedSingleRoundCompetition,
  LeagueService,
  PageTitleComponent,
} from '@app/shared';
import type { CompetitionId } from '@lib/models';
import { isCompetitionWithOneFixture } from '@lib/shared';

import { LastFixturesStore } from '../store';

import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'rs-competition-last-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, PageTitleComponent, FixturesListComponent],
  styles: `
    :host { @apply flex flex-col gap-rs1 overflow-hidden; }
    .list-container { @apply flex flex-wrap gap-rs2 px-3 items-start justify-center; }
    button { @apply shadow-rs3; }
  `,
  template: `
    <rs-page-title title="Ergebnisse"></rs-page-title>

    @let fixtureGroups = fixturesData(); @if (fixtureGroups !== null) { @if
    (fixtureGroups.length > 0) {
    <div class="list-container">
      @for (fixtureGroup of fixtureGroups; track $index) {
      <rs-competition-fixtures-list
        [fixtures]="fixtureGroup"
        [competition]="competitionId()"
        [isLoading]="isLoading()"
      />
      }
    </div>
    } @else {
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
    const firstFixture = this.fixturesData()?.[0]?.[0];
    if (!firstFixture) return false;

    return isFirstCompetitionRound(firstFixture.league.round, {
      id: firstFixture.league.id,
      season: firstFixture.league.season,
    });
  });

  readonly isLastFixturesEmpty = computed<boolean>(() => {
    return this.fixturesData()?.length === 0;
  });

  readonly showLoadAllButton = computed<boolean>(() => {
    const competitionId = this.competition()?.id ?? -1;

    return (
      !this.isFirstRound() &&
      !isCompetitionWithOneFixture(competitionId) &&
      !this.isLastFixturesEmpty() &&
      !isReversedSingleRoundCompetition(competitionId) &&
      !this.showAll()
    );
  });

  loadAllLastFixtures(id: CompetitionId): void {
    this.store.loadLastFixtures(id, true);
  }
}
