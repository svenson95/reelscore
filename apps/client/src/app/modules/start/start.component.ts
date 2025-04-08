import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterView } from '../router-view';

import { DateBarComponent, TabGroupComponent } from './components';

@Component({
  selector: 'rs-start-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, TabGroupComponent],
  styles: `
    :host { 
      @apply flex flex-col w-full; 
    }
  `,
  template: `
    <rs-date-bar class="animate-drop-from-top" />

    <rs-start-tab-group />
  `,
})
export class StartComponent extends RouterView {}
