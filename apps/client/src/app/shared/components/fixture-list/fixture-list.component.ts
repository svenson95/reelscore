import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { ExtendedFixtureDTO } from '@lib/models';

import { FixtureListItemComponent } from './components';

@Component({
  selector: 'rs-fixture-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixtureListItemComponent],
  styles: `
    ul { @apply w-full; }
    li:not(:last-child) { @apply border-b-[1px]; border-bottom-color: var(--rs-button-border-color); }
    li:last-child { border-bottom: 0.5px solid transparent; }
  `,
  template: `
    <ul>
      @for(match of fixtures(); track match.fixture.id) {
      <li>
        <rs-fixture-list-item [fixture]="match" />
      </li>
      }
    </ul>
  `,
})
export class FixtureListComponent {
  fixtures = input.required<ExtendedFixtureDTO[]>();
}
