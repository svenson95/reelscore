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
    path: 'admin',
    loadComponent: () =>
      import('./modules/admin/admin.component').then((m) => m.AdminComponent),
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
        path: 'match/:fixtureId',
        loadComponent: () =>
          import('./modules/match/match.component').then(
            (m) => m.MatchComponent
          ),
      },
    ],
  },
];
