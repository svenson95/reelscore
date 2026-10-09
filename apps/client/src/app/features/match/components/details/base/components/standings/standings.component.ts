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
  getCompetitionLogo,
  getCompetitionLogoSrcSet,
  PageTitleComponent,
  ResponsiveImageComponent,
  showHomeAndAwayStandings,
  StandingsTableComponent,
  ThemeService,
} from '@app/shared';

@Component({
  selector: 'rs-match-fixture-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    ResponsiveImageComponent,
    StandingsTableComponent,
  ],
  styles: `
    :host {
      rs-standings-table, .standings-skeleton {
        @apply sm:min-w-[450px] sm:mx-auto shadow-rs3;
      }

      .standings-container {
        @apply flex flex-col px-3 py-rs1 gap-rs1;
      }

      .standings-skeleton {
        @apply w-[calc(100%-1.5rem)] min-w-[350px] sm:min-w-[400px] max-w-[450px] self-center p-rs1 bg-rs-button-bg shadow-rs3;
        border-radius: var(--mat-button-toggle-shape);
        box-sizing: border-box;
      }

      .skeleton-row {
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) repeat(4, 24px) 40px;
        align-items: center;
        column-gap: 0;
        min-height: 33px;

        &:not(:last-child) {
          border-bottom: 1px solid var(--rs-button-border-color);
        }
      }

      .skeleton-row.with-goal-difference {
        grid-template-columns: 40px minmax(0, 1fr) repeat(5, 24px) 40px;
      }

      @media (min-width: 1024px) {
        .skeleton-row {
          grid-template-columns: 40px minmax(0, 1fr) repeat(4, 40px) 36px;
        }
        .skeleton-row.with-goal-difference {
          grid-template-columns: 40px minmax(0, 1fr) repeat(5, 40px) 36px;
        }
      }

      .skeleton-row.header {
        min-height: 41px;
        @apply text-rs-font-size-body-2 font-medium;
      }

      .skeleton-row.header > span {
        display: flex;
        min-width: 0;
        justify-content: center;
        text-align: center;
      }

      .skeleton-row.header .table-title {
        display: block;
        text-align: left;
        padding-inline: var(--rs-box-spacing-1);
      }

      .competition-logo { width: 24px; height: 24px; justify-self: center; }
      .team-skeleton {
        @apply flex min-w-0 items-center gap-2;
        padding-inline: var(--rs-box-spacing-1);
      }
      .team-logo-skeleton { width: 14px; height: 14px; flex: 0 0 14px; border-radius: 50%; }
      .team-name-skeleton { width: 100%; max-width: 115px; }
      .value-skeleton { width: 14px; justify-self: center; }
      @media (max-width: 399px) {
        .skeleton-row { margin-inline: 0; }
      }
      .skeleton-row .rs-skeleton { height: 12px; }
      .skeleton-row .team-logo-skeleton { height: 14px; }
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
          <rs-responsive-image
            class="competition-logo"
            [source]="competitionLogo()"
            [sourceSet]="competitionLogoSet()"
            altText=""
            [width]="24"
            [height]="24"
          />
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
          @for (cell of skeletonColumns(); track cell) { @if (cell === 1) {
          <span class="team-skeleton">
            <span class="rs-skeleton team-logo-skeleton"></span>
            <span class="rs-skeleton team-name-skeleton"></span>
          </span>
          } @else {
          <span class="rs-skeleton value-skeleton"></span>
          } }
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
  readonly competitionId = input<StandingsLeague['id'] | null>(null);
  readonly error = input<unknown>(null);

  private readonly breakpoint = inject(BreakpointObserverService);
  private readonly themeService = inject(ThemeService);

  protected readonly isMobile = this.breakpoint.isMobile;

  protected readonly competitionLogo = computed<string>(() => {
    const competitionId = this.competitionId() ?? this.league()?.id;
    return competitionId
      ? getCompetitionLogo(
          competitionId,
          24,
          1,
          this.themeService.isSystemDark()
        )
      : '';
  });

  protected readonly competitionLogoSet = computed<string | undefined>(() => {
    const competitionId = this.competitionId() ?? this.league()?.id;
    return competitionId
      ? getCompetitionLogoSrcSet(
          competitionId,
          24,
          this.themeService.isSystemDark()
        )
      : undefined;
  });

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
