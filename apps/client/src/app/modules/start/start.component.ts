import { Component } from '@angular/core';

import { RouteService } from '../../services/route.service';
import { RouterView } from '../router-view';
import { MatchDayListComponent } from './components';
import { DateBarComponent } from '../../components';

@Component({
  selector: 'futbet-start',
  standalone: true,
  imports: [DateBarComponent, MatchDayListComponent],
  template: `
    <futbet-start-date-bar />
    <futbet-start-match-day-list />
  `,
  providers: [RouteService],
})
export class StartComponent extends RouterView {}
