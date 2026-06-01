import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CompetitionWithFixtures,
  FixtureListComponent,
  getCompetitionLogo,
  getCompetitionLogoSrcSet,
  NameLabelPipe,
  ResponsiveImageComponent,
  RoundLabelPipe,
} from '@app/shared';
import { CompetitionRound } from '@lib/models';

const EXTERNAL_MODULES = [RouterLink];

@Component({
  selector: 'rs-start-match-day-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...EXTERNAL_MODULES,
    RoundLabelPipe,
    NameLabelPipe,
    ResponsiveImageComponent,
    FixtureListComponent,
  ],
  styles: `
    :host {
      @apply flex flex-col overflow-hidden bg-rs-alt-bg shadow-rs2;
      border: 1px solid var(--rs-button-border-color);
      border-radius: var(--mat-standard-button-toggle-shape);

      --mat-table-header-headline-line-height: 14px;
    }
    .header { @apply flex gap-4 pr-3 border-b-[1px] items-center; border-bottom-color: var(--rs-button-border-color); }
    .header {
      span, a {
        font-family: var(--rs-font-family);
        line-height: var(--mat-table-header-headline-line-height);
        font-size: var(--rs-font-size-body-2);
        font-weight: var(--mat-table-header-headline-weight, 500);

        &.gray { @apply text-rs-color-text-2 text-rs-font-size-small shrink-0; }
      }

      .competition-logo-small { border-bottom: 0.5px solid transparent; }
    }
    .spacer { @apply flex-1; }
  `,
  template: `
    <div class="header">
      <div class="competition-logo-small">
        <rs-responsive-image
          class="competition-corner"
          [source]="getCompetitionLogo()"
          [sourceSet]="getCompetitionLogoSet()"
          altText="competition logo"
          [width]="24"
          [height]="24"
        />
      </div>
      <a [routerLink]="competition().url">
        {{ competition().name | nameLabel }}
      </a>
      <div class="spacer"></div>
      <span class="gray">{{ round() | roundLabel : 'header' }}</span>
    </div>
    <rs-fixture-list [fixtures]="competition().fixtures" />
  `,
})
export class MatchDayListComponent {
  competition = input.required<CompetitionWithFixtures>();
  firstFixture = computed(() => untracked(this.competition).fixtures[0]);

  round = computed<CompetitionRound>(() => {
    const fixture = untracked(this.firstFixture);
    return fixture ? fixture.league.round : '';
  });

  getCompetitionLogo = computed(() => {
    const fixture = untracked(this.firstFixture);
    return getCompetitionLogo(fixture.league.id, 24);
  });
  getCompetitionLogoSet = computed(() => {
    const fixture = untracked(this.firstFixture);
    return getCompetitionLogoSrcSet(fixture.league.id, 24);
  });
}
