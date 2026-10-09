import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import type {
  EvaluationDTO,
  ExtendedFixtureDTO,
  FixturePerformance,
  FixtureResult,
  FixtureTeam,
} from '@reelscore-sdk/models';

import {
  CheckScorePipe,
  getTeamLogo,
  getTeamLogoSrcSet,
  linkToMatch,
  ResponsiveImageComponent,
  ResultLabelComponent,
  RoundLabelPipe,
  TeamIsRelatedPipe,
  TeamNamePipe,
} from '@app/shared';

const EXTERNAL_MODULES = [RouterModule, DatePipe, MatRippleModule];

@Component({
  selector: 'rs-match-fixtures-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...EXTERNAL_MODULES,
    TeamNamePipe,
    CheckScorePipe,
    TeamIsRelatedPipe,
    ResultLabelComponent,
    RoundLabelPipe,
    ResponsiveImageComponent,
  ],
  styles: `
    :host {
      @apply h-fit flex-1 p-rs1 bg-rs-button-bg shadow-rs3 rounded-border2 text-rs-font-size-body-3;
    }
    .team-header { @apply flex items-center gap-3 p-2 pb-4 mb-2 border-b font-semibold text-rs-font-size-body-1; }
    .team-header.away { @apply flex-row-reverse text-right; }
    a {
      @apply grid items-center p-2 gap-1;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    }
    a + a { @apply border-t; }
    a:last-of-type { @apply rounded-b-border2; }
    .match-row {
      display: contents;
    }
    .fixture-header { @apply col-span-3 flex items-start justify-between gap-2 text-rs-font-size-small text-rs-color-text-2; }
    .date { @apply shrink-0 whitespace-nowrap; }
    .team { @apply min-w-0 content-center leading-[13px]; }
    .home { @apply text-right; }
    .competition { @apply flex flex-wrap gap-x-2; }
    .result { @apply text-center whitespace-nowrap; }
    .evaluations {
      @apply relative flex items-center justify-center gap-1;
      grid-column: 2;
    }
    .evaluation-label { @apply text-rs-font-size-small text-rs-color-text-2 whitespace-nowrap; }
    .evaluation-label:first-child {
      @apply absolute;
      right: calc(100% + 6px);
    }
    .evaluation-label:last-child {
      @apply absolute;
      left: calc(100% + 6px);
    }
    .evaluation-value { @apply w-[17px] h-[17px] rounded-[4px] flex items-center justify-center; font-size: 10px; }
    .evaluation-value.loss,
    .evaluation-value.low { @apply bg-rs-color-red text-white; }
    .evaluation-value.draw,
    .evaluation-value.middle { @apply bg-gray-200 text-black; }
    .evaluation-value.win,
    .evaluation-value.high { @apply bg-rs-color-green text-white; }
    .evaluation-value.unknown { @apply bg-gray-500 text-white; }
    .is-related { @apply underline decoration-2 font-bold; }
    .is-winner .is-related { @apply decoration-rs-color-green; }
    .is-loser .is-related { @apply decoration-rs-color-red; }
    .no-data { @apply bg-rs-button-bg border shadow-rs3; }
  `,
  template: `
    <div class="team-header" [class.away]="side() === 'away'">
      <rs-responsive-image
        [source]="teamLogo()"
        [sourceSet]="teamLogoSet()"
        [altText]="team().name + ' logo'"
        [width]="32"
        [height]="32"
      />
      <span>{{ team().name | teamName }}</span>
    </div>

    @for(match of fixtures(); track match.fixture.id; let index = $index) {
    <a
      mat-ripple
      [routerLink]="linkToMatch(match)"
      [class.is-winner]="match.teams | checkScore : team() : 'WIN'"
      [class.is-loser]="match.teams | checkScore : team() : 'LOSS'"
    >
      <div class="fixture-header">
        <div class="competition">
          <span>{{ match.league.name }}</span>
          <span>{{
            match.league.round
              | roundLabel
                : { id: match.league.id, season: match.league.season }
          }}</span>
        </div>
        <div class="date">
          <span>{{ match.fixture.date | date : 'dd.MM' }}</span>
        </div>
      </div>

      <div class="match-row">
        <div class="team home">
          <span [class.is-related]="match.teams.home | isRelated : team()">
            {{ match.teams.home.name | teamName : 'short' }}
          </span>
        </div>

        <div class="result">
          <rs-result-label [fixture]="match" />
        </div>

        <div class="team">
          <span [class.is-related]="match.teams.away | isRelated : team()">
            {{ match.teams.away.name | teamName : 'short' }}
          </span>
        </div>
      </div>

      <div class="evaluations" aria-label="Ergebnis und Performance">
        <span class="evaluation-label">Ergebnis</span>
        <span
          class="evaluation-value"
          [class.win]="resultClass(index) === 'win'"
          [class.draw]="resultClass(index) === 'draw'"
          [class.loss]="resultClass(index) === 'loss'"
          [class.unknown]="resultClass(index) === 'unknown'"
          [attr.aria-label]="resultLabel(index)"
          [title]="resultLabel(index)"
        >
          {{ resultSymbol(index) }}
        </span>
        <span
          class="evaluation-value"
          [class.low]="performanceClass(index) === 'low'"
          [class.middle]="performanceClass(index) === 'middle'"
          [class.high]="performanceClass(index) === 'high'"
          [class.unknown]="performanceClass(index) === 'unknown'"
          [attr.aria-label]="performanceLabel(index)"
          [title]="performanceLabel(index)"
        >
          {{ performanceSymbol(index) }}
        </span>
        <span class="evaluation-label">Performance</span>
      </div>
    </a>
    } @empty {
    <p class="no-data">Keine Spiele gefunden</p>
    }
  `,
})
export class MatchFixturesTableComponent {
  readonly fixtures = input.required<ExtendedFixtureDTO[]>();
  readonly team = input.required<FixtureTeam>();
  readonly side = input.required<'home' | 'away'>();
  readonly evaluations = input.required<EvaluationDTO | null>();

