import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import { COMPETITION_URL } from '@lib/constants';
import { CompetitionId, CompetitionUrl, FixtureDTO } from '@lib/models';

import { linkToMatch } from '../constants';
import { getTeamLogo } from '../models';
import { TeamNamePipe } from '../pipes';
import { OptimizedImageComponent } from './optimized-image/optimized-image.component';
import { ResultLabelComponent } from './result-label.component';

@Component({
  selector: 'reelscore-fixture-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterModule,
    MatRippleModule,
    OptimizedImageComponent,
    TeamNamePipe,
    ResultLabelComponent,
  ],
  styles: `
    ul { @apply w-full; }
    li { @apply bg-white; }
    li > a { @apply flex items-stretch; }
    li:not(:last-child) { @apply border-b-[1px]; }
    li > section { @apply inline-flex flex-col; }
    .time { 
      @apply justify-center items-center min-w-[50px] text-fb-font-size-small; 

      &.is-upcoming { @apply bg-fb-color-white-2; }
    }
    .time, .result { 
      @apply flex text-center justify-center;
    }
    .result { 
      @apply min-w-[40px] p-2 items-center gap-[0.1rem]; 

      &:not(.is-upcoming) { @apply bg-fb-color-white-2; }
    }
    .teams { @apply w-full flex text-fb-font-size-body-2; }
    .teams > div:not(.result) { @apply flex flex-1 p-2 gap-2 items-center; }
    .teams > div:first-of-type { @apply justify-end text-end; }
    .team-name { line-height: 14px; text-wrap: balance; }
  `,
  template: `
    <ul>
      @for(match of fixtures(); track match.fixture.id) {
      <li>
        <a matRipple [routerLink]="linkToMatch(match)">
          <section class="time" [class.is-upcoming]="isNotStarted(match)">
            <span class="team-name-label">
              {{ match.fixture.date | date : 'HH:mm' }}
            </span>
          </section>
          <section class="teams">
            <div>
              <span
                class="team-name"
                [class.line-through]="isTeamEliminated(match, 'home')"
              >
                {{ match.teams.home.name | teamName : 'short' }}
              </span>
              <reelscore-optimized-image
                [source]="getTeamLogo(match.teams.home.id)"
                alternate="home logo"
                width="14"
                height="14"
              />
            </div>
            <div class="result" [class.is-upcoming]="isNotStarted(match)">
              <reelscore-result-label
                [result]="match.goals"
                [status]="match.fixture.status.short"
                [isNotStarted]="isNotStarted(match)"
              />
            </div>
            <div>
              <reelscore-optimized-image
                [source]="getTeamLogo(match.teams.away.id)"
                alternate="away logo"
                width="14"
                height="14"
              />
              <span
                class="team-name"
                [class.line-through]="isTeamEliminated(match, 'away')"
              >
                {{ match.teams.away.name | teamName : 'short' }}
              </span>
            </div>
          </section>
        </a>
      </li>
      }
    </ul>
  `,
})
export class FixtureListComponent {
  routerLinks: Record<CompetitionId, CompetitionUrl> = COMPETITION_URL;
  fixtures = input.required<FixtureDTO[]>();

  getTeamLogo = getTeamLogo;
  linkToMatch = linkToMatch;
  isNotStarted = (fixture: FixtureDTO): boolean => {
    const notStartedValues = ['TBD', 'NS'];
    return notStartedValues.some((v) => v === fixture.fixture.status.short);
  };

  isTeamEliminated(fixture: FixtureDTO, team: 'home' | 'away'): boolean {
    // In champions league the round of 16, quarter-finals and semi-finals are two-legged ties
    const isChampionsLeagueOrSimilar =
      fixture.league.id === 2 || fixture.league.id === 3;

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
      !isChampionsLeagueOrSimilar &&
      isKoPhase &&
      fixture.teams[team].winner === false;

    const championsLeagueTwoLeggedFinals = [
      'Round of 16',
      'Quarter-finals',
      'Semi-finals',
    ];
    const isTwoLeggedTie =
      isChampionsLeagueOrSimilar &&
      championsLeagueTwoLeggedFinals.includes(fixture.league.round);
    const winnerTeamId = fixture?.final?.winnerOfFinal;
    const isFinalFinished = !!winnerTeamId;
    const isTwoLeggedEliminated =
      isTwoLeggedTie &&
      isFinalFinished &&
      fixture.teams[team].id !== winnerTeamId;
    return isKoEliminated || isTwoLeggedEliminated;
  }
}
