import { Component, computed, inject } from '@angular/core';

import {
  BackButtonComponent,
  LeagueService,
  OptimizedImageComponent,
  getCompetitionLogo,
} from '@app/shared';

@Component({
  selector: 'reelscore-competition-header',
  standalone: true,
  imports: [OptimizedImageComponent, BackButtonComponent],
  styles: `
    :host { @apply relative; }
    reelscore-back-button { @apply absolute top-5 left-5 z-10; }
    reelscore-optimized-image { @apply p-8; }
    .image-wrapper { @apply flex w-fit bg-white mx-auto my-5 rounded-full; }
  `,
  template: `
    <reelscore-back-button />
    <div class="image-wrapper">
      <reelscore-optimized-image
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
