import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { ExtendedFixtureDTO } from '@lib/models';

import { FixtureListItemComponent } from './components';

@Component({
  selector: 'rs-fixture-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixtureListItemComponent],
  styles: `
    ul { @apply w-full; }
    li:not(:last-child) { @apply border-b-[1px]; }
  `,
  template: `
    <ul>
      @for(match of fixtures(); track match.fixture.id; let isLast = $last) {
      <li>
        <rs-fixture-list-item
          class="fixture-list-item"
          [fixture]="match"
          [class.is-last]="isLastList() && isLast"
        />
      </li>
      }
    </ul>
  `,
})
export class FixtureListComponent {
  readonly fixtures = input.required<ExtendedFixtureDTO[]>();
  readonly isLastList = input<boolean>(true);
}
