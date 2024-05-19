import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/league/league.component').then(
        (m) => m.LeagueComponent
      ),
  },
  {
    path: 'leagues/:url',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/league/league.component').then(
            (m) => m.LeagueComponent
          ),
      },
      {
        path: 'match/:id',
        loadComponent: () =>
          import('./modules/match/match.component').then(
            (m) => m.MatchComponent
          ),
      },
    ],
  },
];
