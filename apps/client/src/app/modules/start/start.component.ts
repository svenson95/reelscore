import { Component } from '@angular/core';

import { ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';
import {
  DateBarComponent,
  MatchDayComponent,
  StandingsComponent,
} from './components';
import { FILTER_SERVICE_PROVIDER } from './services';
import { StandingStore } from './store';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [DateBarComponent, MatchDayComponent, StandingsComponent],
  providers: [ROUTE_SERVICE_PROVIDER, FILTER_SERVICE_PROVIDER, StandingStore],
  styles: `
    :host { 
      @apply flex flex-col w-full; 

      section {
        @apply max-w-fb-max-width inline-flex flex-wrap md:flex-nowrap w-full gap-5 mx-auto;

        reelscore-match-day, reelscore-standings {
          @apply w-full min-w-[200px];
        }
      }
    }
  `,
  template: `
    <reelscore-date-bar />

    <section>
      <reelscore-match-day />
      <reelscore-standings />
    </section>
  `,
})
export class StartComponent extends RouterView {}
