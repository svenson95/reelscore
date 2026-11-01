import type { Routes } from '@angular/router';

import { getTodayDateString } from '@reelscore-sdk/helpers';

export const redirectToToday = (): string => `/${getTodayDateString()}`;

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: redirectToToday,
  },
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
    path: '**',
    redirectTo: redirectToToday,
  },
];
