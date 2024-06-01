import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FixtureStatisticsDTO } from '@lib/models';

@Component({
  selector: 'futbet-match-details-after',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: ``,
  template: `
    <!-- <section>
      <div>match events...</div>
    </section> -->

    <section>
      <div>match stats...</div>
    </section>

    <!-- <section>
      <div>line-up...</div>
    </section> -->
  `,
})
export class MatchDetailsAfterComponent {
  data = input.required<FixtureStatisticsDTO>();
}
