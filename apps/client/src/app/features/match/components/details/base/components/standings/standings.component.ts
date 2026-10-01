import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { isCompetitionWithMultipleGroups } from '@reelscore-sdk/helpers';
import type {
  StandingRanks,
  StandingsDTO,
  StandingsLeague,
} from '@reelscore-sdk/models';

import {
  BreakpointObserverService,
  PageTitleComponent,
  showHomeAndAwayStandings,
  StandingsTableComponent,
} from '@app/shared';

@Component({
  selector: 'rs-match-fixture-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, StandingsTableComponent],
  styles: `
    :host {
      rs-standings-table, .standings-skeleton {
        @apply sm:min-w-[450px] sm:mx-auto shadow-rs3;
      }

      .standings-container {
        @apply flex flex-col px-3 py-rs1 gap-rs1;
      }
      .standings-skeleton {
        @apply w-[calc(100%-1.5rem)] max-w-[450px] self-center p-rs1 bg-rs-button-bg;
        border-radius: var(--mat-button-toggle-shape);
      }
      .skeleton-row {
        display: grid;
        grid-template-columns: 30px minmax(50px, 1fr) repeat(5, minmax(16px, 25px));
        align-items: center;
        gap: 10px;
        min-height: 33px;
        margin-inline: 5px;

        &:not(:last-child) {
          border-bottom: 1px solid var(--rs-button-border-color);
        }
      }
      .skeleton-row.with-goal-difference {
        grid-template-columns: 30px minmax(50px, 1fr) repeat(6, minmax(16px, 25px));
      }
      .skeleton-row.header {
        min-height: 41px;
        @apply text-rs-font-size-body-2 font-medium;
      }
      .skeleton-row.header > span { text-align: center; }
      .skeleton-row.header .table-title { text-align: left; }
      @media (max-width: 399px) {
        .skeleton-row { gap: 4px; margin-inline: 0; }
      }
      .skeleton-row .rs-skeleton { height: 12px; }
    }
  `,
  template: `
    <rs-page-title title="Tabellen" />

    <div class="standings-container" [attr.aria-busy]="isLoading()">
      @let leagueData = league(); @let groups = standingGroups(); @if
      (isLoading()) { @for (rows of skeletonRows(); track $index; let tableIndex
      = $index) {
      <div class="standings-skeleton">
        <div
          class="skeleton-row header"
          [class.with-goal-difference]="!isMobile()"
        >
          <span aria-label="Platz">#</span>
          <span class="table-title">{{
            tableIndex === 1
              ? 'Heimtabelle'
              : tableIndex === 2
              ? 'Auswärtstabelle'
              : leagueData?.name ?? competitionName() ?? 'Tabelle'
          }}</span>
          <span>Sp</span><span>S</span><span>U</span><span>N</span> @if
          (!isMobile()) { <span>TD</span> }
          <span>Pkt</span>
        </div>
        @for (row of rows; track $index) {
        <div
          class="skeleton-row"
          [class.with-goal-difference]="!isMobile()"
          aria-hidden="true"
        >
          @for (cell of skeletonColumns(); track cell) {
          <span class="rs-skeleton"></span> }
        </div>
        }
      </div>
      } } @else if (leagueData && groups.length) { @if (hasMultipleGroups()) {
      @for (multipleStanding of groups; track $index) {
      <rs-standings-table [ranks]="multipleStanding" [league]="leagueData" />
      } } @else {
      <rs-standings-table [ranks]="groups[0]" [league]="leagueData" />

      @if (showHomeAndAwayStandings()) {
      <rs-standings-table
        [ranks]="groups[1]"
        [league]="leagueData"
        header="Heimtabelle"
      />

      <rs-standings-table
        [ranks]="groups[2]"
        [league]="leagueData"
        header="Auswärtstabelle"
      />
      } } } @else if (error()) {
      <p class="no-data" role="status">Fehler beim Laden der Tabellen</p>
      } @else {
      <p class="no-data">Keine Tabellen verfügbar</p>
      }
    </div>
  `,
})
export class MatchFixtureStandingsComponent {
  readonly standings = input.required<StandingsDTO | null>();
  readonly isLoading = input.required<boolean>();

  readonly groupCompetition = input<boolean>(false);
  readonly competitionName = input<string | null>(null);
  readonly error = input<unknown>(null);

  private readonly breakpoint: BreakpointObserverService = inject(
    BreakpointObserverService
  );

  protected readonly isMobile = this.breakpoint.isMobile;

  protected readonly skeletonColumns = computed<number[]>(() =>
    this.isMobile() ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6, 7]
  );

  protected readonly skeletonRows = computed<number[][]>(() => {
    const groups: StandingRanks[][] = this.standingGroups();
    if (groups.length)
      return groups.map((ranks: StandingRanks[]): number[] =>
        ranks.map((_: StandingRanks, index: number): number => index)
      );
    const REGULAR_COMP_STANDINGS_FORMAT = [[0, 1], [0], [0]];
    const DIFFERENT_COMP_STANDINGS_FORMAT = [[0, 1, 2, 3]]; // nations league, champions league, ...
    return this.groupCompetition()
      ? DIFFERENT_COMP_STANDINGS_FORMAT
      : REGULAR_COMP_STANDINGS_FORMAT;
  });

  readonly league = computed<StandingsLeague | null>(
    () => this.standings()?.league ?? null
  );

  readonly standingGroups = computed<StandingRanks[][]>(
    () => this.league()?.standings ?? []
  );

  readonly hasMultipleGroups = computed<boolean>(() => {
    const standings = this.standings();

    return standings
      ? isCompetitionWithMultipleGroups(
          standings.league.id,
          standings.league.season
        )
      : false;
  });

  readonly showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.standings();

    return standings ? showHomeAndAwayStandings(standings) : false;
  });
}
