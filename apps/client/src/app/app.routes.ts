import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/overview/overview.page').then((m) => m.OverviewPage),
    data: { shouldReuse: true },
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
];
