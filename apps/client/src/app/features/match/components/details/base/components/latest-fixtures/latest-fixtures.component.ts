import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import type {
  EvaluationDTO,
  ExtendedFixtureDTO,
  LatestFixturesDTO,
} from '@reelscore-sdk/models';

import { PageTitleActionDirective, PageTitleComponent } from '@app/shared';

import { MatchFixturesTableComponent } from './components';

const MAT_MODULES = [MatButtonModule, MatIconModule, MatMenuModule];

@Component({
  selector: 'rs-match-latest-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...MAT_MODULES,
    PageTitleComponent,
    PageTitleActionDirective,
    MatchFixturesTableComponent,
  ],
  styles: `
    :host {
      @apply flex flex-col;
    }

    .latest-fixtures-container {
      @apply flex flex-col md:flex-row mt-rs1 mx-3 pb-3 gap-rs2;
      border-radius: var(--mat-button-toggle-shape);
    }

    .fixtures-skeleton {
      @apply flex-1 p-rs1 bg-rs-button-bg shadow-rs3 rounded-border2;
    }
    .skeleton-team-header { @apply flex items-center gap-3 p-2 pb-4 mb-2 border-b; }
    .skeleton-team-header.away { @apply flex-row-reverse; }
    .skeleton-logo { @apply w-8 h-8 rounded-full; }
    .skeleton-team-name { @apply w-32 h-4; }
    .skeleton-row { @apply flex flex-col gap-1 p-2; }
    .skeleton-row + .skeleton-row { @apply border-t; }
    .skeleton-row .rs-skeleton { height: 13px; }
    .skeleton-fixture-header { @apply flex justify-between gap-2; min-height: 15px; }
    .skeleton-competition { @apply w-36; }
    .skeleton-date { width: 40px; }
    .skeleton-match-row {
      @apply grid items-center gap-x-2;
      min-height: 18px;
      grid-template-columns: minmax(0, 1fr) 17px 24px 17px minmax(0, 1fr);
    }
    .skeleton-team { @apply min-w-0 w-[70%]; }
    .skeleton-team.home { @apply justify-self-end; }
    .skeleton-team.away { @apply justify-self-start; }
    .skeleton-score { @apply w-[24px]; }
    .skeleton-row .skeleton-performance { @apply w-[17px] h-[17px] rounded; }

    .no-data {
      @apply m-auto;
    }

    .performance-info { @apply px-4 py-3 text-rs-font-size-body-2; }
    .performance-info h3 { @apply m-0 mb-2 font-semibold; }
    .performance-info p { @apply m-0 mb-3; }
    .performance-legend { @apply flex flex-col gap-2 m-0; }
    .performance-legend > div { @apply flex items-center gap-2; }
    .performance-legend dt { @apply flex items-center justify-center w-6 h-6 rounded font-semibold; }
    .performance-legend dd { @apply m-0; }
    .high { @apply bg-rs-color-green text-white; }
    .middle { @apply bg-gray-200 text-black; }
    .low { @apply bg-rs-color-red text-white; }
    .unavailable { @apply bg-gray-500 text-white; }
  `,
  template: `
    <rs-page-title title="Letzte Spiele">
      <button
        rsPageTitleAction
        mat-icon-button
        #performanceMenuTrigger="matMenuTrigger"
        [style.--rs-button-bg-color]="
          performanceMenuTrigger.menuOpen ? 'var(--rs-color-primary)' : null
        "
        [style.--mat-icon-color]="
          performanceMenuTrigger.menuOpen
            ? 'var(--rs-color-text-3)'
            : 'var(--rs-color-text-1)'
        "
        type="button"
        aria-label="Performance-Bewertung erklären"
        [matMenuTriggerFor]="performanceMenu"
      >
        <mat-icon>info</mat-icon>
      </button>
    </rs-page-title>

    <mat-menu #performanceMenu="matMenu" xPosition="before">
      <div class="performance-info">
        <h3>Performance-Bewertung</h3>
        <p>
          Die Performance zeigt die Spielleistung anhand von Schüssen,
          Torschüssen und erzielten Toren. Sie kann vom Spielergebnis abweichen.
        </p>
        <dl class="performance-legend">
          <div>
            <dt class="high">G</dt>
            <dd>Gut gespielt</dd>
          </div>
          <div>
            <dt class="middle">M</dt>
            <dd>Mittelmäßig gespielt</dd>
          </div>
          <div>
            <dt class="low">S</dt>
            <dd>Schlecht gespielt</dd>
          </div>
          <div>
            <dt class="unavailable">-</dt>
            <dd>Keine Bewertung verfügbar</dd>
          </div>
          <div>
            <dt class="unavailable">?</dt>
            <dd>Spiel noch nicht gestartet</dd>
          </div>
        </dl>
      </div>
    </mat-menu>

    <div class="latest-fixtures-container" [attr.aria-busy]="isLoading()">
      @let latest = latestFixtures(); @let fixture = data(); @if (latest &&
      fixture && !isLoading()) {
      <rs-match-fixtures-table
        [team]="fixture.teams.home"
        [fixtures]="latest.home"
        [side]="'home'"
      />

      <rs-match-fixtures-table
        [team]="fixture.teams.away"
        [fixtures]="latest.away"
        [side]="'away'"
      />
      } @else if (isLoading()) { @for (team of [0, 1]; track team) {
      <div class="fixtures-skeleton" aria-hidden="true">
        <div class="skeleton-team-header" [class.away]="team === 1">
          <span class="rs-skeleton skeleton-logo"></span>
          <span class="rs-skeleton skeleton-team-name"></span>
        </div>
        @for (row of [0, 1, 2, 3, 4]; track row) {
        <div class="skeleton-row">
          <div class="skeleton-fixture-header">
            <span class="rs-skeleton skeleton-competition"></span>
            <span class="rs-skeleton skeleton-date"></span>
          </div>
          <div class="skeleton-match-row">
            <span class="rs-skeleton skeleton-team home"></span>
            <span class="rs-skeleton skeleton-performance"></span>
            <span class="rs-skeleton skeleton-score"></span>
            <span class="rs-skeleton skeleton-performance"></span>
            <span class="rs-skeleton skeleton-team away"></span>
          </div>
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
  readonly isLoading = input<boolean>(false);
  readonly error = input<unknown>(null);
}
