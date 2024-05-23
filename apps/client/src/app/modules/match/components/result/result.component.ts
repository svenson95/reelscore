import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OptimizedImageComponent } from '../../../../components';
import { MatchDetails } from '../../models';

@Component({
  selector: 'futbet-match-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent],
  styles: `:host { @apply flex justify-evenly; }`,
  template: `
    <section class="flex gap-5 items-center">
      <futbet-optimized-image
        [source]="data().homeLogo"
        alternate="home logo"
        width="50"
        height="50"
      />
      <span>{{ data().home }}</span>
    </section>

    <section class="self-center">
      @switch(isUpcoming()) { @case(true) {
      <div class="flex flex-col items-center">
        <span>{{ data().time }}</span>
        <span>{{ data().date }}</span>
      </div>
      } @case(false) {
      <span>{{ data().result }}</span>
      }}
    </section>

    <section class="flex gap-5 items-center">
      <span>{{ data().away }}</span>
      <futbet-optimized-image
        [source]="data().awayLogo"
        alternate="away logo"
        width="50"
        height="50"
      />
    </section>
  `,
})
export class MatchResultComponent {
  isUpcoming = input.required<boolean>();
  data = input.required<MatchDetails>();
}
