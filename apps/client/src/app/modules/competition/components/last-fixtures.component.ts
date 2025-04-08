import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { LeagueService } from '@app/shared';
import { CompetitionId } from '@lib/models';
import { isCompetitionWithOneFixture } from '@lib/shared';
import { LastFixturesStore } from '../store';
import { FixturesListComponent } from './fixtures-list.component';

@Component({
  selector: 'rs-competition-last-fixtures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, FixturesListComponent],
  styles: `
    :host { @apply flex flex-col gap-5 overflow-hidden; }
  `,
  template: `
    @if (fixtures() !== null) { @if (fixtures()!.length > 1) { @for
    (multipleFixtures of fixtures()!; track $index) {
    <rs-competition-fixtures-list
      [fixtures]="multipleFixtures"
      [competition]="competition()!.id"
      [isLoading]="isLoading()"
    />
    } } @else if (fixtures()!.length === 1) {
    <rs-competition-fixtures-list
      [fixtures]="fixtures()![0]"
      [competition]="competition()!.id"
      [isLoading]="isLoading()"
    />
    } @else if (fixtures()!.length === 0) {
    <p class="no-data">Keine vergangenen Spiele</p>
    } @if (!isFirstRound() && !isCompetitionWithOneFixture()) {
    <button
      mat-flat-button
      (click)="loadAllLastFixtures(competition()!.id)"
      [disabled]="showAll()"
    >
      Alle anzeigen
    </button>
    } } @else if (isLoading()) {
    <p class="no-data">Spiele werden geladen ...</p>
    }
  `,
})
export class LastFixturesComponent {
  store = inject(LastFixturesStore);
  fixtures = this.store.fixtures;
  isLoading = this.store.isLoading;

  leagueService = inject(LeagueService);
  competition = this.leagueService.selectedLeague;

  isFirstRound = computed<boolean>(() => {
    const fixtures = this.fixtures();
    const competition = this.competition();
    if (!fixtures || !competition) return false;
    const round = fixtures[0][0].league.round;
    const firstRounds = [
      'Regular Season - 1',
      '1st Round',
      'Preliminary Round',
      'League A - 1',
      'League B - 1',
      'League C - 1',
      'League D - 1',
      'Group A - 1',
      'Group B - 1',
      'Group D - 1',
      'Group C - 1',
      'Group E - 1',
      'Group F - 1',
    ];
    return firstRounds.includes(round);
  });
  isCompetitionWithOneFixture = computed(() => {
    const id = this.competition()?.id;
    return !id ? false : isCompetitionWithOneFixture(id);
  });
  showAll = this.store.showAll;

  loadAllLastFixtures(id: CompetitionId): void {
    this.store.loadLastFixtures(id, true);
  }
}
