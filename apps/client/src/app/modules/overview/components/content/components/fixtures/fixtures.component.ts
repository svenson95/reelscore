import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { ExtendedFixtureDTO } from '@lib/models';

import { CompetitionWithFixtures } from '../../../../../../shared';

import { MatchDayListComponent } from './components';
import { OverviewFixturesFacade } from './fixtures.facade';

@Component({
  selector: 'rs-overview-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchDayListComponent],
  providers: [OverviewFixturesFacade],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @let comps = competitions(); @let fixtures = filteredFixtures(); @if (comps
    && comps.length > 0) { @for (competition of comps; track competition.name) {
    <rs-start-match-day-list
      class="animate-fade-in"
      [competition]="competition"
    />
    } } @else {
    <p class="no-data">
      @if (isLoading()) { Spiele werden geladen ... } @else { @if (error()) {
      Fehler beim Laden der Spiele. } @else if (fixtures.length === 0) { Es
      finden keine Spiele statt. } @else if (comps.length === 0) { Keine Spiele
      für diesen Wettbewerb gefunden. } }
    </p>
    }
  `,
})
export class OverviewFixturesComponent {
  filteredFixtures = input.required<ExtendedFixtureDTO[]>();
  isLoading = input.required<boolean>();
  error = input.required<string | null>();

  facade = inject(OverviewFixturesFacade);

  // TODO check if this signal can be moved to facade, depend on filteredFixtures is a problem
  competitions = computed<CompetitionWithFixtures[]>(() => {
    const fixtures = this.filteredFixtures();
    return this.facade.initCompetitionsWithFixtures(fixtures);
  });
}
