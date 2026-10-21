import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  getTeamLogo,
  getTeamLogoSrcSet,
  ResponsiveImageComponent,
  TeamNamePipe,
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
    :host {
      @apply flex h-[104px] flex-1 flex-col justify-center gap-2 text-rs-font-size-body-2 sm:text-rs-font-size-body-1;
    }
    .team-logo {
      @apply flex mx-auto;
    }
    .team-name {
      @apply flex h-[48px] max-w-[180px] self-center items-start justify-center overflow-hidden text-center font-semibold leading-[16px] text-balance line-clamp-3;
    }
    .team-name-placeholder {
      @apply flex h-[48px] w-[100px] flex-col items-center justify-center gap-1 m-auto;
    }
    .team-name-placeholder-line {
      @apply h-[12px] rounded;
    }
    .team-logo-placeholder {
      @apply w-[48px] h-[48px] rounded-full self-center;
    }
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
        loading="eager"
      />
      } @else {
      <div class="rs-skeleton team-logo-placeholder" aria-hidden="true"></div>
      }
    </div>

    <span class="team-name">
      @if (team(); as teamData) {
      {{ teamData.name | teamName }}
      } @else {
      <span class="team-name-placeholder" aria-hidden="true">
        <span class="rs-skeleton team-name-placeholder-line w-full"></span>
        <span class="rs-skeleton team-name-placeholder-line w-2/3"></span>
      </span>
      }
    </span>
  `,
})
export class MatchInfoTeamComponent {
  readonly team = input<MatchHeaderTeam | null>();

  readonly logo = computed(() => {
    const id = this.team()?.id ?? 0;
    return getTeamLogo(id, 48);
  });

  readonly logoSet = computed(() => {
    const id = this.team()?.id ?? 0;
    return getTeamLogoSrcSet(id, 48);
  });
}
