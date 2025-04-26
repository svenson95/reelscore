import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import {
  CheckScorePipe,
  ResultLabelComponent,
  TeamIsRelatedPipe,
  TeamNamePipe,
  linkToMatch,
} from '@app/shared';
import { FixtureDTO, FixtureTeam } from '@lib/models';

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
  ],
  styles: `
    :host { @apply flex-1 text-rs-font-size-body-2; }
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
      [routerLink]="linkToMatch(match)"
      [class.is-winner]="match.teams | checkScore : team() : 'WIN'"
      [class.is-loser]="match.teams | checkScore : team() : 'LOSS'"
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
        <rs-result-label
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

  linkToMatch = linkToMatch;
}
