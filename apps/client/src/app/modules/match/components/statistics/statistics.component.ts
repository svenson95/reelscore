import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FixtureStatisticsDTO } from '@lib/models';

@Component({
  selector: 'futbet-match-statistics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    section { @apply my-5; }
    div { @apply flex gap-5 justify-center; }
    h3 { @apply pb-2 mb-2 border-b-[1px] text-center; } // todo refac 
    h4, li { @apply text-fb-font-size-body-2 md:text-fb-font-size-body-1;}
    h4 { @apply text-center mb-2; }
  `,
  template: `
    <h3>STATISTIKEN</h3>
    @for (item of data().response[0].statistics; track item.type; let idx =
    $index) {
    <section>
      <h4>{{ item.type }}</h4>
      <div>
        <ul>
          <li>{{ item?.value ?? '-' }}</li>
        </ul>

        <ul>
          <li>{{ data().response[1].statistics[idx].value }}</li>
        </ul>
      </div>
    </section>
    }
  `,
})
export class MatchStatisticsComponent {
  data = input.required<FixtureStatisticsDTO>();
}