  protected readonly linkToMatch = linkToMatch;
  protected readonly teamLogo = computed(() => getTeamLogo(this.team().id, 48));
  protected readonly teamLogoSet = computed(() =>
    getTeamLogoSrcSet(this.team().id, 48)
  );

  private resultAt(index: number): FixtureResult | undefined {
    const teamEvaluations = this.evaluations()?.teams[this.side()];
    if (!teamEvaluations) return undefined;

    return teamEvaluations.results[index];
  }

  protected resultClass(index: number): string {
    const result = this.resultAt(index);
    return result && result !== 'NO_RESULT_AVAILABLE'
      ? result.toLowerCase()
      : 'unknown';
  }

  protected resultSymbol(index: number): string {
    const result = this.resultAt(index);
    if (result === 'WIN') return 'S';
    if (result === 'DRAW') return 'U';
    if (result === 'LOSS') return 'N';
    return '-';
  }

  protected resultLabel(index: number): string {
    switch (this.resultAt(index)) {
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

  private performanceAt(index: number): FixturePerformance | undefined {
    const teamEvaluations = this.evaluations()?.teams[this.side()];
    if (!teamEvaluations) return undefined;

    return teamEvaluations.performances[index];
  }

  protected performanceClass(index: number): string {
    const performance = this.performanceAt(index);
    if (
      performance === 'HIGH' ||
      performance === 'MIDDLE' ||
      performance === 'LOW'
    ) {
      return performance.toLowerCase();
    }

    return 'unknown';
  }

  protected performanceSymbol(index: number): string {
    const symbols: Record<FixturePerformance, string> = {
      MATCH_NOT_STARTED: '?',
      MATCH_POSTPONED: '-',
      NO_STATISTICS_AVAILABLE: '-',
      LOW: 'S',
      MIDDLE: 'M',
      HIGH: 'G',
    };
    const performance = this.performanceAt(index);
    return performance ? symbols[performance] : '-';
  }

  protected performanceLabel(index: number): string {
    switch (this.performanceAt(index)) {
      case 'HIGH':
        return 'Performance: Gut gespielt';
      case 'MIDDLE':
        return 'Performance: Mittelmäßig gespielt';
      case 'LOW':
        return 'Performance: Schlecht gespielt';
      case 'MATCH_NOT_STARTED':
        return 'Performance: Spiel noch nicht gestartet';
      case 'MATCH_POSTPONED':
        return 'Performance: Spiel verschoben';
      default:
        return 'Performance: Keine Bewertung verfügbar';
    }
  }
}
