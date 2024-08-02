import { ChangeDetectionStrategy, Component } from '@angular/core';

import { OptimizedImageComponent } from '../optimized-image/optimized-image.component';

@Component({
  selector: 'reelscore-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent],
  styles: `
    :host { @apply select-none; }
    :host > * { @apply align-middle; }
    reelscore-optimized-image { @apply inline-flex mx-1; }
  `,
  template: `
    <span class="font-bold">reel</span>
    <span>score</span>
  `,
})
export class LogoComponent {}
