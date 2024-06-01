import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatchDTO } from '@lib/models';

@Component({
  selector: 'futbet-match-details-base',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    h3 { @apply pb-2 mb-2 border-b-[1px] text-center; } // todo refac 
    .item { @apply flex justify-center py-2 gap-5; }
    .item > *:not(.key) { @apply flex-[2] sm:flex-1; }
    .key { @apply text-right flex-1; }
    span { @apply text-fb-font-size-body-2 md:text-fb-font-size-body-1;}
  `,
  template: `
    <h3>SPIELDATEN</h3>
    <ul>
      <li>
        <div class="item">
          <span class="key">Stadion</span>
          <span>
            {{ data().fixture.venue.name }}
          </span>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Stadt</span>
          <span>
            {{ data().fixture.venue.city }}
          </span>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Schiedsrichter</span>
          <span>{{ data().fixture.referee }}</span>
        </div>
      </li>
    </ul>
  `,
})
export class MatchDetailsBaseComponent {
  data = input.required<MatchDTO>();
}
