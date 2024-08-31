import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

import { OptimizedImageComponent } from '@app/components';
import { TeamNamePipe } from '@app/pipes';
import { BreakpointObserverService } from '@app/services';
import { FixtureDTO, logoFromAssets } from '@lib/models';

@Component({
  selector: 'reelscore-match-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, DatePipe, TeamNamePipe],
  styles: `
    :host { 
      @apply flex mx-auto py-5 px-4 rounded-fb w-full max-w-fb-max-width bg-white border-[1px];
    }
    div { @apply flex flex-1 text-fb-font-size-body-2 sm:text-fb-font-size-body-1; }
    .team-column { @apply flex-col gap-2; }
    .result-column { @apply items-center justify-center gap-1 text-lg; }
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
        @if (isMobile()) {
        {{ data().teams.home.name | teamName : 'short' }}
        } @else {
        {{ data().teams.home.name | teamName }}
        }
      </span>
    </div>

    <div class="result-column">
      @if (!isUpcoming()) {
      <span>{{ data().score.fulltime.home }}</span>
      <span>:</span>
      <span>{{ data().score.fulltime.away }}</span>
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
        @if (isMobile()) {
        {{ data().teams.away.name | teamName : 'short' }}
        } @else {
        {{ data().teams.away.name | teamName }}
        }
      </span>
    </div>
  `,
})
export class MatchHeaderComponent {
  data = input.required<FixtureDTO>();
  bos = inject(BreakpointObserverService);

  isUpcoming = signal<boolean>(false); // TODO derive value from fixture date
  isMobile = this.bos.isMobile;

  logoFromAssets = logoFromAssets;
}
