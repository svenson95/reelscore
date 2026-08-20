import { expect, test } from '@playwright/test';

import { AppPage } from '../../pages';

test.describe('App', () => {
  test('keeps startup overlay visible until the app has initialized', async ({
    page,
  }) => {
    const appPage = new AppPage(page);

    /**
     * We intentionally delay loading Angular's main bundle.
     *
     * This gives us a deterministic point in time where the initial HTML
     * has already been loaded, but Angular has not bootstrapped yet.
     * At this point the startup overlay must still be visible.
     */
    let releaseMainBundle!: () => void;

    const mainBundleReleased = new Promise<void>((resolve) => {
      releaseMainBundle = resolve;
    });

    /**
     * Intercept the request for main.js and keep it pending until
     * releaseMainBundle() is called below.
     */
    await page.route('**/main.js*', async (route) => {
      await mainBundleReleased;
      await route.continue();
    });

    /**
     * Load the initial HTML without waiting for main.js.
     * main.js is intentionally blocked so we can verify
     * that the startup overlay is visible before Angular starts.
     */
    await appPage.goto({
      waitUntil: 'commit',
    });

    await expect(appPage.startupOverlay).toBeVisible();

    // Allow main.js to load so Angular can bootstrap the application.
    releaseMainBundle();

    await page.waitForLoadState('load');

    await expect(appPage.root).toBeVisible();

    await expect(appPage.startupOverlay).toHaveCount(0, {
      timeout: 5_000,
    });
  });
});
