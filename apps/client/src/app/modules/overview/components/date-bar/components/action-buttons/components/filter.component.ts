import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  ResponsiveImageComponent,
  SELECT_COMPETITION_DATA,
  SelectCompetitionGroup,
} from '@app/shared';
import { CompetitionId } from '@lib/models';

import {
  FilteredStandingsStore,
  WeekdayFixturesStore,
} from '../../../../../store';
import { SelectedDateService, FilterService } from '../../../../../services';

const MAT_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
];

@Component({
  selector: 'rs-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...MAT_MODULES, ResponsiveImageComponent],
  styles: `
    button[mat-icon-button].is-filtering {
      @apply bg-rs-color-primary;
      .mat-icon { @apply text-rs-color-text-3; }
    }
    button[mat-menu-item] {
      --mat-menu-item-label-text-size: var(--rs-font-size-body-3);
      --mat-menu-item-label-text-line-height: var(--rs-font-size-body-3);
      --mat-menu-item-icon-color: var(--rs-color-text-muted);
      --mat-menu-item-with-icon-leading-spacing: 16px;
      --mat-menu-item-with-icon-trailing-spacing: 16px;

      @apply py-1;

      &:not(.group-title) { @apply min-h-[32px]; }
      &.group-title { @apply min-h-[48px]; }

      &.is-filtering {
        background-color: var(--rs-color-surface-2);
        --mat-menu-item-icon-color: var(--rs-color-text-1);
        mat-icon { @apply absolute right-4; }
      }

      mat-icon { --mat-menu-item-icon-size: 12px; @apply text-[12px] mr-0 align-middle; }
      .competition-logo + span { @apply leading-[1.3]; }
    }

    ::ng-deep .filter-menu.mat-mdc-menu-panel {
      @apply min-w-[220px] max-w-[220px] max-h-[70vh] border; // 218px is the width of league-select menu + 2px border
      border-color: var(--rs-button-border-color);

      .mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text {
        @apply flex items-center gap-4;
      }
      .mat-mdc-menu-content .mat-mdc-menu-item.group-title .mat-mdc-menu-item-text {
        @apply font-medium;
      }

      .divider { @apply h-[1px] w-full; background-color: var(--rs-border-color-1); }
    }
  `,
  template: `
    <button
      mat-icon-button
      aria-label="Filter button"
      matTooltip="Filtern"
      #menuTrigger="matMenuTrigger"
      [class.is-filtering]="!!selectedCompetition()"
      [matMenuTriggerFor]="menu"
      [disabled]="!hasFilterOptions()"
      [class.is-open]="menuTrigger.menuOpen"
    >
      <mat-icon>filter_list</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="filter-menu" xPosition="before">
      @for (group of filteredGroups(); track group.label) {
      <button mat-menu-item class="group-title" disabled>
        <span>{{ group.label }}</span>
        <span class="divider"></span>
      </button>
      @for (competition of group.competitions; track competition.id) {
      <button
        mat-menu-item
        (click)="setFilter(competition.id)"
        [class.is-filtering]="isSameId(competition.id)"
      >
        <rs-responsive-image
          class="competition-logo"
          [source]="competition.image"
          [sourceSet]="competition.imageSet"
          [altText]="competition.label"
          [width]="14"
          [height]="14"
        />
        <span>{{ competition.label }}</span>
        @if (isSameId(competition.id)) {
        <mat-icon>close</mat-icon>
        }
      </button>
      } }
    </mat-menu>
  `,
})
export class FilterComponent {
  private readonly facade = inject(WeekdayFixturesStore);
  private readonly standingsStore = inject(FilteredStandingsStore);
  private readonly selectedDateService = inject(SelectedDateService);
  private readonly filterService = inject(FilterService);
  readonly selectedCompetition = this.filterService.selectedCompetition;

  readonly filteredGroups = computed<Array<SelectCompetitionGroup>>(() => {
    const selectedDate = this.selectedDateService.selectedDay();
    const fixtures = this.facade
      .weekFixtures()
      .flat()
      .filter((f) => f.fixture.date.substring(0, 10) === selectedDate);

    const selectableCompetitions = new Set(fixtures.map((f) => f.league.id));
    const filteredCompetitions = SELECT_COMPETITION_DATA.map((group) => ({
      ...group,
      competitions: group.competitions.filter((competition) =>
        selectableCompetitions.has(competition.id)
      ),
    }));

    return filteredCompetitions.filter(
      (group) => group.competitions.length > 0
    );
  });

  readonly hasFilterOptions = computed(() => this.filteredGroups().length > 0);

  filterEffect = effect(() => {
    const id = this.selectedCompetition();
    if (!id) return;
    const date = this.selectedDateService.selectedDay();
    this.standingsStore.loadFilteredStandings(date, id).then(() => {
      this.selectedCompetition.set(id);
    });
  });

  isSameId = (id: CompetitionId) => this.selectedCompetition() === id;

  setFilter(id: CompetitionId): void {
    if (this.selectedCompetition() === id) {
      this.selectedCompetition.set(null);
      this.standingsStore.reset();
      return;
    }

    this.selectedCompetition.set(id);
  }
}
