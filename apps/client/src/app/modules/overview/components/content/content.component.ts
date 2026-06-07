import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import {
  OverviewFixturesComponent,
  OverviewStandingsComponent,
} from './components';
import { OverviewContentFacade } from './content.facade';
import { HideHeaderDirective } from './directives';

const MAT_MODULES = [MatTabsModule];

@Component({
  selector: 'section[rs-overview-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...MAT_MODULES,
    HideHeaderDirective,
    OverviewFixturesComponent,
    OverviewStandingsComponent,
  ],
  providers: [OverviewContentFacade],
  styles: `
    .tab-content {
      @apply max-w-rs-max-width inline-flex flex-wrap md:flex-nowrap w-full p-3 gap-rs2 mx-auto;

      .fixtures-container, .standings-container { @apply w-full min-w-[200px]; }
    }
  `,
  template: `
    <mat-tab-group
      [selectedIndex]="tabIndex()"
      animationDuration="150ms"
      rsHideHeader
    >
      @for (weekday of weekdays; track $index; let idx = $index) {
      <mat-tab [label]="weekday">
        <div class="tab-content">
          @let fixtures = weekFixtures()[idx]; @let standings =
          weekStandings()[idx]; @if (fixtures) {
          <rs-overview-fixtures
            class="fixtures-container"
            [filteredFixtures]="fixtures"
            [isLoading]="fixturesLoading()"
            [error]="fixturesError()"
          />
          } @if (standings) {
          <rs-overview-standings
            class="standings-container"
            [weekStandings]="standings"
            [isLoading]="standingsLoading()"
            [error]="standingsError()"
          />
          }
        </div>
      </mat-tab>
      }
    </mat-tab-group>
  `,
})
export class OverviewContentComponent {
  private readonly facade = inject(OverviewContentFacade);
  readonly tabIndex = this.facade.tabIndex;
  readonly weekdays = this.facade.weekdays;

  readonly weekFixtures = this.facade.weekFixtures;
  readonly fixturesLoading = this.facade.fixturesLoading;
  readonly fixturesError = this.facade.fixturesError;

  readonly weekStandings = this.facade.weekStandings;
  readonly standingsLoading = this.facade.standingsLoading;
  readonly standingsError = this.facade.standingsError;
}
