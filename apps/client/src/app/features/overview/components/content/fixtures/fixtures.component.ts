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

    @let comps = competitions(); @let fixtures = filteredFixtures(); @if (comps
    && comps.length > 0) { @for (competition of comps; track competition.name) {
    <rs-start-match-day-list
      class="animate-fade-in"
      [competition]="competition"
    />
    } } @else {
    <p class="no-data">
      @if (isLoading() && !hasDataForSelectedDay()) {
      <span data-testid="fixtures-loading"> Spiele werden geladen ... </span>
      } @else if (error()) { Fehler beim Laden der Spiele. } @else if
      (fixtures.length === 0) { Es finden keine Spiele statt. }
    </p>
    }
  `,
})
export class OverviewFixturesComponent {
  readonly filteredFixtures = input.required<ExtendedFixtureDTO[]>();
  readonly isLoading = input.required<boolean>();
  readonly hasDataForSelectedDay = input.required<boolean>();
  readonly error = input.required<string | null>();

  private readonly facade = inject(OverviewFixturesFacade);

  readonly competitions = computed<CompetitionWithFixtures[]>(() => {
    return this.facade.initCompetitionsWithFixtures(this.filteredFixtures());
  });
}
