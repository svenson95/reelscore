import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { StandingsDTO } from '../../../../../../models';

@Component({
  selector: 'futbet-league-standings-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTableModule],
  styles: `
    :host {
      @apply w-full;
    }

    table {
      --mat-table-header-headline-size: var(--fb-font-size-small);
      --mat-table-row-item-label-text-size: var(--fb-font-size-small);
      --mat-table-header-container-height: 47px;
      --mat-table-row-item-container-height: 25px;
    }

    .mdc-data-table__cell, .mdc-data-table__header-cell {
      &.name-column {
        min-width: 150px;
      }

      &.number-column {
        padding: 0 4px 0 4px;
        text-align: center;
      }
    }
  `,
  template: `
    <table mat-table [dataSource]="data().league.standings![0]">
      <ng-container matColumnDef="rank">
        <th mat-header-cell *matHeaderCellDef>#</th>
        <td mat-cell *matCellDef="let element">{{ element.rank }}</td>
      </ng-container>

      <ng-container matColumnDef="team">
        <th mat-header-cell *matHeaderCellDef class="name-column">
          Mannschaft
        </th>
        <td mat-cell *matCellDef="let element" class="name-column">
          {{ element.team.name }}
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
        <th mat-header-cell *matHeaderCellDef class="number-column">V</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.all.lose }}
        </td>
      </ng-container>

      <ng-container matColumnDef="goalDifference">
        <th mat-header-cell *matHeaderCellDef class="number-column">TD</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.goalsDiff }}
        </td>
      </ng-container>

      <ng-container matColumnDef="goalsFor">
        <th mat-header-cell *matHeaderCellDef class="number-column">+</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.all.goals.for }}
        </td>
      </ng-container>

      <ng-container matColumnDef="goalsAgainst">
        <th mat-header-cell *matHeaderCellDef class="number-column">-</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.all.goals.against }}
        </td>
      </ng-container>

      <ng-container matColumnDef="points">
        <th mat-header-cell *matHeaderCellDef>Pkt</th>
        <td mat-cell *matCellDef="let element">
          {{ element.points }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class TableComponent {
  readonly displayedColumns: string[] = [
    'rank',
    'team',
    'played',
    'win',
    'draw',
    'lost',
    'goalDifference',
    'goalsFor',
    'goalsAgainst',
    'points',
  ];

  data = input.required<StandingsDTO>();
}
