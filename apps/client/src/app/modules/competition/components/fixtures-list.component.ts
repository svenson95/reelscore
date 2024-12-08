import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  CompetitionRoundPipe,
  FixtureListComponent,
  OptimizedImageComponent,
  getCompetitionLogo,
} from '@app/shared';
import { CompetitionId, FixtureDTO } from '@lib/models';

@Component({
  selector: 'reelscore-competition-fixtures-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FixtureListComponent,
    CompetitionRoundPipe,
    OptimizedImageComponent,
  ],
  styles: `
    :host { @apply flex flex-col; }
    p { @apply text-fb-font-size-body-2 font-medium; }
    section.round { 
      @apply flex items-center gap-4 p-2 border-b-[1px];
      reelscore-optimized-image { min-width: 34px; min-height: 26px; }
    }
    section.days { 
      @apply flex flex-col gap-5; 
      .group-date { 
        @apply py-2 px-4 border-b-[1px]; 
      }
    }
  `,
  template: `
    <section class="round">
      <reelscore-optimized-image
        [source]="getCompetitionLogo(competitionId())"
        alternate="league logo"
        width="24"
        height="24"
      />
      <p>{{ round()! | competitionRound }}</p>
    </section>
    <section class="days">
      @for (day of fixturesDays(); track $index) {
      <div class="day">
        <p class="group-date">{{ day.date | date : 'cccc | dd.MM' }}</p>
        <reelscore-fixture-list [fixtures]="day.fixtures" />
      </div>
      }
    </section>
  `,
})
export class FixturesListComponent {
  competition = input.required<CompetitionId>();
  fixtures = input.required<FixtureDTO[]>();
  isLoading = input.required<boolean>();

  getCompetitionLogo = getCompetitionLogo;

  round = computed(() => this.fixtures()?.[0].league.round);
  date = computed(() => this.fixtures()?.[0].fixture.date);
  competitionId = computed(() => this.fixtures()?.[0].league.id);

  fixturesDays = computed(() => {
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
