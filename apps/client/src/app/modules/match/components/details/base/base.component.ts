import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LatestFixturesDTO, MatchDTO } from '@lib/models';

import { MatchFixtureDataComponent } from './components/fixture-data.component';
import { MatchLatestFixturesComponent } from './components/latest-fixtures.component';

@Component({
  selector: 'futbet-match-details-base',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixtureDataComponent, MatchLatestFixturesComponent],
  styles: `
    :host { @apply flex flex-col gap-10; }
    .item { @apply flex justify-center py-2 gap-5; }
    .item > *:not(.key) { @apply flex-[2] sm:flex-1; }
    .key { @apply text-fb-color-text-2 text-right flex-1; }
    .fixture-data span { @apply text-fb-font-size-body-2 md:text-fb-font-size-body-1;}
  `,
  template: `
    <futbet-match-fixture-data [data]="data()" />
    <futbet-match-latest-fixtures [latestFixtures]="latestFixtures()" />
  `,
})
export class MatchDetailsBaseComponent {
  data = input.required<MatchDTO>();
  latestFixtures = input.required<LatestFixturesDTO>();
}