import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { OptimizedImageComponent } from '@app/components';
import { SELECT_COMPETITION_DATA_FLAT } from '@app/constants';
import { getCompetitionLogo, getTeamLogo } from '@app/models';
import { TeamNamePipe } from '@app/pipes';
import { BreakpointObserverService } from '@app/services';
import { CompetitionId, League, StandingRanks } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

@Component({
  selector: 'reelscore-standings-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatTableModule, OptimizedImageComponent, TeamNamePipe],
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

    td { @apply py-[4px]; }

    td, th { 
      @apply leading-[14px];

      &:first-of-type {
        @apply pr-0 pl-2 text-center;
      } 
    }

    .mdc-data-table__cell, .mdc-data-table__header-cell {
      &.rank-column { width: 40px; }

      &.number-column {
        @apply px-1;
      }

      &.points-column {
        @apply px-2;
      }

      &.number-column, &.points-column {
        @apply w-[20px] lg:w-[30px] text-center;
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
          <a [routerLink]="competitionRouterLink(league().id)">
            @if (hasMultipleGroups(league().id)) {
            {{ roundLabel() }}
            } @else if (header()) {
            {{ header() }}
            } @else {
            {{ league().name }}
            }
          </a>
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
          {{ element[type()].played }}
        </td>
      </ng-container>

      <ng-container matColumnDef="win">
        <th mat-header-cell *matHeaderCellDef class="number-column">S</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element[type()].win }}
        </td>
      </ng-container>

      <ng-container matColumnDef="draw">
        <th mat-header-cell *matHeaderCellDef class="number-column">U</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element[type()].draw }}
        </td>
      </ng-container>

      <ng-container matColumnDef="lost">
        <th mat-header-cell *matHeaderCellDef class="number-column">N</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          {{ element[type()].lose }}
        </td>
      </ng-container>

      @if (!isMobile()) {
      <ng-container matColumnDef="goalDifference">
        <th mat-header-cell *matHeaderCellDef class="number-column">TD</th>
        <td mat-cell *matCellDef="let element" class="number-column">
          @switch(header()) { @case ('Heimtabelle') {
          {{ element.home.goals.for - element.home.goals.against }}
          } @case ('Auswärtstabelle') {
          {{ element.away.goals.for - element.away.goals.against }}
          } @case (undefined) {
          {{ element.goalsDiff }}
          } }
        </td>
      </ng-container>
      }

      <ng-container matColumnDef="points">
        <th mat-header-cell *matHeaderCellDef class="points-column">Pkt</th>
        <td mat-cell *matCellDef="let element" class="points-column">
          @switch(header()) { @case ('Heimtabelle') {
          {{ element.home.win * 3 + element.home.draw }}
          } @case ('Auswärtstabelle') {
          {{ element.away.win * 3 + element.away.draw }}
          } @case (undefined) {
          {{ element.points }}
          } }
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns()"></tr>
      <tr mat-row *matRowDef="let row; columns: columns()"></tr>
    </table>
  `,
})
export class StandingsTableComponent {
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

  ranks = input.required<StandingRanks[]>();
  league = input.required<League>();
  header = input<string>();

  breakpoint = inject(BreakpointObserverService);
  isMobile = this.breakpoint.isMobile;

  type = computed<'all' | 'home' | 'away'>(() => {
    switch (this.header()) {
      case 'Heimtabelle':
        return 'home';
      case 'Auswärtstabelle':
        return 'away';
      default:
        return 'all';
    }
  });

  getTeamLogo = getTeamLogo;
  getCompetitionLogo = getCompetitionLogo;

  columns = computed(() => {
    const filtered = this.DISPLAYED_COLUMNS.filter(
      (column) => column !== 'goalDifference'
    );
    return this.isMobile() ? filtered : this.DISPLAYED_COLUMNS;
  });

  roundLabel = computed(() => {
    const round = this.ranks()[0].group;
    const isGroupCompetition = round.includes('Group');
    const isLeagueCompetition = round.includes('League');

    if (isLeagueCompetition && isGroupCompetition) {
      const [leaguePart, groupPart] = round.split(',');
      const league = leaguePart.replace('League', 'Liga');
      const group = groupPart.replace('Group', 'Gruppe');
      return `${league} ${group}`;
    } else if (isGroupCompetition) {
      return `${round.replace('Group', 'Gruppe')}`;
    } else if (round === 'Ranking of third-placed teams') {
      return 'Rangliste der Drittplatzierten';
    }
    return `${round}`;
  });

  competitionRouterLink(id: CompetitionId): string[] {
    const competition = SELECT_COMPETITION_DATA_FLAT.find((c) => c.id === id);
    if (!competition) throw new Error(`Competition not found (${id})`);
    return ['/', 'leagues', competition.url];
  }

  hasMultipleGroups = isCompetitionWithMultipleGroups;
}
