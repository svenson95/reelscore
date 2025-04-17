import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { CompetitionId } from '@lib/models';
import { isCompetitionWithOneFixture } from '@lib/shared';

import { FIRST_ROUNDS, LeagueService } from '../../../shared';
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
  private store = inject(LastFixturesStore);
  fixtures = this.store.fixtures;
  isLoading = this.store.isLoading;
  showAll = this.store.showAll;

  private leagueService = inject(LeagueService);
  competition = computed(() => this.leagueService.selectedLeague());

  isFirstRound = computed<boolean>(() => {
    const fixtures = untracked(this.fixtures);
    const competition = untracked(this.competition);
    if (!fixtures || !competition) return false;
    const round = fixtures[0][0].league.round;
    return FIRST_ROUNDS.includes(round);
  });

  isCompetitionWithOneFixture = computed(() => {
    const id = untracked(this.competition)?.id;
    return !id ? false : isCompetitionWithOneFixture(id);
  });

  loadAllLastFixtures(id: CompetitionId): void {
    this.store.loadLastFixtures(id, true);
  }
}
