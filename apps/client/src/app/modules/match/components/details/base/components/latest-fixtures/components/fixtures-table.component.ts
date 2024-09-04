import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import { TeamNamePipe } from '@app/pipes';
import {
  FixtureDTO,
  FixtureResult,
  FixtureTeam,
  MatchTeams,
} from '@lib/models';
import { ResultLabelComponent } from '../../../../../../../../components';

@Pipe({
  name: 'check',
  standalone: true,
})
export class CheckScorePipe implements PipeTransform {
  transform = (
    teams: MatchTeams,
    relatedTeam: FixtureTeam,
    type: FixtureResult
  ): boolean => {
    const { home, away } = teams;
    const team = home.id === relatedTeam.id ? home : away;
    switch (type) {
      case 'WIN':
        return team.winner === true;
      case 'LOSS':
        return team.winner === false;
      default:
        return false;
    }
  };
}

@Pipe({
  name: 'isRelated',
  standalone: true,
})
export class IsRelatedPipe implements PipeTransform {
  transform = (team: FixtureTeam, relatedTeam: FixtureTeam): boolean => {
    return team.id === relatedTeam.id;
  };
}

@Component({
  selector: 'reelscore-match-fixtures-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    DatePipe,
    MatRippleModule,
    TeamNamePipe,
    CheckScorePipe,
    IsRelatedPipe,
    ResultLabelComponent,
  ],
  styles: `
    :host { @apply flex-1 text-fb-font-size-body-2; }
    a { @apply flex items-center p-2; }
    a:not(:last-of-type) { @apply border-b-[1px]; }
    .date { @apply w-[40px]; }
    .team { @apply flex-1 content-center leading-[13px]; }
    .home { @apply text-right; }
    .result { @apply text-center w-[40px]; }
    .is-related { @apply underline decoration-2; }
    .is-winner .is-related { @apply decoration-green-500; }
    .is-loser .is-related { @apply decoration-red-500; }
  `,
  template: `
    @for(match of fixtures(); track match.fixture.id) {
    <a
      mat-ripple
      [routerLink]="['..', match.fixture.id]"
      [class.is-winner]="match.teams | check : team() : 'WIN'"
      [class.is-loser]="match.teams | check : team() : 'LOSS'"
    >
      <div class="date">
        <span>{{ match.fixture.date | date : 'dd.MM' }}</span>
      </div>

      <div class="team home">
        <span [class.is-related]="match.teams.home | isRelated : team()">
          {{ match.teams.home.name | teamName : 'short' }}
        </span>
      </div>

      <div class="result">
        <reelscore-result-label
          [result]="match.score.fulltime"
          [status]="match.fixture.status.short"
        />
      </div>

      <div class="team">
        <span [class.is-related]="match.teams.away | isRelated : team()">
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
  fixtures = input.required<FixtureDTO[]>();
  team = input.required<FixtureTeam>();
}
