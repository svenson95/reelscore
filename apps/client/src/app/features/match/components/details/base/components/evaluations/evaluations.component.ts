import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import type {
  EvaluationDTO,
  ExtendedFixtureDTO,
  FixturePerformance,
  FixtureResult,
  LatestFixturesDTO,
} from '@reelscore-sdk/models';

import {
  getTeamLogo,
  getTeamLogoSrcSet,
  PageTitleComponent,
  ResponsiveImageComponent,
} from '@app/shared';

import { PerformanceInfoComponent } from './performance-info.component';

interface FormItem<T> {
  value: T | null;
  date: string | null;
}

interface TeamForm {
  id: number;
  side: 'home' | 'away';
  name: string;
  logo: string;
  logoSet: string;
  results: FormItem<FixtureResult>[];
  performances: FormItem<FixturePerformance>[];
}

@Component({
  selector: 'rs-match-evaluations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    ResponsiveImageComponent,
    PerformanceInfoComponent,
  ],
  styles: `
    :host {
      @apply flex flex-col;
    }

    .team-grid {
      @apply mt-rs1 grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 sm:gap-4;
    }

    .team-card {
      @apply flex min-w-0 flex-col gap-2 rounded-border2 bg-rs-button-bg p-4 shadow-rs3 sm:gap-5 sm:p-5;
    }

    .team-card:nth-child(1) {
      @apply max-sm:mr-6;
    }

    .team-card:nth-child(2) {
      @apply max-sm:ml-6;
    }

    .team-header-away {
      @apply flex-row-reverse justify-start text-right;
    }

    .team-header-away .team-name {
      @apply text-right;
    }

    .team-header {
      @apply flex min-w-0 items-center gap-3 border-b border-rs-button-border pb-4;
    }

    .team-logo {
      @apply h-6 w-6 shrink-0 object-contain;
    }

    .team-name {
      @apply min-w-0 break-words text-rs-font-size-body-1 font-semibold text-rs-color-text-1 sm:text-rs-font-size-body-2;
    }

    .form-section {
      @apply flex flex-col gap-3;
    }

    .form-section + .form-section {
      @apply border-t border-rs-button-border pt-4;
    }

    .section-heading {
      @apply flex items-center gap-2 text-rs-font-size-body-2 font-medium text-rs-color-text-1;
    }

    .timeline {
      @apply grid grid-cols-5 gap-1 xs:gap-2;
    }

    .team-card-away .form-section {
      @apply w-full;
    }

    .team-card-away .section-heading {
      @apply justify-end text-right;
    }

    .team-card-away .performance-heading {
      @apply flex-row-reverse justify-start;
    }

    .team-card-away .timeline {
      width: calc(100% - 1rem);
      margin-left: auto;
    }

    .timeline-item {
      @apply flex min-w-0 flex-col items-center gap-2;
    }

    .evaluation-item,
    .item-skeleton {
      @apply flex h-7 w-7 items-center justify-center rounded shadow-rs2 text-rs-font-size-body-2 font-semibold leading-none sm:h-8 sm:w-8;
    }

    .evaluation-item {
      &.loss,
      &.low {
        @apply bg-rs-color-red text-white;
      }

      &.draw,
      &.middle {
        @apply bg-gray-200 text-black;
      }

      &.win,
      &.high {
        @apply bg-rs-color-green text-white;
      }

      &.match-postponed,
      &.match-not-started,
      &.no-statistics-available,
      &.no-result-available {
        @apply bg-gray-500 text-white;
      }
    }

    .item-date {
      @apply whitespace-nowrap text-rs-font-size-small text-rs-color-text-2;
    }

    .no-data {
      @apply m-auto;
    }
  `,
  template: `
    <rs-page-title title="Aktuelle Form" />

    <div class="team-grid" [attr.aria-busy]="isLoading()">
      @if (!isLoading() && error() && !hasEvaluations()) {
      <p class="no-data" role="status">Fehler beim Laden der aktuellen Form</p>
      } @else if (!isLoading() && !hasEvaluations()) {
      <p class="no-data">Keine Formdaten verfügbar</p>
      } @else { @for (team of teams(); track team.id) {
      <article
        class="team-card"
        [class.team-card-away]="team.side === 'away'"
        [attr.aria-label]="team.name"
      >
        <header
          class="team-header"
          [class.team-header-away]="team.side === 'away'"
        >
          @if (!isLoading() && team.logo) {
          <rs-responsive-image
            class="team-logo"
            [source]="team.logo"
            [sourceSet]="team.logoSet"
            altText=""
            [width]="24"
            [height]="24"
          />
          } @else {
          <span class="rs-skeleton team-logo" aria-hidden="true"></span>
          }
          <span class="team-name">{{ team.name }}</span>
        </header>

        <section class="form-section" aria-label="Ergebnisse">
          <h3 class="section-heading">Ergebnisse</h3>
          <div class="timeline">
            @for (item of team.results; track $index) {
            <div class="timeline-item">
              @if (isLoading()) {
              <span class="rs-skeleton item-skeleton" aria-hidden="true"></span>
              } @else {
              <span
                [class]="evaluationClasses(item.value)"
                [attr.aria-label]="resultDescription(item.value)"
                >{{ resultLabel(item.value) }}</span
              >
              }
              <time class="item-date">{{ item.date ?? '—' }}</time>
            </div>
            }
          </div>
        </section>

        <section class="form-section" aria-label="Performance">
          <h3 class="section-heading performance-heading">
            Performance
            <rs-performance-info
              [side]="team.side"
              [menuId]="'performance-info-' + team.id"
              [isOpen]="activeInfoTeam() === team.id"
              (openChange)="setPerformanceInfo(team.id, $event)"
            />
          </h3>
          <div class="timeline">
            @for (item of team.performances; track $index) {
            <div class="timeline-item">
              @if (isLoading()) {
              <span class="rs-skeleton item-skeleton" aria-hidden="true"></span>
              } @else {
              <span
                [class]="evaluationClasses(item.value)"
                [attr.aria-label]="performanceDescription(item.value)"
                >{{ performanceLabel(item.value) }}</span
              >
              }
              <time class="item-date">{{ item.date ?? '—' }}</time>
            </div>
            }
          </div>
        </section>
      </article>
      } }
    </div>
  `,
})
export class MatchEvaluationsComponent {
  readonly evaluations = input.required<EvaluationDTO | null>();
  readonly fixture = input<ExtendedFixtureDTO | null>(null);
  readonly latestFixtures = input<LatestFixturesDTO | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly error = input<unknown>(null);
  protected readonly activeInfoTeam = signal<number | null>(null);

