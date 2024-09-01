import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { OptimizedImageComponent } from '@app/components';
import { TeamNamePipe } from '@app/pipes';
import { FixtureDTO, logoFromAssets } from '@lib/models';

@Component({
  selector: 'reelscore-match-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, TeamNamePipe],
  styles: `
    :host { 
      @apply flex mx-auto py-5 px-4 rounded-fb w-full max-w-fb-max-width bg-white border-[1px];
    }
    div { @apply flex flex-1 sm:text-fb-font-size-body-1; }
    .team-column { @apply flex-col gap-2 text-fb-font-size-body-2; }
    .result-column { @apply items-center justify-center gap-1 text-fb-font-size-body-1; }
    .team-name { @apply leading-[16px] text-center; }
  `,
  template: `
    <div class="team-column">
      <reelscore-optimized-image
        [source]="logoFromAssets(data().teams.home.id)"
        alternate="home logo"
        width="36"
        height="36"
      />
      <span class="team-name">
        {{ data().teams.home.name | teamName }}
      </span>
    </div>

    <div class="result-column">
      @if (isFinished()) {
      <span>{{ data().score.fulltime.home }}</span>
      <span>:</span>
      <span>{{ data().score.fulltime.away }}</span>
      } @else if (isPostponed()) {
      <span class="text-fb-font-size-small">Abgesagt</span>
      } @else if (isNotStarted()) {
      <span>:</span>
      }
    </div>

    <div class="team-column">
      <reelscore-optimized-image
        [source]="logoFromAssets(data().teams.away.id)"
        alternate="away logo"
        width="36"
        height="36"
      />
      <span class="team-name">
        {{ data().teams.away.name | teamName }}
      </span>
    </div>
  `,
})
export class MatchHeaderComponent {
  data = input.required<FixtureDTO>();

  logoFromAssets = logoFromAssets;

  isFinished = computed(() => {
    const { short } = this.data().fixture.status;
    const isFinished = short === 'FT';
    const isFinishedAfterExtraTime = short === 'AET';
    const isFinishedAfterPenalties = short === 'PEN';
    return isFinished || isFinishedAfterExtraTime || isFinishedAfterPenalties;
  });

  isPostponed = computed(() => this.data().fixture.status.short === 'PST');
  isNotStarted = computed(() => this.data().fixture.status.short === 'NS');
}
