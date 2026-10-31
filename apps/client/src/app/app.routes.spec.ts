import { routes } from './app.routes';

describe('app routes', () => {
  it('loads the overview at the root route', async () => {
    const homeRoute = routes.find((route) => route.path === '');

    expect(homeRoute?.redirectTo).toBeUndefined();
    expect(homeRoute?.loadComponent).toBeDefined();
    expect(homeRoute?.data?.['shouldReuse']).toBe(true);

    await expect(homeRoute?.loadComponent?.()).resolves.toBeDefined();
  });
});
