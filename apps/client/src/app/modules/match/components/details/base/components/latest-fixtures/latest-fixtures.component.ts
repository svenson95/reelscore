import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { FixtureStore, LatestFixturesStore } from '../../../../../store';
import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'reelscore-match-latest-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixturesTableComponent],
  styles: `
    :host { @apply flex flex-col; }
    section { 
      @apply flex flex-col md:flex-row bg-white px-5 pb-5 pt-4 mt-5 gap-5; 

      border-width: 1px;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);
    }
    reelscore-match-fixtures-table:first-of-type {
      @apply pb-5 md:pb-0 md:pr-5 border-b-[1px] md:border-b-0 md:border-r-[1px]; 
    }
    .no-data { @apply m-auto; }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    <section>
      @if (latestFixturesStore.isLoading()) {
      <p class="no-data">Spiele werden geladen ...</p>
      } @else if (latestFixturesStore.error()) {
      <p class="no-data">Fehler beim Laden der Spiele.</p>
      } @else if (!latestFixturesStore.latestFixtures()) {
      <p class="no-data">Keine Spiele gefunden.</p>
      } @else { @if (latestFixturesStore.latestFixtures()) {
      <reelscore-match-fixtures-table
        [team]="data()!.teams.home"
        [fixtures]="latestFixturesStore.latestFixtures()!.home"
      />
      <reelscore-match-fixtures-table
        [team]="data()!.teams.away"
        [fixtures]="latestFixturesStore.latestFixtures()!.away"
      />
      } }
    </section>
  `,
})
export class MatchLatestFixturesComponent {
  latestFixturesStore = inject(LatestFixturesStore);

  fixtureStore = inject(FixtureStore);
  data = computed(() => this.fixtureStore.fixture()?.data);
}
