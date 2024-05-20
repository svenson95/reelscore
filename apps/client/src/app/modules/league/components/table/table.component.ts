import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { LeagueStanding } from '../../../../models';

@Component({
  selector: 'futbet-league-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule],
  styles: `
    table {
      --mat-table-header-headline-size: 11px;
      --mat-table-row-item-label-text-size: 11px;
      --mat-table-header-container-height: 36px;
      --mat-table-row-item-container-height: 32px;
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
    <table mat-table [dataSource]="league().list">
      <ng-container matColumnDef="rank">
        <th mat-header-cell *matHeaderCellDef>#</th>
        <td mat-cell *matCellDef="let element">{{ element.rank }}</td>
      </ng-container>

      <ng-container matColumnDef="team">
        <th mat-header-cell *matHeaderCellDef class="name-column">
          Mannschaft
        </th>
        <td mat-cell *matCellDef="let element" class="name-column">
          {{ element.team }}
        </td>
      </ng-container>

      <ng-container matColumnDef="played">
        <th mat-header-cell *matHeaderCellDef class="number-column">SP</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.played }}
        </td>
      </ng-container>

      <ng-container matColumnDef="win">
        <th mat-header-cell *matHeaderCellDef class="number-column">S</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.played }}
        </td>
      </ng-container>

      <ng-container matColumnDef="draw">
        <th mat-header-cell *matHeaderCellDef class="number-column">U</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.draw }}
        </td>
      </ng-container>

      <ng-container matColumnDef="lost">
        <th mat-header-cell *matHeaderCellDef class="number-column">V</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.lost }}
        </td>
      </ng-container>

      <ng-container matColumnDef="goalDifference">
        <th mat-header-cell *matHeaderCellDef class="number-column">TD</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.goalDifference }}
        </td>
      </ng-container>

      <ng-container matColumnDef="goalsFor">
        <th mat-header-cell *matHeaderCellDef class="number-column">+</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.goalsFor }}
        </td>
      </ng-container>

      <ng-container matColumnDef="goalsAgainst">
        <th mat-header-cell *matHeaderCellDef class="number-column">-</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element.goalsAgainst }}
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
  displayedColumns: string[] = [
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
  league = input.required<LeagueStanding>();
}
