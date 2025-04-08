import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LatestFixturesDTO, MatchTeams } from '@lib/models';

import { AnalysesEvaluationsComponent } from './components';

@Component({
  selector: 'rs-match-fixture-analyses-last-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnalysesEvaluationsComponent],
  styles: `
    .latest-fixtures { @apply flex flex-wrap gap-5 mt-5; }
    .latest-fixtures div { @apply flex-1 bg-white p-5; }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    @let f = fixtures(); @let t = teams();
    <div class="latest-fixtures">
      <div class="home">
        <rs-match-fixture-analyses-evaluations
          [fixtures]="f.home"
          [relatedTeam]="t.home"
        />
      </div>
      <div class="away">
        <rs-match-fixture-analyses-evaluations
          [fixtures]="f.away"
          [relatedTeam]="t.away"
        />
      </div>
    </div>
  `,
})
export class AnalysesLastFixturesComponent {
  fixtures = input.required<LatestFixturesDTO>();
  teams = input.required<MatchTeams>();
}
