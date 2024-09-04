import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import { OptimizedImageComponent } from '@app/components';
import { SELECT_COMPETITION_DATA_FLAT } from '@app/constants';
import { getCompetitionLogo, getTeamLogo } from '@app/models';
import { CompetitionRoundPipe, TeamNamePipe } from '@app/pipes';
import { COMPETITION_URL } from '@lib/constants';
import { CompetitionId, CompetitionUrl, FixtureDTO } from '@lib/models';
import { ResultLabelComponent } from '../../../../../../components';
import { CompetitionFixtures } from '../../../../models';

@Component({
  selector: 'reelscore-match-day-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterModule,
    MatRippleModule,
    OptimizedImageComponent,
    TeamNamePipe,
    CompetitionRoundPipe,
    ResultLabelComponent,
  ],
  styles: `
    :host {
      @apply flex flex-col overflow-hidden border;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);

      --mat-table-header-headline-line-height: 18px;
    }
    .header { @apply flex px-3 py-2 gap-5 bg-white border-b-[1px] items-center; }
    .header span { 
      -webkit-font-smoothing: antialiased;
      color: var(--mat-table-header-headline-color, rgba(0, 0, 0, 0.87));
      font-family: var(--mat-table-header-headline-font, Roboto, sans-serif);
      line-height: var(--mat-table-header-headline-line-height);
      font-size: var(--fb-font-size-body-2);
      font-weight: var(--mat-table-header-headline-weight, 500);

      &.gray { @apply text-fb-color-text-2 text-fb-font-size-small; }
    }
    ul { @apply w-full; }
    li { @apply bg-white; }
    li > a { @apply flex items-stretch; }
    li:not(:last-of-type) { @apply border-b-[1px]; }
    li > section { @apply inline-flex flex-col; }
    .time { 
      @apply justify-center items-center min-w-[50px] bg-fb-color-white-2 text-fb-font-size-small; 
    }
    .time, .result { 
      @apply flex text-center justify-center;
    }
    .result { 
      @apply min-w-[40px] items-center gap-[0.1rem]; 
    }
    .teams { @apply w-full flex p-2 text-fb-font-size-body-2; }
    .teams > div:not(.result) { @apply flex flex-1 items-center gap-2; }
    .teams > div:first-of-type { @apply justify-end text-end; }
    .team-name { line-height: 14px; text-wrap: balance; }
    .spacer { @apply flex-1; }
  `,
  template: `
    <div class="header">
      <reelscore-optimized-image
        [source]="getCompetitionLogo(competition().fixtures[0].league.id)"
        alternate=""
        width="24"
        height="24"
      />
      <span>{{ competition().name }}</span>
      <div class="spacer"></div>
      <span class="gray">
        {{ round() | competitionRound : 'header' }}
      </span>
    </div>
    <ul>
      @for(item of competition().fixtures; track item.fixture.id) {
      <li>
        <a matRipple [routerLink]="linkToMatch(item)">
          <section class="time">
            <span class="team-name-label">
              {{ item.fixture.date | date : 'HH:mm' }}
            </span>
          </section>
          <section class="teams">
            <div>
              <span class="team-name">
                {{ item.teams.home.name | teamName : 'short' }}
              </span>
              <reelscore-optimized-image
                [source]="getTeamLogo(item.teams.home.id)"
                alternate="home logo"
                width="14"
                height="14"
              />
            </div>
            <div class="result">
              <reelscore-result-label
                [result]="item.score.fulltime"
                [status]="item.fixture.status.short"
              />
            </div>
            <div>
              <reelscore-optimized-image
                [source]="getTeamLogo(item.teams.away.id)"
                alternate="away logo"
                width="14"
                height="14"
              />
              <span class="team-name">
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
export class MatchDayListComponent {
  routerLinks: Record<CompetitionId, CompetitionUrl> = COMPETITION_URL;
  competition = input.required<CompetitionFixtures>();

  round = computed(() => {
    const fixture = this.competition().fixtures[0];
    return fixture ? fixture.league.round : '';
  });

  getCompetitionLogo = getCompetitionLogo;
  getTeamLogo = getTeamLogo;

  linkToMatch(data: FixtureDTO): string[] {
    const leagueUrl = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === data.league.id
    )?.url;
    if (!leagueUrl) throw new Error('Error in linkToMatch');
    const fixtureId = String(data.fixture.id);
    return ['/', 'leagues', leagueUrl, 'match', fixtureId];
  }
}
