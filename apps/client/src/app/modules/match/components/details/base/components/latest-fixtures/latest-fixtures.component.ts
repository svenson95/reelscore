import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { FixtureStore, LatestFixturesStore } from '../../../../../store';

import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'rs-match-latest-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixturesTableComponent],
  styles: `
    :host { @apply flex flex-col; }
    .latest-fixtures-container { 
      @apply flex flex-col md:flex-row bg-white px-5 pb-5 pt-4 mt-5 gap-5; 

      border-width: 1px;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);
    }
    rs-match-fixtures-table:first-of-type {
      @apply pb-5 md:pb-0 md:pr-5 border-b-[1px] md:border-b-0 md:border-r-[1px]; 
    }
    .no-data { @apply m-auto; }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    <div class="latest-fixtures-container">
      @let lf = latestFixtures(); @if (isLoading()) {
      <p class="no-data">Spiele werden geladen ...</p>
      } @else if (error()) {
      <p class="no-data">Fehler beim Laden der Spiele.</p>
      } @else if (!lf) {
      <p class="no-data">Keine Spiele gefunden.</p>
      } @else { @let d = data(); @if (d) {
      <rs-match-fixtures-table [team]="d.teams.home" [fixtures]="lf.home" />
      <rs-match-fixtures-table [team]="d.teams.away" [fixtures]="lf.away" />
      } }
    </div>
  `,
})
export class MatchLatestFixturesComponent {
  private latestFixturesStore = inject(LatestFixturesStore);
  isLoading = computed(() => this.latestFixturesStore.isLoading());
  error = computed(() => this.latestFixturesStore.error());
  latestFixtures = computed(() => this.latestFixturesStore.latestFixtures());

  private fixtureStore = inject(FixtureStore);
  data = computed(() => this.fixtureStore.fixture()?.data);
}
