import { Component, computed, inject } from '@angular/core';

import {
  BackButtonComponent,
  LeagueService,
  OptimizedImageComponent,
  getCompetitionLogo,
} from '@app/shared';

@Component({
  selector: 'rs-competition-header',
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
        [source]="getCompetitionLogo(id()!)"
        [alternate]="label()!"
        width="64"
        height="64"
      />
    </div>
  `,
})
export class CompetitionHeaderComponent {
  leagueService = inject(LeagueService);
  id = computed(() => this.leagueService.selectedLeague()?.id);
  label = computed(() => this.leagueService.selectedLeague()?.label);
  getCompetitionLogo = getCompetitionLogo;
}
