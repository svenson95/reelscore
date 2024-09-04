import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { FixtureStore } from '../../../../../../../store';
import { LatestFixturesStore } from '../../../../../store';
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
      @if (latestFixtures.isLoading()) {
      <p class="no-data">Spiele werden geladen ...</p>
      } @else if (latestFixtures.error()) {
      <p class="no-latestFixtures">Fehler beim Laden der Spiele.</p>
      } @else if (!latestFixtures.latestFixtures()) {
      <p class="no-latestFixtures">Keine Spiele gefunden.</p>
      } @else { @if (latestFixtures.latestFixtures()) {
      <reelscore-match-fixtures-table
        [team]="fixture()!.teams.home"
        [fixtures]="latestFixtures.latestFixtures()!.home"
      />
      <reelscore-match-fixtures-table
        [team]="fixture()!.teams.away"
        [fixtures]="latestFixtures.latestFixtures()!.away"
      />
      } }
    </section>
  `,
})
export class MatchLatestFixturesComponent implements OnInit {
  lfs = inject(LatestFixturesStore);
  latestFixtures = this.lfs;

  fs = inject(FixtureStore);
  fixture = this.fs.fixture;

  ngOnInit(): void {
    this.lfs.loadLatestFixtures();
  }
}