  readonly hasEvaluations = computed<boolean>(() => {
    const teams = this.evaluations()?.teams;
    return (
      !!teams &&
      [
        teams.home.results,
        teams.away.results,
        teams.home.performances,
        teams.away.performances,
      ].some((values) => values.length > 0)
    );
  });

  protected readonly teams = computed<TeamForm[]>(() => {
    const fixture = this.fixture();
    const evaluations = this.evaluations()?.teams;
    const latestFixtures = this.latestFixtures();

    if (!fixture) {
      return [
        {
          id: -1,
          side: 'home',
          name: 'Heimteam',
          logo: '',
          logoSet: '',
          results: this.emptyTimeline<FixtureResult>(),
          performances: this.emptyTimeline<FixturePerformance>(),
        },
        {
          id: -2,
          side: 'away',
          name: 'Auswärtsteam',
          logo: '',
          logoSet: '',
          results: this.emptyTimeline<FixtureResult>(),
          performances: this.emptyTimeline<FixturePerformance>(),
        },
      ];
    }

    return (['home', 'away'] as const).map((side) => {
      const team = fixture.teams[side];
      const history = latestFixtures?.[side] ?? [];
      const results = evaluations?.[side].results ?? [];
      const performances = evaluations?.[side].performances ?? [];

      return {
        id: team.id,
        side,
        name: team.name,
        logo: getTeamLogo(team.id, 48),
        logoSet: getTeamLogoSrcSet(team.id, 48),
        results: this.createTimeline(results, history),
        performances: this.createTimeline(performances, history),
      };
    });
  });

  protected evaluationClasses(
    value: FixtureResult | FixturePerformance | null
  ): string {
    const classes = ['evaluation-item'];

    if (value) classes.push(value.toLowerCase().replaceAll('_', '-'));

    return classes.join(' ');
  }

  protected resultLabel(value: FixtureResult | null): string {
    switch (value) {
      case 'WIN':
        return 'S';
      case 'DRAW':
        return 'U';
      case 'LOSS':
        return 'N';
      default:
        return '—';
    }
  }

  protected performanceLabel(value: FixturePerformance | null): string {
    switch (value) {
      case 'HIGH':
        return 'G';
      case 'MIDDLE':
        return 'M';
      case 'LOW':
        return 'S';
      case 'MATCH_NOT_STARTED':
        return '?';
      default:
        return '—';
    }
  }

  protected resultDescription(value: FixtureResult | null): string {
    switch (value) {
      case 'WIN':
        return 'Sieg';
      case 'DRAW':
        return 'Unentschieden';
      case 'LOSS':
        return 'Niederlage';
      default:
        return 'Kein Ergebnis verfügbar';
    }
  }

  protected performanceDescription(value: FixturePerformance | null): string {
    switch (value) {
      case 'HIGH':
        return 'Gute Performance';
      case 'MIDDLE':
        return 'Mittlere Performance';
      case 'LOW':
        return 'Schlechte Performance';
      case 'MATCH_NOT_STARTED':
        return 'Spiel hat noch nicht begonnen';
      case 'MATCH_POSTPONED':
        return 'Spiel verschoben';
      default:
        return 'Keine Performance-Daten verfügbar';
    }
  }

  protected setPerformanceInfo(teamId: number, isOpen: boolean): void {
    this.activeInfoTeam.set(isOpen ? teamId : null);
  }

  private createTimeline<T>(
    values: T[],
    fixtures: ExtendedFixtureDTO[]
  ): FormItem<T>[] {
    const historyItems = Array.from({ length: 5 }, (_, index) => ({
      value: values[index] ?? null,
      date: this.formatDate(fixtures[index]?.fixture.timestamp),
    })).reverse();

    return historyItems;
  }

  private emptyTimeline<T>(): FormItem<T>[] {
    return Array.from({ length: 5 }, () => ({
      value: null,
      date: null,
    }));
  }

  private formatDate(timestamp?: number): string | null {
    if (timestamp === undefined) return null;

    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
    }).format(timestamp * 1000);
  }
}
