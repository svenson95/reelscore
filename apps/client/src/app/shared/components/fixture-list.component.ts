import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import { COMPETITION_ID, COMPETITION_URL } from '@lib/constants';
import {
  CompetitionId,
  CompetitionRound,
  CompetitionUrl,
  ExtendedFixtureDTO,
  StatusShort,
} from '@lib/models';

import { linkToMatch } from '../constants';
import { getTeamLogo } from '../models';
import { IsStatusPipe, TeamNamePipe } from '../pipes';

import { OptimizedImageComponent } from './optimized-image/optimized-image.component';
import { ResultLabelComponent } from './result-label.component';

@Component({
  selector: 'rs-fixture-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterModule,
    MatRippleModule,
    OptimizedImageComponent,
    TeamNamePipe,
    IsStatusPipe,
    ResultLabelComponent,
  ],
  styles: `
    ul { @apply w-full; }
    li { @apply bg-white; }
    li > a { @apply flex items-stretch; }
    li:not(:last-child) { @apply border-b-[1px]; }
    li > div { @apply inline-flex flex-col; }
    .time-label.is-finished { @apply line-through decoration-rs-color-orange; }
    .time { 
      @apply justify-center items-center min-w-[50px] text-rs-font-size-small; 

      &.is-upcoming { @apply bg-rs-color-white-2; }
      &.is-playing { @apply bg-rs-color-green-1 text-rs-color-text-3; }
    }
    .time, .result { 
      @apply flex text-center justify-center;
    }
    .result { 
      @apply min-w-[40px] p-2 items-center gap-[0.1rem]; 

      &:not(.is-upcoming) { @apply bg-rs-color-white-2; }
    }
    .teams { @apply w-full flex text-rs-font-size-body-2; }
    .teams > div:not(.result) { @apply flex flex-1 p-2 gap-2 items-center; }
    .teams > div:first-of-type { @apply justify-end text-end; }
    .team-name { line-height: 14px; text-wrap: balance; }
    .team-logo-placeholder { @apply w-[14px] h-[14px] bg-gray-200 rounded; }
  `,
  template: `
    <ul>
      @for(match of fixtures(); track match.fixture.id) {
      <li>
        <a matRipple [routerLink]="linkToMatch(match)">
          <div
            class="time"
            [class.is-upcoming]="match | isStatus : notStartedStates"
            [class.is-playing]="
              (match | isStatus : playingStates : finishedStates) ||
              (match | isStatus : halfTimeStates)
            "
          >
            <span
              class="time-label"
              [class.is-finished]="match | isStatus : finishedStates"
            >
              @if (match | isStatus : playingStates : finishedStates) {
              {{ match.fixture.status.elapsed }}' } @else if (match | isStatus :
              halfTimeStates) { HZ } @else {
              {{ match.fixture.date | date : 'HH:mm' }}
              }
            </span>
          </div>
          <div class="teams">
            <div>
              <span
                class="team-name"
                [class.line-through]="isTeamEliminated(match, 'home')"
              >
                {{ match.teams.home.name | teamName : 'short' }}
              </span>
              <div class="team-logo">
                @defer (on viewport) {
                <rs-optimized-image
                  [source]="getTeamLogo(match.teams.home.id)"
                  alternate="home logo"
                  width="14"
                  height="14"
                />
                } @placeholder {
                <div class="team-logo-placeholder"></div>
                }
              </div>
            </div>
            <div
              class="result"
              [class.is-upcoming]="match | isStatus : notStartedStates"
            >
              <rs-result-label
                [result]="match.goals"
                [status]="match.fixture.status.short"
                [isNotStarted]="match | isStatus : notStartedStates"
              />
            </div>
            <div>
              <div class="team-logo">
                @defer (on viewport) {
                <rs-optimized-image
                  [source]="getTeamLogo(match.teams.away.id)"
                  alternate="away logo"
                  width="14"
                  height="14"
                />
                } @placeholder {
                <div class="team-logo-placeholder"></div>
                }
              </div>
              <span
                class="team-name"
                [class.line-through]="isTeamEliminated(match, 'away')"
              >
                {{ match.teams.away.name | teamName : 'short' }}
              </span>
            </div>
          </div>
        </a>
      </li>
      }
    </ul>
  `,
})
export class FixtureListComponent {
  routerLinks: Record<CompetitionId, CompetitionUrl> = COMPETITION_URL;
  fixtures = input.required<ExtendedFixtureDTO[]>();

  // TODO refactor this to lib
  notStartedStates: StatusShort[] = ['TBD', 'NS'];
  halfTimeStates: StatusShort[] = ['HT'];
  playingStates: StatusShort[] = ['1H', '2H', 'ET', 'P', 'BT', 'SUSP', 'INT'];
  finishedStates: StatusShort[] = ['FT', 'AET', 'PEN'];
  twoLeggedCompetitions: { [key: CompetitionId]: CompetitionRound[] } = {
    [COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE]: [
      'Round of 16',
      'Quarter-finals',
      'Semi-finals',
    ],
    [COMPETITION_ID.EUROPA_UEFA_EURO_LEAGUE]: [
      'Round of 16',
      'Quarter-finals',
      'Semi-finals',
    ],
    [COMPETITION_ID.INTERNATIONAL_UEFA_NATIONS_LEAGUE]: [
      'Play-offs A/B',
      'Play-offs B/C',
      'Quarter-finals',
      'Play-offs C/D',
    ],
    [COMPETITION_ID.ENGLAND_LEAGUE_CUP]: ['Semi-finals'],
    [COMPETITION_ID.ITALY_COPPA_ITALIA]: ['Semi-finals'],
    [COMPETITION_ID.SPAIN_COPA_DEL_REY]: ['Semi-finals'],
  };

  getTeamLogo = getTeamLogo;
  linkToMatch = linkToMatch;

  isTeamEliminated(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away'
  ): boolean {
    const isFinished = this.finishedStates.includes(
      fixture.fixture.status.short
    );
    if (!isFinished) return false;
    const competitionTwoLeggedRounds =
      this.twoLeggedCompetitions[fixture.league.id];
    const isCompetitionWithTwoLeggedFinals =
      competitionTwoLeggedRounds !== undefined;

    const koPhaseRounds = [
      'Preliminary Round',
      'Play-offs',
      '1st Round',
      '2nd Round',
      '3rd Round',
      'Round of 16',
      'Quarter-finals',
      'Semi-finals',
      'Final',
    ];
    const isKoPhase = koPhaseRounds.some((r) => r === fixture.league.round);
    const isKoEliminated =
      !isCompetitionWithTwoLeggedFinals &&
      isKoPhase &&
      fixture.teams[team].winner === false;

    const isTwoLegged =
      isCompetitionWithTwoLeggedFinals &&
      competitionTwoLeggedRounds.includes(fixture.league.round);

    const isExtendedFixture = 'final' in fixture;
    const winnerTeamId = isExtendedFixture
      ? fixture?.final?.winnerOfFinal
      : null;
    const isFinalFinished = !!winnerTeamId;

    const isTwoLeggedEliminated =
      isTwoLegged && isFinalFinished && fixture.teams[team].id !== winnerTeamId;

    return isKoEliminated || isTwoLeggedEliminated;
  }
}
