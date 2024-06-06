import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { TeamNamePipe } from '@app/pipes';
import { FixtureTeam, MatchDTO, MatchTeams } from '@lib/models';

@Component({
  selector: 'futbet-match-fixtures-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, DatePipe, TeamNamePipe],
  styles: `
    :host { @apply flex-1 p-4 text-fb-font-size-small; }
    a { @apply flex p-2 sm:hover:bg-fb-color-green-1-light; }
    a:not(:last-of-type) { @apply border-b-[1px]; }
    .date { @apply w-[60px] border-r-[1px]; }
    .team { @apply w-[30%] content-center leading-[13px]; }
    .home { @apply text-right; }
    .result { @apply text-center w-[60px]; }
    .is-related-team { @apply font-bold; }
    .is-winner { @apply bg-fb-win; }
    .is-loser { @apply bg-fb-lose; }
  `,
  template: `
    @for(match of latestFixtures(); track match.fixture.id; let idx = $index) {
    <a
      [routerLink]="['..', match.fixture.id]"
      [class.is-winner]="isWinner(match.teams)"
      [class.is-loser]="isLoser(match.teams)"
    >
      <div class="date">
        <span>{{ match.fixture.date | date : 'dd.MM | ccc' }}</span>
      </div>

      <div class="team home">
        <span [class.is-related-team]="relatedTeamId(match.teams.home.id)">
          {{ match.teams.home.name | teamName : 'short' }}
        </span>
      </div>

      <div class="result">
        @if(match.score.fulltime.home !== null) {
        <span>
          {{ match.score.fulltime.home }} -
          {{ match.score.fulltime.away }}
        </span>
        }
      </div>

      <div class="team">
        <span [class.is-related-team]="relatedTeamId(match.teams.away.id)">
          {{ match.teams.away.name | teamName : 'short' }}
        </span>
      </div>
    </a>
    } @empty {
    <p class="no-data">Keine Spiele gefunden.</p>
    }
  `,
})
export class MatchFixturesTableComponent {
  latestFixtures = input.required<MatchDTO[]>();

  relatedTeam = computed<FixtureTeam>(() => {
    const fixtures = this.latestFixtures();
    const firstGame = fixtures[0];
    const nextGame = fixtures[1];
    const home = firstGame.teams.home;
    if (
      home.id === nextGame?.teams.home.id ||
      home.id === nextGame?.teams.away.id
    ) {
      return home;
    } else {
      return firstGame.teams.away;
    }
  });

  relatedTeamId(id: number): boolean {
    return this.relatedTeam().id === id;
  }

  isWinner = (t: MatchTeams): boolean => this.getTeam(t).winner === true;
  isLoser = (t: MatchTeams): boolean => this.getTeam(t).winner === false;

  private getTeam = (teams: MatchTeams): FixtureTeam => {
    const isHome = teams.home.id === this.relatedTeam().id;
    return isHome ? teams.home : teams.away;
  };
}
