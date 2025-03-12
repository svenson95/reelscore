import { Component } from '@angular/core';

import { DateBarComponent, TabGroupComponent } from './components';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [DateBarComponent, TabGroupComponent],
  styles: `
    :host { 
      @apply flex flex-col w-full; 
    }
  `,
  template: `
    <reelscore-date-bar />

    <reelscore-start-tab-group />
  `,
})
export class StartComponent {}
