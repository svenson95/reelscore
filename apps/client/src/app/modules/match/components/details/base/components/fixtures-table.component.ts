import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import { TeamNamePipe } from '@app/pipes';
import { FixtureTeam, MatchDTO, MatchTeams } from '@lib/models';

@Pipe({
  name: 'sameId',
  standalone: true,
})
export class SameIdPipe implements PipeTransform {
  transform = (id: number, team: FixtureTeam): boolean => id === team.id;
}

const getTeam = (matches: MatchDTO[]): FixtureTeam =>
  matches.reduce(
    (acc, curr) =>
      curr.teams.home.id === acc.id ? curr.teams.home : curr.teams.away,
    {} as FixtureTeam
  );

const getResult = (m: MatchTeams, t: FixtureTeam, winner: boolean): boolean => {
  const home = m.home.id === t.id && m.home.winner === winner;
  const away = m.away.id === t.id && m.away.winner === winner;
  return home || away;
};

@Pipe({
  name: 'isWinner',
  standalone: true,
})
export class IsWinnerPipe implements PipeTransform {
  transform = (teams: MatchTeams, t: FixtureTeam): boolean => {
    return getResult(teams, t, true);
  };
}

@Pipe({
  name: 'isLoser',
  standalone: true,
})
export class IsLoserPipe implements PipeTransform {
  transform = (teams: MatchTeams, t: FixtureTeam): boolean => {
    return getResult(teams, t, false);
  };
}

@Component({
  selector: 'futbet-match-fixtures-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    DatePipe,
    MatRippleModule,
    TeamNamePipe,
    SameIdPipe,
    IsWinnerPipe,
    IsLoserPipe,
  ],
  styles: `
    :host { @apply flex-1 p-4 text-fb-font-size-small; }
    a { @apply flex p-2; }
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
      mat-ripple
      [routerLink]="['..', match.fixture.id]"
      [class.is-winner]="match.teams | isWinner : relatedTeam()"
      [class.is-loser]="match.teams | isLoser : relatedTeam()"
    >
      <div class="date">
        <span>{{ match.fixture.date | date : 'dd.MM | ccc' }}</span>
      </div>

      <div class="team home">
        <span
          [class.is-related-team]="match.teams.home.id | sameId : relatedTeam()"
        >
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
        <span
          [class.is-related-team]="match.teams.away.id | sameId : relatedTeam()"
        >
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
  relatedTeam = computed<FixtureTeam>(() => getTeam(this.latestFixtures()));
}
