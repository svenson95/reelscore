import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  untracked,
} from '@angular/core';

import { PageTitleComponent } from '@app/shared';
import type { ExtendedFixtureDTO } from '@lib/models';

import { FixtureStore, LatestFixturesStore } from '../../../../../store';

import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'rs-match-latest-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, MatchFixturesTableComponent],
  styles: `
    :host {
      @apply flex flex-col my-3;
    }

    .latest-fixtures-container {
      @apply flex flex-col md:flex-row mt-rs1 mx-3 gap-rs2;
      border-radius: var(--mat-button-toggle-shape);
    }

    .no-data {
      @apply m-auto;
    }
  `,
  template: `
    <rs-page-title title="Letzte Spiele" />

    <div class="latest-fixtures-container">
      @let latest = latestFixtures(); @let fixture = data(); @if (latest &&
      fixture) {
      <rs-match-fixtures-table
        [team]="fixture.teams.home"
        [fixtures]="latest.home"
      />

      <rs-match-fixtures-table
        [team]="fixture.teams.away"
        [fixtures]="latest.away"
      />
      } @else if (isLoading()) {
      <p class="no-data">Spiele werden geladen ...</p>
      } @else if (error()) {
      <p class="no-data">Fehler beim Laden der Spiele</p>
      } @else {
      <p class="no-data">Keine Spiele gefunden</p>
      }
    </div>
  `,
})
export class MatchLatestFixturesComponent {
  private readonly latestFixturesStore = inject(LatestFixturesStore);
  private readonly fixtureStore = inject(FixtureStore);

  readonly isLoading = this.latestFixturesStore.isLoading;
  readonly error = this.latestFixturesStore.error;
  readonly latestFixtures = this.latestFixturesStore.latestFixtures;

  readonly data = computed<ExtendedFixtureDTO | null>(() =>
    untracked(() => this.fixtureStore.fixture()?.data ?? null)
  );
}
