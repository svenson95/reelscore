import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ExtendedFixtureDTO } from '@lib/models';

import { FixtureListItemComponent } from './components';

@Component({
  selector: 'rs-fixture-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FixtureListItemComponent],
  styles: `
    ul { @apply w-full; }
    li { @apply bg-white; }
    li:not(:last-child) { @apply border-b-[1px]; }
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
