import { Component } from '@angular/core';

import {
  DateBarComponent,
  MatchDayComponent,
  StandingsComponent,
} from '../../components';
import { ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchDayComponent, StandingsComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
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
    <futbet-start-date-bar />

    <section>
      <futbet-match-day />
      <futbet-standings />
    </section>
  `,
})
export class LeagueComponent extends RouterView {}
