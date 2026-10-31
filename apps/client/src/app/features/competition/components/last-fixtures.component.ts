import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { COMPETITION_ROUNDS } from '@reelscore-sdk/constants';
import { isCompetitionWithOneFixture } from '@reelscore-sdk/helpers';
import type { CompetitionId } from '@reelscore-sdk/models';

import {
  LeagueService,
  PageTitleComponent,
  ReplayAnimationOnNavigationDirective,
} from '@app/shared';

import { LastFixturesStore } from '../state';

import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'rs-competition-last-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    PageTitleComponent,
    FixturesListComponent,
    ReplayAnimationOnNavigationDirective,
  ],
  styles: `
    :host { @apply flex flex-col gap-rs1 pb-rs1 overflow-visible; }
    .list-container { @apply flex flex-wrap gap-rs2 px-3 items-start justify-center; }
    button { @apply mx-3 shadow-rs; }
  `,
  template: `
    <rs-page-title title="Ergebnisse"></rs-page-title>

    @let fixtureGroups = fixturesData(); @if (fixtureGroups !== null) { @if
    (fixtureGroups.length > 0) {
    <div class="list-container animate-fade-in" rsReplayAnimationOnNavigation>
      @for (fixtureGroup of fixtureGroups; track $index) {
      <rs-competition-fixtures-list
        [fixtures]="fixtureGroup"
        [competition]="competitionId()"
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
    } @else if (error()) {
    <p class="no-data">Ergebnisse konnten nicht geladen werden.</p>
    }
  `,
})
export class LastFixturesComponent {
  private readonly store = inject(LastFixturesStore);
  private readonly leagueService = inject(LeagueService);

  readonly fixturesData = this.store.fixtures;

  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  private readonly showAll = this.store.showAll;

  readonly competition = this.leagueService.selectedLeague;

  readonly competitionId = computed<CompetitionId>(
    () => this.competition()?.id ?? -1
  );

  readonly hasMoreThanThreeRounds = computed<boolean>(() => {
    const firstFixture = this.fixturesData()?.[0]?.[0];
    if (!firstFixture) return false;

    const competitionRounds =
      COMPETITION_ROUNDS[firstFixture.league.season]?.[firstFixture.league.id];
    if (!competitionRounds) return false;

    const roundIdentifiers = [
      ...new Set(
        Object.values(competitionRounds).map((round) =>
          this.getRoundIdentifier(round)
        )
      ),
    ];

    return (
      roundIdentifiers.indexOf(
        this.getRoundIdentifier(firstFixture.league.round)
      ) > 2
    );
  });

  readonly isLastFixturesEmpty = computed<boolean>(() => {
    return this.fixturesData()?.length === 0;
  });

  readonly showLoadAllButton = computed<boolean>(() => {
    const competitionId = this.competition()?.id ?? -1;

    return (
      this.hasMoreThanThreeRounds() &&
      !isCompetitionWithOneFixture(competitionId) &&
      !this.isLastFixturesEmpty() &&
      !this.isReversedSingleRoundCompetition(competitionId) &&
      !this.showAll()
    );
  });

  loadAllLastFixtures(id: CompetitionId): void {
    this.store.loadLastFixtures(id, true);
  }

  private isReversedSingleRoundCompetition(
    competitionId: CompetitionId | string | null | undefined
  ): boolean {
    const COMPETITION_WITH_REVERSED_SINGLE_ROUND: CompetitionId = 10;
    return Number(competitionId) === COMPETITION_WITH_REVERSED_SINGLE_ROUND;
  }

  private getRoundIdentifier(round: string): string {
    let suffixStart = round.length;

    while (suffixStart > 0) {
      const characterCode = round.codePointAt(suffixStart - 1);
      const isDigit =
        characterCode !== undefined &&
        characterCode >= 48 &&
        characterCode <= 57;

      if (!isDigit) break;
      suffixStart -= 1;
    }

    return suffixStart === round.length ? round : round.slice(suffixStart);
  }
}
