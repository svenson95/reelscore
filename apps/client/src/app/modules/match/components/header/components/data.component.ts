import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  OptimizedImageComponent,
  ResultLabelComponent,
  TeamNamePipe,
  getTeamLogo,
} from '@app/shared';
import { FixtureDTO } from '@lib/models';

@Component({
  selector: 'reelscore-match-header-data',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, TeamNamePipe, ResultLabelComponent],
  styles: `
    :host { @apply flex w-full; }
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
        [result]="data().goals"
        [status]="data().fixture.status.short"
        [isNotStarted]="isNotStarted(data())"
        [showPostponedText]="true"
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
export class HeaderDataComponent {
  data = input.required<FixtureDTO>();

  getTeamLogo = getTeamLogo;
  isNotStarted = (fixture: FixtureDTO): boolean => {
    const notStartedValues = ['TBD', 'NS'];
    return notStartedValues.some((v) => v === fixture.fixture.status.short);
  };
}
