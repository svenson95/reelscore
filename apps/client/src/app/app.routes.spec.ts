import { getTodayDateString } from '@reelscore-sdk/helpers';

import { redirectToToday, routes } from './app.routes';

describe('app routes', () => {
  it('redirects the root route to today', () => {
    const rootRoute = routes.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe(redirectToToday);
    expect(redirectToToday()).toBe(`/${getTodayDateString()}`);
  });

  it('redirects unmatched routes to today', () => {
    const wildcardRoute = routes.find((route) => route.path === '**');

    expect(wildcardRoute?.redirectTo).toBe(redirectToToday);
  });

  it('keeps the match, overview, and competition pages lazy-loaded', async () => {
    const matchRoute = routes.find(
      (route) => route.path === ':date/:competitionUrl/:fixtureId'
    );
    const overviewRoute = routes.find((route) => route.path === ':date');
    const competitionRoute = routes.find(
      (route) => route.path === 'competition/:competitionUrl'
    );

    await expect(matchRoute?.loadComponent?.()).resolves.toBeDefined();
    await expect(overviewRoute?.loadComponent?.()).resolves.toBeDefined();
    await expect(competitionRoute?.loadComponent?.()).resolves.toBeDefined();
    expect(overviewRoute?.data?.['shouldReuse']).toBe(true);
  });
});
