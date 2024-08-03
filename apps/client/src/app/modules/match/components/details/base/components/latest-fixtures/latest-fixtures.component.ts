import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { LatestFixturesStore } from '../../../../../store';
import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'reelscore-match-latest-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixturesTableComponent],
  styles: `
    :host { @apply flex flex-col bg-white border-[1px] rounded-fb; }
    section { @apply flex flex-col md:flex-row; }
    reelscore-match-fixtures-table:first-of-type {
      @apply border-b-[1px] md:border-b-0 md:border-r-[1px]; 
    }
    .no-data { @apply m-auto; }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    <section>
      @if (data.isLoading()) {
      <p class="no-data">Spiele werden geladen ...</p>
      } @else if (data.error()) {
      <p class="no-data">Fehler beim Laden der Spiele.</p>
      } @else if (!data.latestFixtures()) {
      <p class="no-data">Keine Spiele gefunden.</p>
      } @else { @if (data.latestFixtures()) {
      <reelscore-match-fixtures-table
        [latestFixtures]="data.latestFixtures()!.home"
      />
      <reelscore-match-fixtures-table
        [latestFixtures]="data.latestFixtures()!.away"
      />
      } }
    </section>
  `,
})
export class MatchLatestFixturesComponent implements OnInit {
  store = inject(LatestFixturesStore);
  data = this.store;

  ngOnInit(): void {
    this.store.loadLatestFixtures();
  }
}
