import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OptimizedImageComponent } from '@app/components';
import { getTeamLogo } from '@app/models';
import { TeamNamePipe } from '@app/pipes';
import { FixtureDTO } from '@lib/models';
import { ResultLabelComponent } from '../../../../components';

@Component({
  selector: 'reelscore-match-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, TeamNamePipe, ResultLabelComponent],
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
        [source]="getTeamLogo(data().teams.home.id)"
        alternate="home logo"
        width="48"
        height="48"
      />
      <span class="team-name">
        {{ data().teams.home.name | teamName }}
      </span>
    </div>

    <div class="result-column">
      <reelscore-result-label
        [result]="data().score.fulltime"
        [status]="data().fixture.status.short"
        [showPostponed]="true"
      />
    </div>

    <div class="team-column">
      <reelscore-optimized-image
        [source]="getTeamLogo(data().teams.away.id)"
        alternate="away logo"
        width="48"
        height="48"
      />
      <span class="team-name">
        {{ data().teams.away.name | teamName }}
      </span>
    </div>
  `,
})
export class MatchHeaderComponent {
  data = input.required<FixtureDTO>();

  getTeamLogo = (id: number) => getTeamLogo(id, false);
}
