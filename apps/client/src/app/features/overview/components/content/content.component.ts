import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import type { DateString } from '@reelscore-sdk/helpers';
import type { ExtendedFixtureDTO, StandingsDTO } from '@reelscore-sdk/models';

import { OverviewFixturesComponent } from './fixtures/fixtures.component';
import { OverviewStandingsComponent } from './standings/standings.component';

import { OverviewContentFacade } from './content.facade';

type OverviewContentPanel = {
  fixtures: ExtendedFixtureDTO[];
  fixturesLoading: boolean;
  fixturesHasData: boolean;
  fixturesError: string | null;
  standings: StandingsDTO[];
  standingsLoading: boolean;
  standingsHasData: boolean;
  standingsError: string | null;
};

@Component({
  selector: 'div[rs-overview-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    OverviewFixturesComponent,
    OverviewStandingsComponent,
  ],
  providers: [OverviewContentFacade],
  styles: `
    .tab-content {
      @apply w-full max-w-rs-max-width inline-flex flex-wrap md:flex-nowrap py-3 gap-rs2 mx-auto;
      grid-area: 1 / 1;
    }

    .fixtures-container, .standings-container {
      @apply w-full min-w-[200px];
    }

    .content-transition {
      display: grid;
      overflow-x: clip;
    }

    .slide-in {
      animation: overview-slide-in 250ms cubic-bezier(0.4, 0, 0.2, 1) both;
    }

    .slide-out {
      animation: overview-slide-out 250ms cubic-bezier(0.4, 0, 0.2, 1) both;
    }

    @keyframes overview-slide-in {
      from {
        transform: translateX(var(--slide-in-offset));
      }

      to {
        transform: translateX(0);
      }
    }

    @keyframes overview-slide-out {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(var(--slide-out-offset));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .slide-in,
      .slide-out {
        animation-duration: 1ms;
      }
    }
  `,
  template: `
    <ng-template #selectedDayContent let-content let-panelIndex="panelIndex">
      <div
        class="tab-content"
        [class.slide-in]="hasNavigated() && panelIndex === activePanelIndex"
        [class.slide-out]="panelIndex === leavingPanel()"
        [style.display]="
          panelIndex === activePanelIndex || panelIndex === leavingPanel()
            ? null
            : 'none'
        "
        (animationend)="finishPanelAnimation($event, panelIndex)"
      >
        <section
          rs-overview-fixtures
          class="fixtures-container"
          [filteredFixtures]="content.fixtures"
          [isLoading]="content.fixturesLoading"
          [hasDataForSelectedDay]="content.fixturesHasData"
          [error]="content.fixturesError"
        ></section>

        <section
          rs-overview-standings
          class="standings-container"
          [weekStandings]="content.standings"
          [isLoading]="content.standingsLoading"
          [hasDataForSelectedDay]="content.standingsHasData"
          [error]="content.standingsError"
        ></section>
      </div>
    </ng-template>

    <div
      class="content-transition"
      [style.--slide-in-offset]="slideInOffset()"
      [style.--slide-out-offset]="slideOutOffset()"
    >
      @for (panelIndex of panelIndices; track panelIndex) {
      <ng-container
        [ngTemplateOutlet]="selectedDayContent"
        [ngTemplateOutletContext]="{
          $implicit: contentPanels()[panelIndex],
          panelIndex
        }"
      />
      }
    </div>
  `,
})
export class OverviewContentComponent {
  private readonly facade = inject(OverviewContentFacade);
  readonly selectedDay = this.facade.selectedDay;
  readonly tabIndex = this.facade.tabIndex;
  protected readonly hasNavigated = signal(false);
  protected readonly activePanel = signal(false);
  protected readonly contentPanels = signal<
    [OverviewContentPanel, OverviewContentPanel]
  >([this.createContentPanel(), this.createContentPanel()]);

  private readonly navigationDirection = signal<'forward' | 'backward'>(
    'forward'
  );

  protected readonly slideInOffset = computed(() =>
    this.navigationDirection() === 'forward' ? '100%' : '-100%'
  );
  protected readonly slideOutOffset = computed(() =>
    this.navigationDirection() === 'forward' ? '-100%' : '100%'
  );

  private previousSelectedDay: DateString | null = null;
  protected activePanelIndex = 0;
  protected readonly panelIndices = [0, 1];
  protected readonly leavingPanel = signal<number | null>(null);

  resetNavigationAnimation(): void {
    this.hasNavigated.set(false);
    this.leavingPanel.set(null);
    this.previousSelectedDay = this.selectedDay();
  }

  private readonly contentPanelEffect = effect(() => {
    const selectedDay = this.selectedDay();
    const contentPanel = this.createContentPanel();

    if (this.previousSelectedDay && selectedDay !== this.previousSelectedDay) {
      this.hasNavigated.set(true);
      this.leavingPanel.set(this.activePanelIndex);
      this.activePanelIndex = this.activePanelIndex === 0 ? 1 : 0;
      this.activePanel.set(this.activePanelIndex === 1);
      this.navigationDirection.set(
        selectedDay > this.previousSelectedDay ? 'forward' : 'backward'
      );
    }

    this.contentPanels.update((panels) => {
      if (this.activePanelIndex === 0) {
        return [contentPanel, panels[1]];
      }

      return [panels[0], contentPanel];
    });

    this.previousSelectedDay = selectedDay;
  });

  protected finishPanelAnimation(
    event: AnimationEvent,
    panelIndex: number
  ): void {
    if (
      event.target === event.currentTarget &&
      event.animationName === 'overview-slide-out' &&
      this.leavingPanel() === panelIndex
    ) {
      this.leavingPanel.set(null);
    }
  }

  private createContentPanel(): OverviewContentPanel {
    const selectedDayIndex = this.tabIndex();

    return {
      fixtures: this.facade.weekFixtures()[selectedDayIndex] ?? [],
      fixturesLoading: this.facade.fixturesLoading(),
      fixturesHasData: this.facade.hasFixturesDataForSelectedDay(),
      fixturesError: this.facade.fixturesError(),
      standings: this.facade.weekStandings()[selectedDayIndex] ?? [],
      standingsLoading: this.facade.standingsLoading(),
      standingsHasData: this.facade.hasStandingsDataForSelectedDay(),
      standingsError: this.facade.standingsError(),
    };
  }
}
