import { expect, test } from '@playwright/test';

test.describe('App startup', () => {
  test('keeps startup overlay visible until the app has initialized', async ({
    page,
  }) => {
    let releaseMainBundle!: () => void;

    const mainBundleReleased = new Promise<void>((resolve) => {
      releaseMainBundle = resolve;
    });

    await page.route('**/main.js*', async (route) => {
      await mainBundleReleased;
      await route.continue();
    });

    await page.goto('/', {
      waitUntil: 'commit',
    });

    const startupOverlay = page.getByTestId('startup-overlay');

    await expect(startupOverlay).toBeVisible();

    releaseMainBundle();

    await page.waitForLoadState('load');

    await expect(page.locator('rs-root')).toBeVisible();

    await expect(startupOverlay).toBeHidden({
      timeout: 5_000,
    });

    await expect(startupOverlay).toHaveCount(0, {
      timeout: 5_000,
    });
  });
});
