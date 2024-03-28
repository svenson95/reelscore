import { Component } from '@angular/core';

import { DateBarComponent, MatchListComponent } from '../../components';
import { RouteService } from '../../services/route.service';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-start',
  standalone: true,
  imports: [DateBarComponent, MatchListComponent],
  template: `
    <futbet-start-date-bar />
    <futbet-start-match-list />
  `,
  providers: [RouteService],
})
export class StartComponent extends RouterView {}
