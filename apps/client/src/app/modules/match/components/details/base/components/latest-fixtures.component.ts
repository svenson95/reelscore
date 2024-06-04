import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LatestFixturesDTO } from '@lib/models';

@Component({
  selector: 'futbet-match-latest-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  styles: `
    div { @apply flex gap-5 flex-col md:flex-row; }
    table { @apply flex-1; }
    table td {
      @apply text-fb-font-size-small;

      &:first-of-type { @apply max-w-[150px]; }
      &.home { @apply text-right; }
      &.result { @apply text-center min-w-[50px]; }
    }
    .winner { @apply font-bold; }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    <div>
      <table>
        @for(match of latestFixtures().home; track match.fixture.id; let idx =
        $index) {
        <tr>
          <td>
            <span>{{ match.fixture.date | date : 'dd.MM.yy' }}</span>
          </td>

          <td>
            <span [class.winner]="match.teams.home.winner">
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

          <td>
            <span [class.winner]="match.teams.away.winner">
              {{ match.teams.away.name }}
            </span>
          </td>
        </tr>
        }
      </table>

      <table>
        @for(match of latestFixtures().away; track match.fixture.id; let idx =
        $index) {
        <tr>
          <td class="home">
            <span [class.winner]="match.teams.home.winner">
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

          <td>
            <span [class.winner]="match.teams.away.winner">
              {{ match.teams.away.name }}
            </span>
          </td>

          <td>
            <span>{{ match.fixture.date | date : 'dd.MM.yy' }}</span>
          </td>
        </tr>
        }
      </table>
    </div>
  `,
})
export class MatchLatestFixturesComponent {
  latestFixtures = input.required<LatestFixturesDTO>();
}
