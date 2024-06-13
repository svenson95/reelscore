import { Component } from '@angular/core';

import { ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';
import {
  DateBarComponent,
  MatchDayComponent,
  StandingsComponent,
} from './components';
import { SERVICE_PROVIDERS } from './services';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchDayComponent, StandingsComponent],
  providers: [...SERVICE_PROVIDERS, ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { 
      @apply flex flex-col w-full; 

      section {
        @apply max-w-fb-max-width inline-flex flex-wrap md:flex-nowrap w-full gap-5 mx-auto;

        futbet-match-day, futbet-standings {
          @apply w-full min-w-[200px];
        }
      }
    }
  `,
  template: `
    <futbet-date-bar />

    <section>
      <futbet-match-day />
      <futbet-standings />
    </section>
  `,
})
export class LeagueComponent extends RouterView {}
