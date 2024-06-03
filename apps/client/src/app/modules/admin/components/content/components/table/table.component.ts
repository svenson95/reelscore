import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  catchError,
  map,
  merge,
  of as observableOf,
  startWith,
  switchMap,
} from 'rxjs';

import { GetAllFixturesDTO, MatchDTO } from '@lib/models';

import { DatabaseService } from '../../../../service/database.service';

@Component({
  selector: 'futbet-admin-content-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  styles: `
    :host { @apply flex flex-col py-2 px-5 bg-white relative; }
    td { @apply text-fb-font-size-small; }
    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  template: `
    @if (isLoadingResults()) {
    <div class="loading-shade">
      @if (isLoadingResults()) {
      <mat-spinner diameter="20"></mat-spinner>
      }
    </div>
    }

    <table
      mat-table
      [dataSource]="data()!"
      matSort
      matSortActive="date"
      matSortDisableClear
      matSortDirection="desc"
    >
      <ng-container matColumnDef="_id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>_id</th>
        <td mat-cell *matCellDef="let element">{{ element?._id }}</td>
      </ng-container>

      <ng-container matColumnDef="fixtureId">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>fixtureId</th>
        <td mat-cell *matCellDef="let element">{{ element?.fixture?.id }}</td>
      </ng-container>

      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>date</th>
        <td mat-cell *matCellDef="let element">
          {{ element?.fixture?.date | date : 'dd.MM.yy | HH:mm' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="league">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>league</th>
        <td mat-cell *matCellDef="let element">{{ element?.league?.name }}</td>
      </ng-container>

      <ng-container matColumnDef="round">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>round</th>
        <td mat-cell *matCellDef="let element">
          {{ element?.league?.round }}
        </td>
      </ng-container>

      <ng-container matColumnDef="home">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>home</th>
        <td mat-cell *matCellDef="let element">
          {{ element?.teams?.home.name }}
        </td>
      </ng-container>

      <ng-container matColumnDef="away">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>away</th>
        <td mat-cell *matCellDef="let element">
          {{ element?.teams?.away.name }}
        </td>
      </ng-container>

      <ng-container matColumnDef="score">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>score</th>
        <td mat-cell *matCellDef="let element">
          {{ element?.score?.fulltime.home }} -
          {{ element?.score?.fulltime.away }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <mat-paginator
      [length]="allDataLength()"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      showFirstLastButtons
      aria-label="Select page of fixtures search results"
    ></mat-paginator>
  `,
})
export class TableComponent implements AfterViewInit {
  readonly pageSize = 10;
  readonly pageSizeOptions = [10, 20, 50, 250];
  readonly displayedColumns = [
    '_id',
    'fixtureId',
    'date',
    'league',
    'round',
    'home',
    'away',
    'score',
  ];

  ds = inject(DatabaseService);
  destroyRef = inject(DestroyRef);

  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);

  data = signal<MatTableDataSource<MatchDTO, MatPaginator> | null>(null);
  allDataLength = signal<number>(0);

  isLoadingResults = signal<boolean>(true);

  ngAfterViewInit(): void {
    this.sort()
      .sortChange.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.paginator().pageIndex = 0));

    merge(this.sort().sortChange, this.paginator().page)
      .pipe(
        startWith({}),
        switchMap(() => this.retrieveData()),
        map((r) => this.processData(r)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        const dataSource = new MatTableDataSource<MatchDTO>(data);
        this.data.set(dataSource);
      });
  }

  private retrieveData() {
    this.isLoadingResults.set(true);
    return this.ds
      .getTableData(
        this.sort().active,
        this.sort().direction,
        this.paginator().pageIndex,
        this.paginator().pageSize
      )
      .pipe(catchError(() => observableOf(null)));
  }

  private processData(response: GetAllFixturesDTO | null) {
    this.isLoadingResults.set(false);
    if (response === null) return [];

    this.allDataLength.set(response.length);
    return response.data;
  }
}
