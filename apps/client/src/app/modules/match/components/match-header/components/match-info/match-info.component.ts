import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  FixtureStatusState,
  getFixtureStatusState,
  ResultLabelComponent,
} from '@app/shared';
import { type FixtureDTO } from '@lib/models';

import {
  MatchInfoTeamComponent,
  type MatchHeaderTeam,
} from './components/match-info-team.component';

@Component({
  selector: 'rs-match-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchInfoTeamComponent, ResultLabelComponent],
  styles: `
    :host { @apply flex w-full; }
    .result-column {
      @apply relative flex flex-1 items-center justify-center gap-1 text-rs-font-size-body-1 sm:text-rs-font-size-body-1;
    }
    .result-label { @apply font-semibold; }
    .status { @apply absolute top-[-10px] py-[.15rem] px-2 text-rs-font-size-small; text-shadow: none; }
    .status.is-playing { @apply bg-rs-color-green text-white border border-solid font-semibold; }
    .status.is-finished { @apply bg-rs-alt-bg text-rs-color-text-1 border border-solid; }
  `,
  template: `
    @let fixture = data();

    <rs-match-info-team [team]="homeTeam()" />

    <div class="result-column">
      @if (fixture) { @if (statusLabel(); as label) {
      <div
        class="status"
        [class.is-playing]="statusClass() === 'playing'"
        [class.is-finished]="statusClass() === 'finished'"
      >
        {{ label }}
      </div>
      }

      <rs-result-label
        class="result-label"
        [fixture]="fixture"
        [status]="fixture.fixture.status.short"
        [showNotPlayedText]="true"
      />
      }
    </div>

    <rs-match-info-team [team]="awayTeam()" />
  `,
})
export class MatchInfoComponent {
  readonly data = input.required<FixtureDTO | undefined>();

  readonly homeTeam = computed<MatchHeaderTeam | undefined>(() =>
    this.getTeam('home')
  );
  readonly awayTeam = computed<MatchHeaderTeam | undefined>(() =>
    this.getTeam('away')
  );

  readonly statusState = computed<FixtureStatusState>(() => {
    const status = this.data()?.fixture.status.short;
    if (!status) throw new Error('status in match-info not defined');
    return getFixtureStatusState(status);
  });

  readonly statusLabel = computed<string>(() => {
    const fixture = this.data();
    const state = this.statusState();

    if (!fixture || !state) {
      throw new Error('fixture or state in match-info not defined');
    }

    if (state.isNotPlayed) return 'Abgesagt';
    if (state.isPenalty) return 'Elfmeterschießen';
    if (state.isHalftime) return 'HZ';
    if (state.isPlaying) return `${fixture.fixture.status.elapsed}'`;
    if (state.isFinished) return 'ENDE';
    return '';
  });

  readonly statusClass = computed<'playing' | 'finished'>(() => {
    const state = this.statusState();
    if (!state) throw new Error('state in match-info not defined');

    if (state.isPenalty || state.isHalftime || state.isPlaying) {
      return 'playing';
    } else {
      return 'finished';
    }
  });

  private getTeam(
    type: 'home' | 'away'
  ): { id: number; name: string } | undefined {
    const fixture = this.data();
    if (!fixture) return undefined;
    return {
      id: fixture.teams[type].id,
      name: fixture.teams[type].name,
    };
  }
}
