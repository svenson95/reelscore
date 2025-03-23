import { Routes } from '@angular/router';
import { TODAY_DATE_STRING } from './shared';

export const routes: Routes = [
  {
    path: ':date',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/start/start.component').then(
            (m) => m.StartComponent
          ),
        data: { shouldReuse: true },
      },
      {
        path: ':competitionUrl/:fixtureId',
        loadComponent: () =>
          import('./modules/match/match.component').then(
            (m) => m.MatchComponent
          ),
      },
    ],
  },
  {
    path: 'competition/:competitionUrl',
    loadComponent: () =>
      import('./modules/competition/competition.component').then(
        (m) => m.CompetitionComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: TODAY_DATE_STRING,
  },
];
