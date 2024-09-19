import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'reelscore-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply select-none text-white text-fb-font-size-body-1 tracking-normal; }
    :host([disabled]) { @apply grayscale opacity-35; }
  `,
  template: `
    <span class="font-bold">reel</span>
    <span>score</span>
  `,
})
export class LogoComponent {}
