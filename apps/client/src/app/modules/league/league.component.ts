import { Component } from '@angular/core';

import { DateBarComponent } from '../../components';
import { ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';

import { MatchListsComponent, StandingsComponent } from './components';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchListsComponent, StandingsComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { 
      @apply w-full; 

      section {
        @apply inline-flex flex-wrap w-full gap-5;

        > * {
          @apply flex-1;
        }
      }
    }
  `,
  template: `
    <futbet-start-date-bar />

    <section>
      <futbet-league-match-lists />

      <futbet-league-standings />
    </section>
  `,
})
export class LeagueComponent extends RouterView {}
