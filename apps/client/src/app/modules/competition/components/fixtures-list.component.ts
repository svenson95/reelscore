import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { FixtureListComponent } from '@app/components';
import { CompetitionRoundPipe } from '@app/pipes';
import { CompetitionId, FixtureDTO } from '@lib/models';

@Component({
  selector: 'reelscore-competition-fixtures-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FixtureListComponent, CompetitionRoundPipe],
  styles: `
    :host { @apply flex flex-col bg-white; }
    section:first-of-type { 
      @apply flex justify-between p-3 font-medium;
    }
    p { @apply text-fb-font-size-body-2; }
    .group-date { 
      @apply bg-fb-color-white-2 p-3 font-medium tracking-wider border-b-[1px] border-t-[1px]; 
    }
  `,
  template: `
    <section>
      <p>{{ round()! | competitionRound }}</p>
    </section>
    <section>
      @for (group of fixtureGroups(); track $index) {
      <p class="group-date">{{ group.date | date : 'cccc | dd.MM' }}</p>
      <reelscore-fixture-list [fixtures]="group.fixtures" />
      }
    </section>
  `,
})
export class FixturesListComponent {
  competition = input.required<CompetitionId>();
  fixtures = input.required<FixtureDTO[]>();
  isLoading = input.required<boolean>();

  round = computed(() => this.fixtures()?.[0].league.round);
  date = computed(() => this.fixtures()?.[0].fixture.date);

  fixtureGroups = computed(() => {
    const fixtures = this.fixtures();
    if (!fixtures) return [];
    const days = [
      ...new Set(fixtures.map((f) => f.fixture.date.substring(0, 10))),
    ];
    return days
      .map((day) => ({
        date: day,
        fixtures: fixtures
          .filter((f) => f.fixture.date.includes(day))
          .sort((a, b) => a.fixture.timestamp - b.fixture.timestamp),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  });
}
