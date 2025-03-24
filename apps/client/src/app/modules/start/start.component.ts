import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterView } from '../router-view';

import { DateBarComponent, TabGroupComponent } from './components';

@Component({
  selector: 'reelscore-start-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, TabGroupComponent],
  styles: `
    :host { 
      @apply flex flex-col w-full; 
    }
  `,
  template: `
    <reelscore-date-bar class="animate-drop-from-top" />

    <reelscore-start-tab-group />
  `,
})
export class StartComponent extends RouterView {}
