import { Component } from '@angular/core';

import { ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';
import { StandingsComponent } from './components';
import { SERVICE_PROVIDERS } from './services';

@Component({
  selector: 'reelscore-league',
  standalone: true,
  imports: [StandingsComponent],
  providers: [...SERVICE_PROVIDERS, ROUTE_SERVICE_PROVIDER],
  styles: ``,
  template: ` league works ... `,
})
export class LeagueComponent extends RouterView {}
