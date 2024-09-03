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

import { OptimizedImageComponent } from '@app/components';
import { SELECT_COMPETITION_DATA } from '@app/constants';
import { DateService } from '@app/services';
import { CompetitionId } from '@lib/models';
import { FilterService } from '../../../../services';
import { StandingStore } from '../../../../store';

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
    button[mat-menu-item] { 
        --mat-menu-item-label-text-size: var(--fb-font-size-small);
        --mat-menu-item-label-text-line-height: var(--fb-font-size-small);
        --mat-menu-item-icon-color: var(--fb-color-white-2);
        @apply min-h-[32px];
    }
    button.mdc-icon-button, button.mat-mdc-menu-item {
        &.is-filtering { @apply bg-blue-500 text-fb-color-white; }
    }
    ::ng-deep {
        .filter-menu .mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text { 
            @apply flex items-center gap-2;
        }

        .mat-mdc-menu-panel {
            max-height: 70vh;
        }
    }
    .mat-mdc-menu-item {
        .mat-icon { --mat-menu-item-icon-size: 12px; font-size: 12px; margin-right: 0; }
        .reset-button { @apply ml-auto; }
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
    <mat-menu #menu="matMenu" class="filter-menu">
      @for (group of groups; track group.label) {
      <button mat-menu-item class="group-title" disabled>
        {{ group.label }}
      </button>
      @for (competition of group.competitions; track competition.id) {
      <button
        mat-menu-item
        (click)="setFilter(competition.id)"
        [class.is-filtering]="selectedCompetition() === competition.id"
      >
        <reelscore-optimized-image
          [source]="competition.image"
          [alternate]="competition.label"
          width="14"
          height="14"
        />
        <span>{{ competition.label }}</span>
        <button class="reset-button">
          <mat-icon>close</mat-icon>
        </button>
      </button>
      } }
    </mat-menu>
  `,
})
export class FilterButtonComponent {
  groups = SELECT_COMPETITION_DATA;
  standingStore = inject(StandingStore);
  dateService = inject(DateService);
  fs = inject(FilterService);
  selectedCompetition = this.fs.selectedCompetition;

  setFilter(id: CompetitionId) {
    if (this.selectedCompetition() === id) {
      this.selectedCompetition.set(null);
      this.standingStore.reset();
    } else {
      this.updateStanding(id);
    }
  }

  updateStanding(id: CompetitionId): void {
    const date = this.dateService.selectedDay();
    this.standingStore.loadStanding(date, id).then(() => {
      this.selectedCompetition.set(id);
    });
  }

  dateEffect = effect(
    () => {
      const id = this.selectedCompetition();
      if (id) this.updateStanding(id);
    },
    { allowSignalWrites: true }
  );
}
