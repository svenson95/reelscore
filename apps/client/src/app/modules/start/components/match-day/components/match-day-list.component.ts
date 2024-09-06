import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { FixtureListComponent, OptimizedImageComponent } from '@app/components';
import { CompetitionWithFixtures, getCompetitionLogo } from '@app/models';
import { CompetitionRoundPipe } from '@app/pipes';

@Component({
  selector: 'reelscore-start-match-day-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CompetitionRoundPipe,
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
    .header span { 
      -webkit-font-smoothing: antialiased;
      color: var(--mat-table-header-headline-color, rgba(0, 0, 0, 0.87));
      font-family: var(--mat-table-header-headline-font, Roboto, sans-serif);
      line-height: var(--mat-table-header-headline-line-height);
      font-size: var(--fb-font-size-body-2);
      font-weight: var(--mat-table-header-headline-weight, 500);

      &.gray { @apply text-fb-color-text-2 text-fb-font-size-small shrink-0; }
    }
    .spacer { @apply flex-1; }
  `,
  template: `
    <div class="header">
      <reelscore-optimized-image
        [source]="getCompetitionLogo(competition().fixtures[0].league.id)"
        alternate=""
        width="24"
        height="24"
      />
      <span>{{ competition().name }}</span>
      <div class="spacer"></div>
      <span class="gray">
        {{ round() | competitionRound : 'header' }}
      </span>
    </div>
    <reelscore-fixture-list [fixtures]="competition().fixtures" />
  `,
})
export class MatchDayListComponent {
  competition = input.required<CompetitionWithFixtures>();

  round = computed(() => {
    const fixture = this.competition().fixtures[0];
    return fixture ? fixture.league.round : '';
  });

  getCompetitionLogo = getCompetitionLogo;
}
