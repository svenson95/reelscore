import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LeagueService } from '@app/services';
import { StandingsService } from '../../services';
import { TableComponent } from './components';

@Component({
  selector: 'futbet-standings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, TableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (isLoadingStanding() || isLoadingTopFive()) {
    <mat-spinner class="my-10 mx-auto" diameter="20" />
    } @else { @if(isLeagueSelected()) {
    <futbet-standings-table [data]="standing()!" />
    } @else { @for (singleTable of topFiveStandings(); track
    singleTable.league.id) {
    <futbet-standings-table [data]="singleTable" />
    } } }
  `,
})
export class StandingsComponent {
  ls = inject(LeagueService);
  ss = inject(StandingsService);

  standing = this.ss.standing;
  topFiveStandings = this.ss.topFiveStandings;

  isLoadingStanding = computed<boolean>(() => {
    const selectedLeague = this.ls.selectedLeague();
    const isLeagueSelected = selectedLeague !== undefined;
    if (!isLeagueSelected) return false;

    const standing = this.standing();
    const isSame = selectedLeague?.id === String(standing?.league.id);

    return !standing || !isSame;
  });

  isLoadingTopFive = computed<boolean>(() => {
    const selectedLeague = this.ls.selectedLeague();
    if (selectedLeague !== undefined) return false;

    return this.topFiveStandings() === undefined;
  });

  isLeagueSelected = computed<boolean>(() => this.standing() !== undefined);
}
