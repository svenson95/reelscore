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

import {
  DateService,
  FilterService,
  OptimizedImageComponent,
  SELECT_COMPETITION_DATA,
  StandingsStore,
} from '@app/shared';
import { CompetitionId } from '@lib/models';

@Component({
  selector: 'reelscore-filter-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    OptimizedImageComponent,
  ],
  styles: `
    button[mat-icon-button].is-filtering { @apply bg-blue-500 text-fb-color-white; }
    button[mat-menu-item] { 
      --mat-menu-item-label-text-size: var(--fb-font-size-small);
      --mat-menu-item-label-text-line-height: var(--fb-font-size-small);
      --mat-menu-item-icon-color: var(--fb-color-white-2);
      @apply min-h-[32px];

      .mat-icon { --mat-menu-item-icon-size: 12px; @apply text-[12px] mr-0 align-middle; }

      &.is-filtering { 
        @apply bg-fb-color-white-2; --mat-menu-item-icon-color: var(--fb-color-text-1);
        mat-icon { @apply absolute right-4; }
      }
    }
    ::ng-deep .filter-menu.mat-mdc-menu-panel {
      @apply min-w-[220px] max-h-[70vh];

      .mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text { 
        @apply flex items-center gap-2;
      }
    }
    .divider { @apply h-[1px] w-full bg-[#bababa]; }
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
        <reelscore-optimized-image
          [source]="competition.image"
          [alternate]="competition.label"
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
  standingsStore = inject(StandingsStore);
  dateService = inject(DateService);
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

  filterEffect = effect(
    () => {
      const id = this.selectedCompetition();
      if (id) this.updateStanding(id);
    },
    { allowSignalWrites: true }
  );

  updateStanding(id: CompetitionId): void {
    const date = this.dateService.selectedDay();
    this.standingsStore.loadStanding(date, id).then(() => {
      this.selectedCompetition.set(id);
    });
  }
}
