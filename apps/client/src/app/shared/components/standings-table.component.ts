import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { CompetitionId, League, StandingRanks } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

import { SELECT_COMPETITION_DATA_FLAT } from '../constants';
import {
  getCompetitionLogo,
  getCompetitionLogoSrcSet,
  getTeamLogo,
  getTeamLogoSrcSet,
} from '../models';
import { TeamNamePipe } from '../pipes';
import { BreakpointObserverService } from '../services';

import { ResponsiveImageComponent } from './responsive-image/responsive-image.component';

const EXTERNAL_IMPORTS = [RouterLink, MatTableModule];

@Pipe({ name: 'getTeamLogo' })
export class GetTeamLogoPipe implements PipeTransform {
  transform(id: number): string {
    return getTeamLogo(id, 14);
  }
}

@Pipe({ name: 'getTeamLogoSet' })
export class GetTeamLogoSetPipe implements PipeTransform {
  transform(id: number): string {
    return getTeamLogoSrcSet(id, 14);
  }
}

@Pipe({ name: 'hasMultipleGroups' })
export class HasMultipleGroupsPipe implements PipeTransform {
  transform(id: CompetitionId): boolean {
    return isCompetitionWithMultipleGroups(id);
  }
}

const DISPLAYED_COLUMNS: string[] = [
  'rank',
  'team',
  'played',
  'win',
  'draw',
  'lost',
  'goalDifference',
  'points',
] as const;

@Component({
  selector: 'rs-standings-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...EXTERNAL_IMPORTS,
    ResponsiveImageComponent,
    TeamNamePipe,
    GetTeamLogoPipe,
    GetTeamLogoSetPipe,
    HasMultipleGroupsPipe,
  ],
  styles: `
    :host {
      @apply flex overflow-hidden shadow-rs2;
      border: 1px solid var(--rs-button-border-color);
      border-radius: var(--mat-standard-button-toggle-shape);
      --mat-table-background-color: var(--rs-color-text-3);
    }

    table {
      --mat-table-header-headline-size: var(--rs-font-size-body-2);
      --mat-table-row-item-label-text-size: var(--rs-font-size-body-2);
      --mat-table-header-container-height: 41px;
      --mat-table-row-item-container-height: 33px;
      --mat-table-row-item-outline-color: var(--mat-standard-button-toggle-divider-color);
    }

    td { @apply py-[4px]; }

    th:first-of-type { @apply bg-white; }

    td, th {
      @apply leading-[14px];

      &:first-of-type {
        @apply text-center justify-items-center;
      }
    }

    .mdc-data-table__cell, .mdc-data-table__header-cell {
      &.rank-column { width: 40px; padding-inline: 8px; }

      &.number-column {
        @apply px-1;
      }

      &.points-column {
        @apply pl-2;
      }

      &.number-column, &.points-column {
        @apply w-[25px] lg:w-[30px] text-center;
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
          <div class="competition-logo-small">
            @defer (on viewport) {
            <rs-responsive-image
              [source]="competitionLogo()"
              [sourceSet]="competitionLogoSet()"
              altText=""
              [width]="24"
              [height]="24"
            />
            } @placeholder {
            <div class="competition-logo-small-placeholder"></div>
            }
          </div>
        </th>
        <td mat-cell *matCellDef="let element" class="rank-column">
          {{ element.rank }}
        </td>
      </ng-container>

      <ng-container matColumnDef="team">
        <th mat-header-cell *matHeaderCellDef class="name-column">
          <a [routerLink]="competitionLink()">
            @if (league().id | hasMultipleGroups) {
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
            <div class="team-logo-small">
              @defer (on viewport) {
              <rs-responsive-image
                [source]="element.team.id | getTeamLogo"
                [sourceSet]="element.team.id | getTeamLogoSet"
                altText=""
                [width]="14"
                [height]="14"
              />
              } @placeholder {
              <div class="team-logo-small-placeholder"></div>
              }
            </div>
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
          @switch(type()) { @case ('home') {
          {{ element.home.goals.for - element.home.goals.against }}
          } @case ('away') {
          {{ element.away.goals.for - element.away.goals.against }}
          } @default {
          {{ element.goalsDiff }}
          } }
        </td>
      </ng-container>
      }

      <ng-container matColumnDef="points">
        <th mat-header-cell *matHeaderCellDef class="points-column">Pkt</th>
        <td mat-cell *matCellDef="let element" class="points-column">
          @switch(type()) { @case ('home') {
          {{ element.home.win * 3 + element.home.draw }}
          } @case ('away') {
          {{ element.away.win * 3 + element.away.draw }}
          } @default {
          {{ element.points }}
          } }
        </td>
      </ng-container>

      @let columns = this.columns();
      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
})
export class StandingsTableComponent {
  readonly ranks = input.required<StandingRanks[]>();
  readonly league = input.required<League>();
  readonly header = input<string>();

  private readonly breakpoint = inject(BreakpointObserverService);
  readonly isMobile = this.breakpoint.isMobile;

  readonly type = computed<'all' | 'home' | 'away'>(() => {
    switch (this.header()) {
      case 'Heimtabelle':
        return 'home';
      case 'Auswärtstabelle':
        return 'away';
      default:
        return 'all';
    }
  });

  readonly competitionLogo = computed(() =>
    getCompetitionLogo(this.league().id, 24)
  );
  readonly competitionLogoSet = computed(() =>
    getCompetitionLogoSrcSet(this.league().id, 24)
  );
  readonly competitionLink = computed(() => {
    const id = this.league().id;
    const competition = SELECT_COMPETITION_DATA_FLAT.find((c) => c.id === id);
    return competition ? ['/', 'competition', competition.url] : ['/'];
  });

  readonly columns = computed(() => {
    const filtered = DISPLAYED_COLUMNS.filter((c) => c !== 'goalDifference');
    return this.isMobile() ? filtered : DISPLAYED_COLUMNS;
  });

  readonly roundLabel = computed(() => {
    const firstRank = this.ranks()[0];

    if (!firstRank?.group) {
      return this.header() ?? this.league().name;
    }

    const round = firstRank.group;
    const isGroupCompetition = round.includes('Group');
    const isLeagueCompetition = round.includes('League');

    if (isLeagueCompetition && isGroupCompetition) {
      const [leaguePart, groupPart] = round.split(',');
      const league = leaguePart.trim().replace('League', 'Liga');
      const group = groupPart.trim().replace('Group', 'Gruppe');
      return `${league} ${group}`;
    }

    if (isGroupCompetition) {
      return round.replace('Group', 'Gruppe');
    }

    if (round === 'Ranking of third-placed teams') {
      return 'Rangliste der Drittplatzierten';
    }

    return round;
  });
}
