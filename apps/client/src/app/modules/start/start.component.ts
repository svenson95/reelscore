import { Component } from '@angular/core';

import { RouteService } from '../../services/route.service';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-start',
  standalone: true,
  imports: [],
  template: `<p>start works!</p> `,
  providers: [RouteService],
})
export class StartComponent extends RouterView {}
