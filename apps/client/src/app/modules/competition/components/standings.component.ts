import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { StandingsTableComponent } from '@app/shared';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

import { CompetitionStandingsStore } from '../store';

@Component({
  selector: 'rs-competition-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
    .home-and-away-standings { 
      @apply flex gap-5 flex-col md:flex-row; 

      rs-standings-table { @apply flex-1; }
    }
  `,
  template: `
    @let data = standings(); @if (data !== null) { @if (hasMultipleGroups()) {
    @for (multipleStanding of data.league.standings; track $index) {
    <rs-standings-table [ranks]="multipleStanding" [league]="data.league" />
    } } @else {
    <rs-standings-table
      [ranks]="data.league.standings![0]"
      [league]="data.league"
    />
    @if (showHomeAndAwayStandings()) {
    <div class="home-and-away-standings">
      <rs-standings-table
        [ranks]="data.league.standings![1]"
        [league]="data.league"
        header="Heimtabelle"
      />
      <rs-standings-table
        [ranks]="data.league.standings![2]"
        [league]="data.league"
        header="Auswärtstabelle"
      />
    </div>
    } } } @else if (isLoading()) {
    <p class="no-data">Tabelle wird geladen ...</p>
    } @else {
    <p class="no-data">Keine Tabelle vorhanden</p>
    }
  `,
})
export class CompetitionStandingsComponent {
  private store = inject(CompetitionStandingsStore);
  standings = this.store.standings;
  isLoading = this.store.isLoading;

  hasMultipleGroups = computed<boolean>(() => {
    const standings = this.standings();
    if (!standings) return false;
    return isCompetitionWithMultipleGroups(standings.league.id);
  });

  showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.standings();
    if (!standings) return false;
    return standings.league.standings?.length === 3;
  });
}
