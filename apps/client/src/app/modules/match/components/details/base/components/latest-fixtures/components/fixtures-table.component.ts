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
import { FixtureDTO, FixtureTeam, MatchTeams } from '@lib/models';

@Pipe({
  name: 'isWinner',
  standalone: true,
})
export class IsWinnerPipe implements PipeTransform {
  transform = (fs: MatchTeams, r: FixtureTeam, v: boolean): boolean => {
    const f = fs.home.id === r.id ? fs.home : fs.away;
    return f.id === r.id && f.winner === v;
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
    IsWinnerPipe,
  ],
  styles: `
    :host { @apply flex-1 p-4 text-fb-font-size-small; }
    a { @apply flex p-2 items-center; }
    a:not(:last-of-type) { @apply border-b-[1px]; }
    .date { @apply w-[60px]; }
    .team { @apply w-[30%] content-center leading-[13px]; }
    .home { @apply text-right; }
    .result { @apply text-center w-[60px]; }
    .is-related-team { @apply font-bold; }
    .is-winner .is-related-team { @apply bg-fb-win; }
    .is-loser .is-related-team { @apply bg-fb-lose; }
    .team span { @apply px-2 py-1; }
  `,
  template: `
    @for(match of latestFixtures(); track match.fixture.id) {
    <a
      mat-ripple
      [routerLink]="['..', match.fixture.id]"
      [class.is-winner]="match.teams | isWinner : relatedTeam() : true"
      [class.is-loser]="match.teams | isWinner : relatedTeam() : false"
    >
      <div class="date">
        <span>{{ match.fixture.date | date : 'dd.MM' }}</span>
      </div>

      <div class="team home">
        <span
          [class.is-related-team]="match.teams.home.id === relatedTeam().id"
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
          [class.is-related-team]="match.teams.away.id === relatedTeam().id"
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
  latestFixtures = input.required<FixtureDTO[]>();
  relatedTeam = computed<FixtureTeam>(() =>
    this.getTeam(this.latestFixtures())
  );

  getTeam = (matches: FixtureDTO[]): FixtureTeam =>
    matches.reduce(
      (acc, curr) =>
        curr.teams.home.id === acc.id ? curr.teams.home : curr.teams.away,
      {} as FixtureTeam
    );
}
