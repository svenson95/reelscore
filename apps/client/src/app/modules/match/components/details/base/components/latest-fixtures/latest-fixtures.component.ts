import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FixtureStore, LatestFixturesStore } from '../../../../../store';
import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'reelscore-match-latest-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixturesTableComponent],
  styles: `
    :host { @apply flex flex-col; }
    section { @apply flex flex-col md:flex-row px-5 pb-5 pt-4 gap-5; }
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
        [team]="fixture()!.teams.home"
        [fixtures]="latestFixturesStore.latestFixtures()!.home"
      />
      <reelscore-match-fixtures-table
        [team]="fixture()!.teams.away"
        [fixtures]="latestFixturesStore.latestFixtures()!.away"
      />
      } }
    </section>
  `,
})
export class MatchLatestFixturesComponent {
  latestFixturesStore = inject(LatestFixturesStore);

  fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;
}
