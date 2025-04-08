import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterView } from '../router-view';

import { DateBarComponent, OverviewContentComponent } from './components';

@Component({
  selector: 'rs-index-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, OverviewContentComponent],
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
export class OverviewComponent extends RouterView {}
