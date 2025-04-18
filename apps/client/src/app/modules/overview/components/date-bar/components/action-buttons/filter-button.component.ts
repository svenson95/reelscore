import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CompetitionId } from '@lib/models';

import {
  OptimizedImageComponent,
  SELECT_COMPETITION_DATA,
} from '../../../../../../shared';
import { FilterService, SelectedDateService } from '../../../../services';
import { FilteredStandingsStore } from '../../../../store';

@Component({
  selector: 'rs-filter-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    OptimizedImageComponent,
  ],
  styles: `
    button[mat-icon-button].is-filtering { @apply bg-blue-500 text-rs-color-white; }
    button[mat-menu-item] { 
      --mat-menu-item-label-text-size: var(--rs-font-size-small);
      --mat-menu-item-label-text-line-height: var(--rs-font-size-small);
      --mat-menu-item-icon-color: var(--rs-color-white-2);
      
      @apply py-1;

      &:not(.group-title) { @apply min-h-[32px]; }
      &.group-title { @apply min-h-[48px]; }

      &.is-filtering { 
        @apply bg-rs-color-white-2; --mat-menu-item-icon-color: var(--rs-color-text-1);
        mat-icon { @apply absolute right-4; }
      }
      
      mat-icon { --mat-menu-item-icon-size: 12px; @apply text-[12px] mr-0 align-middle; }
      .competition-logo + span { @apply leading-[1.3]; }
    }

    ::ng-deep .filter-menu.mat-mdc-menu-panel {
      @apply min-w-[220px] max-w-[220px] max-h-[70vh]; // 218px is the width of league-select menu + 2px border

      .mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text { 
        @apply flex items-center gap-2;
      }
      .mat-mdc-menu-content .mat-mdc-menu-item.group-title .mat-mdc-menu-item-text {
        @apply font-medium;
      }
      
      .divider { @apply h-[1px] w-full bg-[#bababa]; }
    }
  `,
  template: `
    <button
      mat-icon-button
      aria-label="Filter button"
      matTooltip="Filtern"
      [class.is-filtering]="!!selectedCompetition()"
      [matMenuTriggerFor]="menu"
    >
      <mat-icon>filter_list</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="filter-menu" xPosition="before">
      @for (group of groups; track group.label) {
      <button mat-menu-item class="group-title" disabled>
        <span>{{ group.label }}</span>
        <div class="divider"></div>
      </button>
      @for (competition of group.competitions; track competition.id) {
      <button
        mat-menu-item
        (click)="setFilter(competition.id)"
        [class.is-filtering]="isSameId(competition.id)"
      >
        <rs-optimized-image
          class="competition-logo"
          [source]="competition.image"
          [altText]="competition.label"
          width="14"
          height="14"
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
export class FilterButtonComponent {
  groups = SELECT_COMPETITION_DATA;
  standingsStore = inject(FilteredStandingsStore);
  selectedDateService = inject(SelectedDateService);
  filterService = inject(FilterService);
  selectedCompetition = this.filterService.selectedCompetition;

  isSameId = (id: CompetitionId) => this.selectedCompetition() === id;

  setFilter(id: CompetitionId) {
    const isSameId = this.isSameId(id);
    this.selectedCompetition.set(isSameId ? null : id);
    if (isSameId) {
      this.standingsStore.reset();
    }
  }

  filterEffect = effect(() => {
    const id = this.selectedCompetition();
    if (id) this.updateStanding(id);
  });

  updateStanding(id: CompetitionId): void {
    const date = this.selectedDateService.selectedDay();
    this.standingsStore.loadFilteredStandings(date, id).then(() => {
      this.selectedCompetition.set(id);
    });
  }
}
