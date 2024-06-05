import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { AdminService } from '../../services';
import { ContentOverviewComponent } from './components/overview/overview.component';
import { ContentUpdateComponent } from './components/update/update.component';

@Component({
  selector: 'futbet-admin-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContentUpdateComponent, ContentOverviewComponent],
  styles: `
    :host { @apply flex flex-col flex-[3]; }
  `,
  template: `
    @switch(activeView()) { @case('overview') {
    <futbet-admin-content-overview />
    } @case('update') {
    <futbet-admin-content-update />
    } }
  `,
})
export class ContentComponent {
  as = inject(AdminService);
  activeView = computed(() => {
    const state = this.as.view();
    return state.slice(0, state.indexOf('-'));
  });
}
