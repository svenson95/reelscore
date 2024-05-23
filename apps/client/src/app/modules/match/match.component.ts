import { Component, signal } from '@angular/core';

import {
  MatchAfterDetailsComponent,
  MatchBeforeDetailsComponent,
  MatchResultComponent,
} from './components';
import { MatchDetails } from './models';

const MATCH_DETAILS_EXAMPLE: MatchDetails = {
  home: 'Bayern München',
  away: 'Borussia Dortmund',
  homeLogo: 'https://media.api-sports.io/football/teams/157.png',
  awayLogo: 'https://media.api-sports.io/football/teams/165.png',
  date: '23. Mai',
  time: '20:30',
  result: '1 - 0',
};

@Component({
  selector: 'futbet-match',
  standalone: true,
  imports: [
    MatchResultComponent,
    MatchBeforeDetailsComponent,
    MatchAfterDetailsComponent,
  ],
  styles: `
    :host { @apply w-full; } 
    
    futbet-match-result, 
    futbet-match-before-details, 
    futbet-match-after-details { @apply py-5 text-center; }

    futbet-match-before-details, 
    futbet-match-after-details { @apply gap-5 flex flex-col; }
  `,
  template: `
    <futbet-match-result [data]="matchDetails()" [isUpcoming]="isUpcoming()" />

    @switch(isUpcoming()) { @case(true) {
    <futbet-match-before-details />
    } @case(false) {
    <futbet-match-after-details />
    }}
  `,
})
export class MatchComponent {
  isUpcoming = signal<boolean>(true);
  matchDetails = signal<MatchDetails>(MATCH_DETAILS_EXAMPLE);
}
