import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AdminView } from '../../models';
import { AdminService } from '../../services';
import { SidebarDetailsComponent } from './components/details.component';

@Component({
  selector: 'futbet-admin-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarDetailsComponent],
  styles: `
    :host { @apply flex flex-col w-[250px] shrink-0 gap-10; }
    .group-title { @apply text-fb-color-text-2 border-b-[1px] pb-2 mb-2; }
    .group-title, li { @apply px-3 py-1 text-fb-font-size-body-2; }
    li { @apply cursor-pointer; }
    li span:last-of-type { @apply float-right; }
    li.active { @apply text-fb-color-green-1; }
  `,
  template: `
    <section class="nav">
      <h4 class="group-title">Übersicht</h4>
      <ul>
        <li
          [class.active]="isVisible('overview-standings')"
          (click)="setView('overview-standings')"
        >
          Standings
        </li>
        <li
          [class.active]="isVisible('overview-fixtures')"
          (click)="setView('overview-fixtures')"
        >
          Fixtures
        </li>
        <li
          [class.active]="isVisible('overview-statistics')"
          (click)="setView('overview-statistics')"
        >
          Fixture-Statistics
        </li>
        <li
          [class.active]="isVisible('overview-events')"
          (click)="setView('overview-events')"
        >
          Fixture-Events
        </li>
      </ul>
    </section>

    <section class="nav">
      <h4 class="group-title">Daten laden</h4>
      <ul>
        <li
          [class.active]="isVisible('update-standings')"
          (click)="setView('update-standings')"
        >
          Standings
        </li>
        <li
          [class.active]="isVisible('update-fixtures')"
          (click)="setView('update-fixtures')"
        >
          Fixtures
        </li>
        <li
          [class.active]="isVisible('update-statistics')"
          (click)="setView('update-statistics')"
        >
          Fixture-Statistics
        </li>
      </ul>
    </section>

    <section class="overview">
      <futbet-admin-sidebar-details />
    </section>
  `,
})
export class SidebarComponent {
  as = inject(AdminService);
  activeView = this.as.view;

  isVisible(view: AdminView) {
    return this.activeView() === view;
  }

  setView(view: AdminView) {
    this.activeView.set(view);
  }
}
