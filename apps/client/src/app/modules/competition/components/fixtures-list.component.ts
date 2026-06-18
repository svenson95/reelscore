import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import {
  FixtureListComponent,
  ResponsiveImageComponent,
  RoundLabelPipe,
  ThemeService,
  getCompetitionLogo,
  getCompetitionLogoSrcSet,
} from '@app/shared';
import type { CompetitionId, ExtendedFixtureDTO } from '@lib/models';

@Component({
  selector: 'rs-competition-fixtures-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FixtureListComponent,
    RoundLabelPipe,
    ResponsiveImageComponent,
  ],
  styles: `
    :host { @apply flex flex-col shadow-rs3 rounded-fb overflow-clip; }
    p { @apply text-rs-font-size-body-2 font-medium; }
    div.round, .day {
      @apply bg-rs-button-bg;
    }
    div.round {
      @apply w-full flex items-center gap-4;
    }
    div.logo-wrapper {
      min-width: 40px;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    div.competition-logo { @apply ml-1; }
    div.days {
      @apply flex flex-col;
      .group-date { @apply py-2 px-4 border-y-[1px] leading-[16px]; border-color: var(--rs-button-border-color); }
    }
  `,
  template: `
    <div class="round">
      <div class="logo-wrapper">
        <div class="competition-logo-small">
          <rs-responsive-image
            class="competition-corner"
            [source]="competitionLogo()"
            [sourceSet]="competitionLogoSet()"
            altText="league logo"
            [width]="24"
            [height]="24"
          />
        </div>
      </div>
      <p>
        @if (this.fixtures()[0].league; as league) {
        {{
          league.round | roundLabel : { id: league.id, season: league.season }
        }}
        }
      </p>
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
  readonly competition = input.required<CompetitionId>();
  readonly fixtures = input.required<ExtendedFixtureDTO[]>();
  readonly isLoading = input.required<boolean>();

  private readonly themeService = inject(ThemeService);

  readonly competitionLogo = computed<string>(() =>
    getCompetitionLogo(
      this.competition(),
      24,
      1,
      this.themeService.isSystemDark()
    )
  );

  readonly competitionLogoSet = computed<string>(() =>
    getCompetitionLogoSrcSet(
      this.competition(),
      24,
      this.themeService.isSystemDark()
    )
  );

  readonly fixturesDays = computed(() => {
    const fixtures = this.fixtures();

    if (!fixtures) return [];

    const days = [
      ...new Set(fixtures.map((f) => f.fixture.date.substring(0, 10))),
    ];

    return days.map((day) => ({
      date: day,
      fixtures: fixtures.filter((f) => f.fixture.date.startsWith(day)),
    }));
  });
}
