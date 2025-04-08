import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import {
  OverviewFixturesComponent,
  OverviewStandingsComponent,
} from './components';
import { OverviewContentFacade } from './content.facade';
import { HideHeaderDirective } from './directives';

const ANGULAR_MODULES = [MatTabsModule];

@Component({
  selector: 'section[rs-overview-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...ANGULAR_MODULES,
    HideHeaderDirective,
    OverviewFixturesComponent,
    OverviewStandingsComponent,
  ],
  providers: [OverviewContentFacade],
  styles: `
    .tab-content {
      @apply max-w-rs-max-width inline-flex flex-wrap md:flex-nowrap w-full p-5 gap-5 mx-auto;

      .fixtures-container, .standings-container { @apply w-full min-w-[200px]; }
    }
  `,
  template: `
    <mat-tab-group
      [selectedIndex]="tabIndex()"
      dynamicHeight
      rsHideHeader
      animationDuration="280ms"
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
  facade = inject(OverviewContentFacade);
  tabIndex = this.facade.tabIndex;
  weekdays = this.facade.weekdays;

  weekFixtures = this.facade.weekFixtures;
  fixturesLoading = this.facade.fixturesLoading;
  fixturesError = this.facade.fixturesError;

  weekStandings = this.facade.weekStandings;
  standingsLoading = this.facade.standingsLoading;
  standingsError = this.facade.standingsError;
}
