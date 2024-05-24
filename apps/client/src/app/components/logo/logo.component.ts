import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'futbet-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  styles: `
    :host { @apply select-none; }
    :host > * { @apply align-middle; }
    mat-icon { @apply mx-1; }
    span { @apply font-bold; }
    span:last-child { @apply text-fb-color-green-1; }
  `,
  template: `
    <span>FUT</span>
    <mat-icon>sports_soccer</mat-icon>
    <span>BET</span>
  `,
})
export class LogoComponent {}
