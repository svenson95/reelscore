import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LatestFixturesDTO, MatchTeams } from '@lib/models';

import { AnalysesEvaluationsComponent } from './components';

@Component({
  selector: 'reelscore-match-fixture-analyses-last-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnalysesEvaluationsComponent],
  styles: `
    section { @apply flex flex-wrap gap-5 mt-5; }
    section div { @apply flex-1 bg-white p-5; }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    <section class="latest-fixtures">
      <div class="home">
        <reelscore-match-fixture-analyses-evaluations
          [fixtures]="fixtures().home"
          [relatedTeam]="teams().home"
        />
      </div>
      <div class="away">
        <reelscore-match-fixture-analyses-evaluations
          [fixtures]="fixtures().away"
          [relatedTeam]="teams().away"
        />
      </div>
    </section>
  `,
})
export class AnalysesLastFixturesComponent {
  fixtures = input.required<LatestFixturesDTO>();
  teams = input.required<MatchTeams>();
}
