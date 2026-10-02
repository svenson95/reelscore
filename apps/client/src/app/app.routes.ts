import type { Routes } from '@angular/router';

import { getTodayDateString } from '@reelscore-sdk/helpers';

export const routes: Routes = [
  {
    path: ':date/:competitionUrl/:fixtureId',
    loadComponent: () =>
      import('./features/match/match.page').then((m) => m.MatchPage),
  },
  {
    path: ':date',
    loadComponent: () =>
      import('./features/overview/overview.page').then((m) => m.OverviewPage),
    data: { shouldReuse: true },
  },
  {
    path: 'competition/:competitionUrl',
    loadComponent: () =>
      import('./features/competition/competition.page').then(
        (m) => m.CompetitionPage
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: getTodayDateString(),
  },
];
