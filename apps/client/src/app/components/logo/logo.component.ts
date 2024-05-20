import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <span class="font-normal">FUT</span>
    <span class="px-1">⚽</span>
    <span class="font-bold">BET</span>
  `,
  styles: `
    span {
      user-select: none;
    }

    span:last-child {
      color: var(--fb-color-green-1);
    }
  `,
})
export class LogoComponent {}
