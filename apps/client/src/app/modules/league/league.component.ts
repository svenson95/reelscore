import { Component } from '@angular/core';

import { RouteService } from '../../services';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [],
  providers: [RouteService],
  template: ` <p>league works! {{ selectedLeague()?.label }}</p> `,
})
export class LeagueComponent extends RouterView {}
