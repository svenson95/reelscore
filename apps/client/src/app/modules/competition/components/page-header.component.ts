import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import {
  BackButtonComponent,
  LeagueService,
  ResponsiveImageComponent,
  ThemeService,
  getCompetitionLogo,
  getCompetitionLogoSrcSet,
} from '@app/shared';

@Component({
  selector: 'nav[rs-page-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResponsiveImageComponent, BackButtonComponent],
  styles: `
    :host { @apply relative; }
    rs-back-button { @apply absolute top-3 left-3 z-10; }
    .page-header-image { @apply p-8; }
    .image-wrapper { @apply flex w-fit bg-white mx-auto my-5 rounded-full border shadow-rs3; }
  `,
  template: `
    <rs-back-button class="animate-drop-from-top" />
    <div class="image-wrapper">
      <rs-responsive-image
        class="page-header-image"
        [source]="competitionLogo()"
        [sourceSet]="competitionLogoSet()"
        [altText]="label()"
        [width]="64"
        [height]="64"
      />
    </div>
  `,
})
export class PageHeaderComponent {
  private readonly themeService = inject(ThemeService);
  private readonly leagueService = inject(LeagueService);

  private readonly selectedLeague = this.leagueService.selectedLeague;

  readonly label = computed(() => this.selectedLeague()?.label ?? 'unknown');

  readonly competitionLogo = computed<string>(() => {
    const id = this.selectedLeague()?.id;
    if (!id) throw new Error('Selected league is undefined');
    return getCompetitionLogo(id, 64, 1, this.themeService.isSystemDark());
  });

  readonly competitionLogoSet = computed<string>(() => {
    const id = this.selectedLeague()?.id;
    if (!id) throw new Error('Selected league is undefined');
    return getCompetitionLogoSrcSet(id, 64, this.themeService.isSystemDark());
  });
}
