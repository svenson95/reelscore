import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatchDTO } from '@lib/models';

@Component({
  selector: 'futbet-match-details-base',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col pb-2; }
    h3 { @apply pb-2 mb-2 border-b-[1px]; }
    .item { @apply flex items-center py-1 items-baseline; }
    .divider { @apply mx-1; }
    .key { @apply min-w-[140px]; }
    span { @apply text-fb-font-size-body-2 md:text-fb-font-size-body-1;}
  `,
  template: `
    <h3>SPIELDATEN</h3>
    <ul>
      <li>
        <div class="item">
          <span class="key">Stadion</span>
          <span>
            {{ data().fixture.venue.name + ' | ' + data().fixture.venue.city }}
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
