import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { OptimizedImageComponent } from '@app/components';
import { getCompetitionLogo, getTeamLogo } from '@app/models';
import { TeamNamePipe } from '@app/pipes';
import { BreakpointObserverService } from '@app/services';
import { League, StandingRanks } from '@lib/models';

@Component({
  selector: 'reelscore-standings-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, OptimizedImageComponent, TeamNamePipe],
  styles: `
    :host {
      @apply flex overflow-hidden border;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);
    }

    table {
      --mat-table-header-headline-size: var(--fb-font-size-body-2);
      --mat-table-row-item-label-text-size: var(--fb-font-size-body-2);
      --mat-table-header-container-height: 41px;
      --mat-table-row-item-container-height: 33px;
    }

    td { @apply py-[4px] leading-[16px]; }

    td, th { &:first-of-type {
      @apply pr-0 pl-2 text-center;
    } }

    .mdc-data-table__cell, .mdc-data-table__header-cell {
      &.rank-column { width: 40px; }

      &.number-column {
        padding: 0 5px 0 5px;
        text-align: center;
      }

      &.points-column {
        @apply text-center;
      }

      &.number-column, &.points-column {
        @apply w-[20px] md:w-[30px];
      }
    }

    .name-wrapper {
      @apply flex gap-2;

      span {
        @apply leading-[14px];
      }
    }
  `,
  template: `
    <table mat-table [dataSource]="ranks()">
      <ng-container matColumnDef="rank">
        <th mat-header-cell *matHeaderCellDef class="rank-column">
          <reelscore-optimized-image
            [source]="getCompetitionLogo(league().id)"
            alternate="league logo"
            width="24"
            height="24"
          />
        </th>
        <td mat-cell *matCellDef="let element" class="rank-column">
          {{ element.rank }}
        </td>
      </ng-container>

      <ng-container matColumnDef="team">
        <th mat-header-cell *matHeaderCellDef class="name-column">
          {{ league().name }}
        </th>
        <td mat-cell *matCellDef="let element" class="name-column">
          <div class="name-wrapper">
            <reelscore-optimized-image
              [source]="getTeamLogo(element.team.id)"
              alternate="team logo"
              width="14"
              height="14"
            />
            <span>{{ element.team.name | teamName : 'short' }}</span>
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="played">
        <th mat-header-cell *matHeaderCellDef class="number-column">SP</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.all.played }}
        </td>
      </ng-container>

      <ng-container matColumnDef="win">
        <th mat-header-cell *matHeaderCellDef class="number-column">S</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.all.win }}
        </td>
      </ng-container>

      <ng-container matColumnDef="draw">
        <th mat-header-cell *matHeaderCellDef class="number-column">U</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.all.draw }}
        </td>
      </ng-container>

      <ng-container matColumnDef="lost">
        <th mat-header-cell *matHeaderCellDef class="number-column">N</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.all.lose }}
        </td>
      </ng-container>

      @if (!isMobile()) {
      <ng-container matColumnDef="goalDifference">
        <th mat-header-cell *matHeaderCellDef class="number-column">TD</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.goalsDiff }}
        </td>
      </ng-container>
      }

      <ng-container matColumnDef="points">
        <th mat-header-cell *matHeaderCellDef class="points-column">Pkt</th>
        <td mat-cell *matCellDef="let element" class="points-column">
          {{ element.points }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns()"></tr>
      <tr mat-row *matRowDef="let row; columns: columns()"></tr>
    </table>
  `,
})
export class TableComponent {
  readonly DISPLAYED_COLUMNS: string[] = [
    'rank',
    'team',
    'played',
    'win',
    'draw',
    'lost',
    'goalDifference',
    'points',
  ];

  breakpoint = inject(BreakpointObserverService);
  isMobile = this.breakpoint.isMobile;
  ranks = input.required<StandingRanks[]>();
  league = input.required<League>();

  getTeamLogo = getTeamLogo;
  getCompetitionLogo = getCompetitionLogo;

  columns = computed(() => {
    const filtered = this.DISPLAYED_COLUMNS.filter(
      (column) => column !== 'goalDifference'
    );
    return this.isMobile() ? filtered : this.DISPLAYED_COLUMNS;
  });
}
