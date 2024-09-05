import { Component } from '@angular/core';

import { RouterView } from '../router-view';
import {
  DateBarComponent,
  MatchesComponent,
  StandingsComponent,
} from './components';
import { StandingStore } from './store';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [DateBarComponent, MatchesComponent, StandingsComponent],
  providers: [StandingStore],
  styles: `
    :host { 
      @apply flex flex-col w-full; 

      section {
        @apply max-w-fb-max-width inline-flex flex-wrap md:flex-nowrap w-full gap-5 mx-auto;

        reelscore-matches, reelscore-standings {
          @apply w-full min-w-[200px];
        }
      }
    }
  `,
  template: `
    <reelscore-date-bar />

    <section>
      <reelscore-matches />
      <reelscore-standings />
    </section>
  `,
})
export class StartComponent extends RouterView {}
