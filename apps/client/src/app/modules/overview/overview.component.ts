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
  selector: 'rs-index-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, OverviewContentComponent],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { 
      @apply flex flex-col w-full; 
    }
  `,
  template: `
    <section class="page-header animate-drop-from-top" rs-date-bar></section>
    <section class="overview-content" rs-overview-content></section>
  `,
})
export class OverviewComponent extends RouterView implements OnInit {
  visibilityObserverService = inject(VisibilityObserverService);

  ngOnInit(): void {
    this.visibilityObserverService.init();
  }
}
