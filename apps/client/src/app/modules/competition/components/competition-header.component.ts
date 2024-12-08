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
    reelscore-back-button { @apply absolute top-0 left-0 z-10; }
    reelscore-optimized-image { @apply p-8 mx-auto mb-5; }
  `,
  template: `
    <reelscore-back-button />
    <reelscore-optimized-image
      [source]="getCompetitionLogo(id()!)"
      [alternate]="label()!"
      width="64"
      height="64"
    />
  `,
})
export class CompetitionHeaderComponent {
  leagueService = inject(LeagueService);
  id = computed(() => this.leagueService.selectedLeague()?.id);
  label = computed(() => this.leagueService.selectedLeague()?.label);
  getCompetitionLogo = getCompetitionLogo;
}
