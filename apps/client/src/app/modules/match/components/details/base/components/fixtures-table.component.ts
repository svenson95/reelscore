import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { FixtureTeam, MatchDTO } from '@lib/models';
import { ShortTeamNamePipe } from '../../../../../../pipes';

@Component({
  selector: 'futbet-match-fixtures-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ShortTeamNamePipe],
  styles: `
    :host { @apply flex-1 py-4 px-4; }
    table { @apply w-full; }
    tr:not(:last-of-type) { @apply border-b-[1px]; }
    td {
      @apply text-fb-font-size-small py-2;

      &.date { @apply w-[60px] min-w-[60px] border-r-[1px]; }
      &.team { @apply w-[35%] leading-[13px]; }
      &.home { @apply text-right; }
      &.result { @apply text-center w-[60px]; }
    }
    .related-team { @apply font-bold; }
  `,
  template: `
    <table>
      @for(match of latestFixtures(); track match.fixture.id; let idx = $index)
      {
      <tr>
        <td class="date">
          <span>{{ match.fixture.date | date : 'ccc | dd.MM' }}</span>
        </td>

        <td class="team home">
          <span [class.related-team]="relatedTeamId(match.teams.home.id)">
            {{ match.teams.home.name | shortTeamName }}
          </span>
        </td>

        <td class="result">
          @if(match.score.fulltime.home !== null) {
          <span>
            {{ match.score.fulltime.home }} -
            {{ match.score.fulltime.away }}
          </span>
          }
        </td>

        <td class="team">
          <span [class.related-team]="relatedTeamId(match.teams.away.id)">
            {{ match.teams.away.name | shortTeamName }}
          </span>
        </td>
      </tr>
      } @empty {
      <p class="no-data">Keine Spiele gefunden.</p>
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
}
