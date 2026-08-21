import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import type { CompetitionWithFixtures } from '@app/shared';
import type { ExtendedFixtureDTO } from '@lib/models';

import { OverviewFixturesFacade } from './fixtures.facade';
import { MatchDayListComponent } from './match-day-list.component';

type FixturesViewState = 'loading' | 'error' | 'empty' | null;

@Component({
  selector: 'rs-overview-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchDayListComponent],
  providers: [OverviewFixturesFacade],
  styles: `
    :host {
      @apply flex flex-col gap-rs1;
    }
  `,
  template: `
    <h2>Partien</h2>

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
    <p class="no-data">Es finden keine Spiele statt.</p>
    } } }
  `,
})
export class OverviewFixturesComponent {
  readonly filteredFixtures = input.required<ExtendedFixtureDTO[]>();
  readonly isLoading = input.required<boolean>();
  readonly hasDataForSelectedDay = input.required<boolean>();
  readonly error = input.required<string | null>();

  private readonly facade = inject(OverviewFixturesFacade);

  readonly competitions = computed<CompetitionWithFixtures[]>(() =>
    this.facade.groupFixturesByCompetition(this.filteredFixtures())
  );

  readonly viewState = computed<FixturesViewState>(() => {
    if (this.isLoading() && !this.hasDataForSelectedDay()) {
      return 'loading';
    }

    if (this.error()) {
      return 'error';
    }

    if (this.filteredFixtures().length === 0) {
      return 'empty';
    }

    return null;
  });

  getCompetitionKey(competition: CompetitionWithFixtures): string {
    const round = competition.fixtures[0].league.round;

    return `${competition.id}-${round}`;
  }
}
