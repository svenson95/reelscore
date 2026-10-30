import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

import { PageTitleComponent } from '@app/shared';

import { MatchFixturesTableComponent } from '../latest-fixtures/components';

@Component({
  selector: 'rs-match-head-to-head',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixturesTableComponent, PageTitleComponent],
  styles: `
    :host {
      @apply flex flex-col;
    }

    .latest-fixtures-container {
      @apply flex flex-col md:flex-row mt-rs1 mx-3 pb-3 gap-rs2;
      border-radius: var(--mat-button-toggle-shape);
    }

    .head-to-head-card {
      flex: 1;
      min-width: 0;
    }

    @media (min-width: 768px) {
      .head-to-head-card {
        max-width: calc((100% - 1rem) / 2);
        margin-inline: auto;
      }
    }

    .fixtures-skeleton {
      @apply flex-1 p-rs1 bg-rs-button-bg shadow-rs rounded-border2;
    }
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
  `,
  template: `
    <rs-page-title title="Letzte Begegnungen" />

    <div class="latest-fixtures-container" [attr.aria-busy]="isLoading()">
      @let match = fixture(); @if (isLoading()) {
      <div class="fixtures-skeleton head-to-head-card" aria-hidden="true">
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
      } @else if (error()) {
      <p class="no-data" role="status">Fehler beim Laden der Begegnungen</p>
      } @else if ((fixtures()?.length ?? 0) === 0) {
      <p class="no-data">Keine letzten Begegnungen gefunden</p>
      } @else if (match) {
      <rs-match-fixtures-table
        class="head-to-head-card"
        [team]="match.teams.home"
        [fixtures]="fixtures() ?? []"
        [side]="'home'"
        [showTeamHeader]="false"
        [dimUnrelatedPerformanceIcons]="false"
      />
      }
    </div>
  `,
})
export class MatchHeadToHeadComponent {
  readonly fixture = input<ExtendedFixtureDTO | null>(null);
  readonly fixtures = input<ExtendedFixtureDTO[] | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly error = input<unknown>(null);
}
