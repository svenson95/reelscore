import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContentComponent } from './components/content/content.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ADMIN_SERVICE_PROVIDER, DATABASE_SERVICE_PROVIDER } from './services';

@Component({
  selector: 'futbet-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarComponent, ContentComponent],
  providers: [ADMIN_SERVICE_PROVIDER, DATABASE_SERVICE_PROVIDER],
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
