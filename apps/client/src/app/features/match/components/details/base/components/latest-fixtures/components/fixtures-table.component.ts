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
  ExtendedFixtureDTO,
  FixturePerformance,
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
      @apply flex flex-col p-2 gap-1;
    }
    a + a { @apply border-t; }
    a:last-of-type { @apply rounded-b-border2; }
    .match-row {
      @apply grid items-center gap-x-2;
      grid-template-columns: minmax(0, 1fr) 17px auto 17px minmax(0, 1fr);
    }
    .fixture-header { @apply flex items-start justify-between gap-2 text-rs-font-size-small text-rs-color-text-2; }
    .date { @apply shrink-0 whitespace-nowrap; }
    .team { @apply min-w-0 content-center leading-[13px]; }
    .home { @apply text-right; }
    .competition { @apply flex flex-wrap gap-x-2; }
    .result { @apply text-center whitespace-nowrap; }
    .evaluation-value { @apply w-[17px] h-[17px] rounded-[4px] flex items-center justify-center; font-size: 10px; }
    .evaluation-value.low { @apply bg-rs-color-red text-white; }
    .evaluation-value.middle { @apply bg-gray-200 text-black; }
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

    @for(match of fixtures(); track match.fixture.id) {
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

        <span
          class="evaluation-value"
          [class.low]="performanceClass(match, 'home') === 'low'"
          [class.middle]="performanceClass(match, 'home') === 'middle'"
          [class.high]="performanceClass(match, 'home') === 'high'"
          [class.unknown]="performanceClass(match, 'home') === 'unknown'"
          [attr.aria-label]="performanceLabel(match, 'home')"
          [title]="performanceLabel(match, 'home')"
          >{{ performanceSymbol(match, 'home') }}</span
        >

        <div class="result">
          <rs-result-label [fixture]="match" />
        </div>

        <span
          class="evaluation-value"
          [class.low]="performanceClass(match, 'away') === 'low'"
          [class.middle]="performanceClass(match, 'away') === 'middle'"
          [class.high]="performanceClass(match, 'away') === 'high'"
          [class.unknown]="performanceClass(match, 'away') === 'unknown'"
          [attr.aria-label]="performanceLabel(match, 'away')"
          [title]="performanceLabel(match, 'away')"
          >{{ performanceSymbol(match, 'away') }}</span
        >

        <div class="team">
          <span [class.is-related]="match.teams.away | isRelated : team()">
            {{ match.teams.away.name | teamName : 'short' }}
          </span>
        </div>
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

  protected readonly linkToMatch = linkToMatch;
  protected readonly teamLogo = computed(() => getTeamLogo(this.team().id, 48));
  protected readonly teamLogoSet = computed(() =>
    getTeamLogoSrcSet(this.team().id, 48)
  );

  private performanceAt(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): FixturePerformance | undefined {
    return fixture.evaluations?.[team]?.performance;
  }

  protected performanceClass(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): string {
    const performance = this.performanceAt(fixture, team);
    if (
      performance === 'HIGH' ||
      performance === 'MIDDLE' ||
      performance === 'LOW'
    ) {
      return performance.toLowerCase();
    }

    return 'unknown';
  }

  protected performanceSymbol(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): string {
    const symbols: Record<FixturePerformance, string> = {
      MATCH_NOT_STARTED: '?',
      MATCH_POSTPONED: '-',
      NO_STATISTICS_AVAILABLE: '-',
      LOW: 'S',
      MIDDLE: 'M',
      HIGH: 'G',
    };
    const performance = this.performanceAt(fixture, team);
    return performance ? symbols[performance] : '-';
  }

  protected performanceLabel(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): string {
    const teamName = fixture.teams[team].name;
    switch (this.performanceAt(fixture, team)) {
      case 'HIGH':
        return `${teamName}: Gut gespielt`;
      case 'MIDDLE':
        return `${teamName}: Mittelmäßig gespielt`;
      case 'LOW':
        return `${teamName}: Schlecht gespielt`;
      case 'MATCH_NOT_STARTED':
        return `${teamName}: Spiel noch nicht gestartet`;
      case 'MATCH_POSTPONED':
        return `${teamName}: Spiel verschoben`;
      default:
        return `${teamName}: Keine Bewertung verfügbar`;
    }
  }
}
