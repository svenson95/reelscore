import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  untracked,
} from '@angular/core';

import {
  BackButtonComponent,
  LeagueService,
  OptimizedImageComponent,
  getCompetitionLogo,
} from '../../../shared';

@Component({
  selector: 'nav[rs-page-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, BackButtonComponent],
  styles: `
    :host { @apply relative; }
    rs-back-button { @apply absolute top-5 left-5 z-10; }
    rs-optimized-image { @apply p-8; }
    .image-wrapper { @apply flex w-fit bg-white mx-auto my-5 rounded-full; }
  `,
  template: `
    <rs-back-button class="animate-drop-from-top" />
    <div class="image-wrapper">
      <rs-optimized-image
        [source]="competitionLogo()"
        [altText]="label()"
        width="64"
        height="64"
      />
    </div>
  `,
})
export class PageHeaderComponent {
  private leagueService = inject(LeagueService);
  private selectedLeague = computed(() => this.leagueService.selectedLeague());

  id = computed(() => untracked(this.selectedLeague)?.id ?? 0);
  label = computed(() => untracked(this.selectedLeague)?.label ?? 'unknown');
  competitionLogo = computed(() => getCompetitionLogo(untracked(this.id)));
}
