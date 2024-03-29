import { Routes } from '@angular/router';

import { LeagueComponent, MatchComponent, StartComponent } from './modules';

export const routes: Routes = [
  {
    path: '',
    component: StartComponent,
  },
  {
    path: 'leagues/:url',
    children: [
      {
        path: '',
        component: LeagueComponent,
      },
      {
        path: 'match/:id',
        component: MatchComponent,
      },
    ],
  },
];
