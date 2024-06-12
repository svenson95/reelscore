import { ChangeDetectionStrategy, Component } from '@angular/core';

import { OptimizedImageComponent } from '../optimized-image/optimized-image.component';

@Component({
  selector: 'futbet-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent],
  styles: `
    :host { @apply select-none; }
    :host > * { @apply align-middle; }
    futbet-optimized-image { @apply inline-flex mx-1; }
    span { @apply font-bold; }
  `,
  template: `
    <span>FUT</span>
    <futbet-optimized-image
      source="assets/icons/sports_and_outdoors.svg"
      alternate="futbet logo"
      width="20"
      height="20"
    />
    <span>BET</span>
  `,
})
export class LogoComponent {}
