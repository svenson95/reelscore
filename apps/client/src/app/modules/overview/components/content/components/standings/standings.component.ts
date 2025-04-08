import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { StandingsTableComponent } from '@app/shared';
import { StandingsDTO } from '@lib/models';

import { OverviewStandingsFacade } from './standings.facade';

@Component({
  selector: 'rs-overview-standings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StandingsTableComponent],
  providers: [OverviewStandingsFacade],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @let filteredStandings = dayStandings(); @let ws = weekStandings(); @if
    (isFiltering() && filteredStandings) { @if (hasMultipleGroups()) { @for
    (multipleStanding of filteredStandings.league.standings; track $index) {
    <rs-standings-table
      class="animate-fade-in"
      [ranks]="multipleStanding"
      [league]="filteredStandings.league"
    />
    } } @else {
    <rs-standings-table
      class="animate-fade-in"
      [ranks]="filteredStandings.league.standings![0]"
      [league]="filteredStandings.league"
    />

    @if (showHomeAndAwayStandings()) {
    <rs-standings-table
      class="animate-fade-in"
      [ranks]="filteredStandings.league.standings![1]"
      [league]="filteredStandings.league"
      header="Heimtabelle"
    />
    <rs-standings-table
      class="animate-fade-in"
      [ranks]="filteredStandings.league.standings![2]"
      [league]="filteredStandings.league"
      header="Auswärtstabelle"
    />
    } } } @else if (isLoading()) {
    <p class="no-data">Tabellen werden geladen ...</p>
    } @else if (error()) {
    <p class="no-data">Fehler beim Laden der Tabellen.</p>
    } @else if (showTopFive()) { @for (standing of ws; track $index) {
    <rs-standings-table
      class="animate-fade-in"
      [ranks]="standing.league.standings![0]"
      [league]="standing.league"
    />
    } } @else if (!isLoading()) {
    <p class="no-data">Keine Tabellen gefunden.</p>
    }
  `,
})
export class OverviewStandingsComponent {
  weekStandings = input.required<StandingsDTO[]>();
  isLoading = input.required<boolean>();
  error = input.required<string | null>();

  facade = inject(OverviewStandingsFacade);
  dayStandings = this.facade.dayStandings;
  isFiltering = this.facade.isFilwtering;
  hasMultipleGroups = this.facade.hasMultipleGroups;
  showHomeAndAwayStandings = this.facade.showHomeAndAwayStandings;

  // TODO check if this signal can be moved to facade, depend on weekStandings is a problem (1/2)
  showTopFive = computed<boolean>(() => {
    const standings = this.weekStandings();
    if (!standings) return false;
    return standings.length === 5;
  });
}
