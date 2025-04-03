import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { MatchTeams } from '@lib/models';

import {
  AnalysesStore,
  FixtureStore,
  LatestFixturesStore,
} from '../../../../../store';

import { AnalysesLastFixturesComponent } from './components';

@Component({
  selector: 'reelscore-match-fixture-analyses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnalysesLastFixturesComponent],
  styles: `
    :host { @apply flex flex-col mt-5 gap-5; }

    section.fixture-analyse { @apply bg-white p-5 text-rs-font-size-small sm:text-rs-font-size-body-1; }
    section.fixture-analyse > div { 
      @apply w-full flex flex-wrap gap-5; 

      &:not(:last-of-type) { @apply border-b-[1px] pb-5; }
      &:not(:first-of-type) { @apply pt-5; }

      .home { @apply text-end; }
      .home, .away { @apply flex-1; }
      .analysis { @apply flex flex-col flex-2 text-center; }
      .analysis span:nth-child(2) { @apply text-rs-font-size-small text-rs-color-text-2; }
      .playersWithStreak, .strongAtHomeOrAway { 
        .home, .away, .analysis { @apply self-center; }
       }
    }
  `,
  template: `
    <section class="fixture-analyse">
      <div class="playersWithStreak">
        <div class="home">
          @if (analyses()!.playersWithStreak.home.length > 0) { @for (player of
          analyses()!.playersWithStreak.home; track $index) {
          <div class="player">{{ player }}</div>
          } } @else { - }
        </div>
        <div class="analysis">
          <span>Spieler mit Torserie</span>
          <span>3+ Spiele in Folge getroffen</span>
        </div>
        <div class="away">
          @if (analyses()!.playersWithStreak.away.length > 0) { @for (player of
          analyses()!.playersWithStreak.away; track $index) {
          <div class="player">{{ player }}</div>
          } } @else { - }
        </div>
      </div>

      <div class="strongAtHomeOrAway">
        <div class="home">
          {{ analyses()?.homeOrAwayStrong?.home === false ? 'Nein' : 'Ja' }}
        </div>
        <div class="analysis">
          <span>Heimstark / Auswärtsstark</span>
        </div>
        <div class="away">
          {{ analyses()?.homeOrAwayStrong?.away === false ? 'Nein' : 'Ja' }}
        </div>
      </div>
    </section>

    @if (hasEvaluations()) {
    <reelscore-match-fixture-analyses-last-fixtures
      [fixtures]="latestFixtures()!"
      [teams]="teams()"
    />
    }
  `,
})
export class MatchFixtureAnalysesComponent {
  latestFixturesStore = inject(LatestFixturesStore);
  latestFixtures = this.latestFixturesStore.latestFixtures;

  // TODO refactor analyses to own component reelscore-match-fixture-analyses-base
  analysesStore = inject(AnalysesStore);
  analyses = this.analysesStore.analyses;

  fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;

  teams = computed<MatchTeams>(() => {
    const fixture = this.fixture();
    if (!fixture) throw new Error('No fixtures found');
    return {
      home: fixture.data.teams.home,
      away: fixture.data.teams.away,
    };
  });

  hasEvaluations = computed<boolean>(() => {
    const evaluations = this.latestFixtures();
    if (!evaluations) return false;
    return evaluations.home.some((f) => {
      const home = f.evaluations?.home;
      const away = f.evaluations?.away;
      if (home === undefined || away === undefined) return false;
      return home.analyses.length > 0 || away.analyses.length > 0;
    });
  });
}
