import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TableComponent } from './components/table/table.component';

@Component({
  selector: 'futbet-admin-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent],
  styles: `
    :host { @apply flex flex-col flex-[3]; }
  `,
  template: ` <futbet-admin-content-table /> `,
})
export class ContentComponent {}
