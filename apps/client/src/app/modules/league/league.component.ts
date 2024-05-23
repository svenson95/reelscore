import { Component } from '@angular/core';

import { DateBarComponent } from '../../components';
import { ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';

import { MatchDayComponent, StandingsComponent } from './components';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchDayComponent, StandingsComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { 
      @apply w-full; 

      section {
        @apply inline-flex flex-wrap md:flex-nowrap w-full gap-5;

        > * {
          @apply w-full min-w-[200px];
        }
      }
    }
  `,
  template: `
    <futbet-start-date-bar />

    <section>
      <futbet-league-match-day />

      <futbet-league-standings />
    </section>
  `,
})
export class LeagueComponent extends RouterView {}
