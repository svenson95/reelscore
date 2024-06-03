import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContentComponent } from './components/content/content.component';
import { SidebarComponent } from './components/sidebar.component';

@Component({
  selector: 'futbet-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarComponent, ContentComponent],
  styles: `
    :host { @apply w-full flex flex-col gap-5; }
    .page-title { @apply text-center border-b-[1px] pb-2 mb-2; }
    div { @apply flex gap-5; }
  `,
  template: `
    <h3 class="page-title">ADMIN</h3>

    <div>
      <futbet-admin-sidebar />

      <futbet-admin-content />
    </div>
  `,
})
export class AdminComponent {}
