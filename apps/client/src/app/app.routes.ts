import type { Routes } from '@angular/router';

import { getTodayDateString } from '@lib/shared';

export const routes: Routes = [
  {
    path: ':date/:competitionUrl/:fixtureId',
    loadComponent: () =>
      import('./features/match/match.component').then((m) => m.MatchComponent),
  },
  {
    path: ':date',
    loadComponent: () =>
      import('./features/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
    data: { shouldReuse: true },
  },
  {
    path: 'competition/:competitionUrl',
    loadComponent: () =>
      import('./features/competition/competition.component').then(
        (m) => m.CompetitionComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: getTodayDateString(),
  },
];
