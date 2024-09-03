import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/start/start.component').then((m) => m.StartComponent),
  },
  {
    path: 'leagues/:leagueUrl',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/competition/competition.component').then(
            (m) => m.CompetitionComponent
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
