import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { RouterView } from '../router-view';

import { DateBarComponent, OverviewContentComponent } from './components';
import { SERVICE_PROVIDERS, VisibilityObserverService } from './services';
import { STORE_PROVIDERS } from './store';

@Component({
  selector: 'rs-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, OverviewContentComponent],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply flex flex-col w-full; }
  `,
  template: `
    <nav
      aria-label="Date-Bar Navigation"
      rs-date-bar
      class="animate-drop-from-top"
    ></nav>
    <section class="overview-content" rs-overview-content></section>
  `,
})
export class OverviewComponent extends RouterView implements OnInit {
  visibilityObserverService = inject(VisibilityObserverService);

  ngOnInit(): void {
    this.visibilityObserverService.init();
  }
}
