import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  ResponsiveImageComponent,
  TeamNamePipe,
  getTeamLogo,
  getTeamLogoSrcSet,
} from '@app/shared';

export type MatchHeaderTeam = {
  id: number;
  name: string;
};

@Component({
  selector: 'rs-match-info-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResponsiveImageComponent, TeamNamePipe],
  styles: `
    :host { @apply flex flex-1 flex-col gap-2 text-rs-font-size-body-2 sm:text-rs-font-size-body-1; }
    .team-logo { @apply flex m-auto; }
    .team-name { @apply leading-[16px] text-center flex-1; }
    .team-name-placeholder { @apply block w-[100px] h-[16px] bg-gray-200 rounded m-auto; }
    .team-logo-placeholder { @apply w-[48px] h-[48px] bg-gray-200 rounded-full self-center; }
  `,
  template: `
    <div class="team-logo">
      @if (team(); as teamData) {
      <rs-responsive-image
        [source]="logo()"
        [sourceSet]="logoSet()"
        [altText]="teamData.name + ' logo'"
        [width]="48"
        [height]="48"
      />
      } @else {
      <div class="team-logo-placeholder"></div>
      }
    </div>

    <span class="team-name">
      @if (team(); as teamData) {
      {{ teamData.name | teamName }}
      } @else {
      <span class="team-name-placeholder"></span>
      }
    </span>
  `,
})
export class MatchInfoTeamComponent {
  readonly team = input<MatchHeaderTeam | undefined>();

  readonly logo = computed(() => {
    const id = this.team()?.id ?? 0;
    return getTeamLogo(id, 48);
  });

  readonly logoSet = computed(() => {
    const id = this.team()?.id ?? 0;
    return getTeamLogoSrcSet(id, 48);
  });
}
