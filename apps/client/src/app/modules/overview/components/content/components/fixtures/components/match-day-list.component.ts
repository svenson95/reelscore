import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CompetitionRound } from '@lib/models';

import {
  CompetitionWithFixtures,
  FixtureListComponent,
  getCompetitionLogo,
  NameLabelPipe,
  OptimizedImageComponent,
  RoundLabelPipe,
} from '../../../../../../../shared';

@Component({
  selector: 'rs-start-match-day-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RoundLabelPipe,
    NameLabelPipe,
    OptimizedImageComponent,
    FixtureListComponent,
  ],
  styles: `
    :host {
      @apply flex flex-col overflow-hidden border;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);

      --mat-table-header-headline-line-height: 14px;
    }
    .header { @apply flex px-3 py-2 gap-5 bg-white border-b-[1px] items-center; }
    .header { 
      span, a {
        font-family: var(--mat-table-header-headline-font, Roboto, sans-serif);
        line-height: var(--mat-table-header-headline-line-height);
        font-size: var(--rs-font-size-body-2);
        font-weight: var(--mat-table-header-headline-weight, 500);
  
        &.gray { @apply text-rs-color-text-2 text-rs-font-size-small shrink-0; }
      }
    }
    .spacer { @apply flex-1; }
    .competition-logo { 
      @apply w-[24px] h-[24px]; 

      &-placeholder { 
        @apply w-[24px] h-[24px] bg-gray-200 rounded; 
      }
    }
  `,
  template: `
    <div class="header">
      <div class="competition-logo">
        @defer (on viewport) {
        <rs-optimized-image
          [source]="getCompetitionLogo()"
          alternate="competition logo"
          width="24"
          height="24"
        />
        } @placeholder {
        <div class="competition-logo-placeholder"></div>
        }
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

  round = computed<CompetitionRound>(() => {
    const fixture = this.competition().fixtures[0];
    return fixture ? fixture.league.round : '';
  });

  getCompetitionLogo = computed(() => {
    const fixture = this.competition().fixtures[0];
    return getCompetitionLogo(fixture.league.id);
  });
}
