import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'reelscore-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply select-none text-fb-font-size-body-1 tracking-wide; }
    :host([disabled]) { @apply grayscale opacity-35; }
    span:first-of-type { @apply text-fb-red; }
  `,
  template: `
    <span>reel</span>
    <span>score</span>
  `,
})
export class LogoComponent {}
