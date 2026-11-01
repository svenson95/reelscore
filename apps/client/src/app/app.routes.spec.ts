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
});
