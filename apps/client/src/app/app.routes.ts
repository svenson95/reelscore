import { Routes } from '@angular/router';
import moment from 'moment-timezone';

const TODAY_DATE_STRING = moment.tz('Europe/Berlin').format('YYYY-MM-DD');

export const routes: Routes = [
  {
    path: ':date',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/overview/overview.component').then(
            (m) => m.OverviewComponent
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
