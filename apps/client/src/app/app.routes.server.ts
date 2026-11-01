import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':date/:competitionUrl/:fixtureId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'competition/:competitionUrl',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
