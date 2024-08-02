import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'reelscore-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { 
      @apply select-none; 
      color: #fff;
    }
  `,
  template: `
    <span class="font-bold">reel</span>
    <span>score</span>
  `,
})
export class LogoComponent {}
