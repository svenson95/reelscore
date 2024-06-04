import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { FixtureTeam, MatchDTO } from '@lib/models';

@Component({
  selector: 'futbet-match-fixtures-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  styles: `
    :host { @apply flex-1 bg-white py-2 px-4 border-[1px]; }
    table { @apply w-full; }
    tr:not(:last-of-type) { @apply border-b-[1px]; }
    td {
      @apply text-fb-font-size-small py-2;

      &:first-of-type { @apply w-[60px]; }
      &.team { @apply leading-[13px]; }
      &.home { @apply text-right; }
      &.result { @apply text-center min-w-[50px]; }
    }
    .related-team { @apply font-bold; }
  `,
  template: `
    <table>
      @for(match of latestFixtures(); track match.fixture.id; let idx = $index)
      {
      <tr>
        <td>
          <span>{{ match.fixture.date | date : 'dd.MM.yy' }}</span>
        </td>

        <td class="team home">
          <span [class.related-team]="relatedTeamId(match.teams.home.id)">
            {{ match.teams.home.name }}
          </span>
        </td>

        <td class="result">
          @if(match.score.fulltime.home){
          <span>
            {{ match.score.fulltime.home }} -
            {{ match.score.fulltime.away }}
          </span>
          }
        </td>

        <td class="team">
          <span [class.related-team]="relatedTeamId(match.teams.away.id)">
            {{ match.teams.away.name }}
          </span>
        </td>
      </tr>
      }
    </table>
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
      home.id === nextGame.teams.home.id ||
      home.id === nextGame.teams.away.id
    ) {
      return home;
    } else {
      return firstGame.teams.away;
    }
  });

  relatedTeamId(id: number): boolean {
    return this.relatedTeam().id === id;
  }
}
