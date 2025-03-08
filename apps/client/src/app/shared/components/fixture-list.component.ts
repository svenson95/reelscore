import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import { COMPETITION_URL } from '@lib/constants';
import {
  CompetitionId,
  CompetitionUrl,
  FixtureDTO,
  isNotStarted,
} from '@lib/models';

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
      @for(item of fixtures(); track item.fixture.id) {
      <li>
        <a matRipple [routerLink]="linkToMatch(item)">
          <section
            class="time"
            [class.is-upcoming]="isNotStarted(item.fixture)"
          >
            <span class="team-name-label">
              {{ item.fixture.date | date : 'HH:mm' }}
            </span>
          </section>
          <section class="teams">
            <div>
              <span
                class="team-name"
                [class.line-through]="isTeamEliminated(item, 'home')"
              >
                {{ item.teams.home.name | teamName : 'short' }}
              </span>
              <reelscore-optimized-image
                [source]="getTeamLogo(item.teams.home.id)"
                alternate="home logo"
                width="14"
                height="14"
              />
            </div>
            <div
              class="result"
              [class.is-upcoming]="isNotStarted(item.fixture)"
            >
              <reelscore-result-label
                [result]="item.goals"
                [status]="item.fixture.status.short"
                [isNotStarted]="isNotStarted(item.fixture)"
              />
            </div>
            <div>
              <reelscore-optimized-image
                [source]="getTeamLogo(item.teams.away.id)"
                alternate="away logo"
                width="14"
                height="14"
              />
              <span
                class="team-name"
                [class.line-through]="isTeamEliminated(item, 'away')"
              >
                {{ item.teams.away.name | teamName : 'short' }}
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
  isNotStarted = isNotStarted;

  isTeamEliminated(fixture: FixtureDTO, team: 'home' | 'away'): boolean {
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
    const isEliminated = fixture.teams[team].winner === false;
    return isKoPhase && isEliminated;
  }
}
