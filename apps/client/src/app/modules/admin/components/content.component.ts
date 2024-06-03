import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-admin-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col flex-[3]; }
  `,
  template: `content ...`,
})
export class ContentComponent {}
