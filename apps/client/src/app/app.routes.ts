import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const adminGuard = () => {
  const router = inject(Router);
  return environment.isAdmin ? true : router.navigate(['/']);
};

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
    canActivate: [adminGuard],
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
