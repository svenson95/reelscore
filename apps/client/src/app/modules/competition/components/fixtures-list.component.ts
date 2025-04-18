import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  untracked,
} from '@angular/core';

import { CompetitionId, ExtendedFixtureDTO } from '@lib/models';

import {
  FixtureListComponent,
  OptimizedImageComponent,
  RoundLabelPipe,
  getCompetitionLogo,
} from '../../../shared';

@Component({
  selector: 'rs-competition-fixtures-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FixtureListComponent,
    RoundLabelPipe,
    OptimizedImageComponent,
  ],
  styles: `
    :host { @apply flex flex-col; }
    p { @apply text-rs-font-size-body-2 font-medium; }
    div.round, .day {
      @apply border-[1px] bg-white;
      border-color: var(--mdc-outlined-button-outline-color);
    }
    div.round { 
      @apply flex items-center gap-4 p-2 mb-4;
      rs-optimized-image { min-width: 34px; min-height: 26px; }
    }
    div.competition-logo { @apply ml-1; }
    div.days { 
      @apply flex flex-col gap-5; 
      .group-date { @apply py-2 px-4 border-b-[1px]; }
    }
  `,
  template: `
    <div class="round">
      <div class="competition-logo-small">
        @defer (on viewport) {
        <rs-optimized-image
          [source]="competitionLogo()"
          altText="league logo"
          width="24"
          height="24"
        />
        } @placeholder {
        <div class="competition-logo-small-placeholder"></div>
        }
      </div>
      <p>{{ round()! | roundLabel }}</p>
    </div>
    <div class="days">
      @for (day of fixturesDays(); track $index + '-' + day.date) {
      <div class="day">
        <p class="group-date">{{ day.date | date : 'cccc | dd.MM' }}</p>
        <rs-fixture-list [fixtures]="day.fixtures" />
      </div>
      }
    </div>
  `,
})
export class FixturesListComponent {
  competition = input.required<CompetitionId>();
  fixtures = input.required<ExtendedFixtureDTO[]>();
  isLoading = input.required<boolean>();

  firstFixture = computed<ExtendedFixtureDTO>(
    () => untracked(this.fixtures)?.[0]
  );
  round = computed(() => untracked(this.firstFixture).league.round);
  date = computed(() => untracked(this.firstFixture).fixture.date);
  competitionId = computed(() => untracked(this.firstFixture).league.id);
  competitionLogo = computed(() =>
    getCompetitionLogo(untracked(this.competitionId))
  );

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
