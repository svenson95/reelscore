import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type {
  ExtendedFixtureDTO,
  LatestFixturesDTO,
} from '@reelscore-sdk/models';

import { PageTitleComponent } from '@app/shared';

import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'rs-match-latest-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, MatchFixturesTableComponent],
  styles: `
    :host {
      @apply flex flex-col;
    }

    .latest-fixtures-container {
      @apply flex flex-col md:flex-row mt-rs1 mx-3 gap-rs2;
      border-radius: var(--mat-button-toggle-shape);
    }

    .fixtures-skeleton {
      @apply flex-1 p-rs1 bg-rs-button-bg shadow-rs3 rounded-border2;
    }
    .skeleton-row {
      @apply flex items-center p-2 gap-2;
      min-height: 37px;
    }
    .skeleton-row + .skeleton-row { @apply border-t; }
    .skeleton-row .rs-skeleton { height: 13px; }
    .skeleton-date { width: 40px; }
    .skeleton-team { flex: 1; }
    .skeleton-score { width: 42px; }

    .no-data {
      @apply m-auto;
    }
  `,
  template: `
    <rs-page-title title="Letzte Spiele" />

    <div class="latest-fixtures-container" [attr.aria-busy]="isLoading()">
      @let latest = latestFixtures(); @let fixture = data(); @if (latest &&
      fixture && !isLoading()) {
      <rs-match-fixtures-table
        [team]="fixture.teams.home"
        [fixtures]="latest.home"
      />

      <rs-match-fixtures-table
        [team]="fixture.teams.away"
        [fixtures]="latest.away"
      />
      } @else if (isLoading()) { @for (team of [0, 1]; track team) {
      <div class="fixtures-skeleton" aria-hidden="true">
        @for (row of [0, 1, 2, 3, 4]; track row) {
        <div class="skeleton-row">
          <span class="rs-skeleton skeleton-date"></span>
          <span class="rs-skeleton skeleton-team"></span>
          <span class="rs-skeleton skeleton-score"></span>
          <span class="rs-skeleton skeleton-team"></span>
        </div>
        }
      </div>
      } } @else if (error()) {
      <p class="no-data">Fehler beim Laden der Spiele</p>
      } @else {
      <p class="no-data">Keine Spiele gefunden</p>
      }
    </div>
  `,
})
export class MatchLatestFixturesComponent {
  readonly data = input<ExtendedFixtureDTO | null>(null);
  readonly latestFixtures = input<LatestFixturesDTO | null>(null);
  readonly isLoading = input(false);
  readonly error = input<unknown>(null);
}
