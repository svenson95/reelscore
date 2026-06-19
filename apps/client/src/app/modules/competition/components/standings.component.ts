import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import {
  StandingsTableComponent,
  hasMultipleGroups,
  showHomeAndAwayStandings,
} from '@app/shared';

import { CompetitionStandingsStore } from '../store';

@Component({
  selector: 'rs-competition-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  styles: `
    :host { @apply rs-competition-tab gap-rs2 flex-wrap items-start justify-center; }
    .home-and-away-standings {
      @apply flex gap-rs2 flex-col md:flex-row;

      rs-standings-table { @apply flex-1; }
    }
  `,
  template: `
    @let leagueData = league(); @let groups = standingGroups(); @if (leagueData
    && groups.length) { @if (hasMultipleGroups()) { @for (multipleStanding of
    groups; track $index) {
    <rs-standings-table [ranks]="multipleStanding" [league]="leagueData" />
    } } @else {
    <rs-standings-table [ranks]="groups[0]" [league]="leagueData" />

    @if (showHomeAndAwayStandings()) {
    <div class="home-and-away-standings">
      <rs-standings-table
        [ranks]="groups[1]"
        [league]="leagueData"
        header="Heimtabelle"
      />

      <rs-standings-table
        [ranks]="groups[2]"
        [league]="leagueData"
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
  private readonly store = inject(CompetitionStandingsStore);

  private readonly standings = this.store.standings;
  readonly isLoading = this.store.isLoading;

  readonly league = computed(() => this.standings()?.league ?? null);

  readonly standingGroups = computed(
    () => this.standings()?.league.standings ?? []
  );

  readonly hasMultipleGroups = computed<boolean>(() => {
    const standings = this.standings();
    if (standings === null) return false;

    return hasMultipleGroups(standings);
  });

  readonly showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.standings();
    if (standings === null) return false;

    return showHomeAndAwayStandings(standings);
  });
}
