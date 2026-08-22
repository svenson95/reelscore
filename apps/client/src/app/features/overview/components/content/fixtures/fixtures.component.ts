import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import type { CompetitionWithFixtures } from '@app/shared';
import {
  STATUS_TYPES_PLAYING,
  type ExtendedFixtureDTO,
  type StatusShort,
} from '@lib/models';

import {
  PageTitleActionDirective,
  PageTitleComponent,
} from '../../page-title.component';

import { DateNavigationService } from '../../../services';
import { OverviewFixturesFacade } from './fixtures.facade';
import { MatchDayListComponent } from './match-day-list.component';

type FixturesViewState = 'loading' | 'error' | 'empty' | null;

const hasPlayingState = (status: StatusShort): boolean =>
  STATUS_TYPES_PLAYING.includes(status);

@Component({
  selector: 'rs-overview-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatchDayListComponent,
    PageTitleComponent,
    PageTitleActionDirective,
  ],
  providers: [OverviewFixturesFacade],
  styles: `
    :host {
      @apply flex flex-col gap-rs1;
    }

    .live-button {
      @apply min-w-0 rounded-full px-3 font-semibold;
      background-color: rgb(34 197 94 / 25%);
      color: var(--rs-color-green);
      --mat-button-filled-container-height: 30px;

      &.is-active {
        background-color: var(--rs-color-green);
        color: white;
      }
    }

    .live-button-indicator {
      @apply mr-[0.35rem] inline-block size-2 rounded-full;
      background-color: currentColor;
    }
  `,
  template: `
    <rs-page-title title="Spiele" data-testid="fixtures-title">
      @if (isTodaySelected()) {
      <button
        rsPageTitleAction
        mat-flat-button
        type="button"
        class="live-button"
        [class.is-active]="liveOnly()"
        [attr.aria-pressed]="liveOnly()"
        (click)="liveOnly.update((value) => !value)"
      >
        <span class="live-button-indicator"></span>
        <span class="live-button-text">LIVE</span>
      </button>
      }
    </rs-page-title>

    @if (competitions().length > 0) { @for ( competition of competitions();
    track getCompetitionKey(competition) ) {
    <rs-start-match-day-list [competition]="competition" />
    } } @else { @switch (viewState()) { @case ('loading') {
    <p class="no-data" data-testid="fixtures-loading">
      Spiele werden geladen ...
    </p>
    } @case ('error') {
    <p class="no-data">Fehler beim Laden der Spiele.</p>
    } @case ('empty') {
    <p class="no-data">
      @if (liveOnly()) { Aktuell finden keine Live-Spiele statt. } @else { Es
      finden keine Spiele statt. }
    </p>
    } } }
  `,
})
export class OverviewFixturesComponent {
  readonly filteredFixtures = input.required<ExtendedFixtureDTO[]>();
  readonly isLoading = input.required<boolean>();
  readonly hasDataForSelectedDay = input.required<boolean>();
  readonly error = input.required<string | null>();

  private readonly dateNavigationService = inject(DateNavigationService);
  private readonly facade = inject(OverviewFixturesFacade);

  readonly isTodaySelected = this.dateNavigationService.isToday;
  readonly liveOnly = signal<boolean>(false);

  readonly visibleFixtures = computed<ExtendedFixtureDTO[]>(() => {
    if (!this.liveOnly()) {
      return this.filteredFixtures();
    }

    return this.filteredFixtures().filter((fixture) =>
      hasPlayingState(fixture.fixture.status.short)
    );
  });

  readonly competitions = computed<CompetitionWithFixtures[]>(() =>
    this.facade.groupFixturesByCompetition(this.visibleFixtures())
  );

  readonly viewState = computed<FixturesViewState>(() => {
    if (this.isLoading() && !this.hasDataForSelectedDay()) {
      return 'loading';
    }

    if (this.error()) {
      return 'error';
    }

    if (this.visibleFixtures().length === 0) {
      return 'empty';
    }

    return null;
  });

  getCompetitionKey(competition: CompetitionWithFixtures): string {
    const round = competition.fixtures[0].league.round;

    return `${competition.id}-${round}`;
  }
}
