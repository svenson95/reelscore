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
  `, // TODO refactor template
  template: `
    @if (isLeagueSelected()) { @if (isLoadingStanding()) {
    <mat-spinner class="my-10 mx-auto" diameter="20" />
    } @else if (standing() === null) {
    <p class="no-data">Keine Tabelle gefunden.</p>
    } @else {
    <futbet-standings-table [data]="standing()!" />
    } } @else { @if (isLoadingTopFive()) {
    <mat-spinner class="my-10 mx-auto" diameter="20" />
    } @else if (topFiveStandings() === null) {
    <p class="no-data">Keine Tabelle gefunden.</p>
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

  isLeagueSelected = computed<boolean>(() => {
    return this.ls.selectedLeague() !== undefined;
  });

  isLoadingStanding = computed<boolean>(() => {
    const selectedLeague = this.ls.selectedLeague();
    const isLeagueSelected = selectedLeague !== undefined;
    if (!isLeagueSelected) return false;

    const data = this.standing();
    return data === undefined;
  });

  isLoadingTopFive = computed<boolean>(() => {
    const selectedLeague = this.ls.selectedLeague();
    if (selectedLeague !== undefined) return false;

    const data = this.topFiveStandings();
    return data === undefined;
  });
}
