import type { Router } from '@angular/router';

import type { FixtureDTO, FixtureId } from '@reelscore-sdk/models';

import { ALLIANZ_ARENA_ID, VENUE_IDS } from './venue-ids.data';

export interface PreparedFixtureVenueImage {
  fixtureId: number;
  venueId: number;
  imageUrl: string;
}

let preparedFixtureVenueImage: PreparedFixtureVenueImage | undefined;
let isOpeningMatch = false;

// The header picks up the ready image before it renders. Clear this temporary
// slot afterwards; the header will keep the image until it is destroyed.
export const takePreparedFixtureVenueImage = (
  fixtureId: FixtureId
): PreparedFixtureVenueImage | undefined => {
  if (preparedFixtureVenueImage?.fixtureId !== Number(fixtureId)) {
    return undefined;
  }

  const preparedImage = preparedFixtureVenueImage;
  preparedFixtureVenueImage = undefined;

  return preparedImage;
};

const isValidVenueImage = async (imageUrl: string): Promise<boolean> => {
  const image = new Image();

  try {
    image.src = imageUrl;
    await image.decode();

    // Small images from this provider are placeholders for missing venues.
    return image.naturalWidth > 200 && image.naturalHeight > 200;
  } catch {
    return false;
  }
};

const loadVenueImageUrl = async (
  venueId: number
): Promise<string | undefined> => {
  try {
    const response = await fetch(
      `https://media.api-sports.io/football/venues/${venueId}.png`,
      { referrerPolicy: 'no-referrer' }
    );

    if (!response.ok) {
      return undefined;
    }

    const imageUrl = URL.createObjectURL(await response.blob());

    if (await isValidVenueImage(imageUrl)) {
      return imageUrl;
    }

    URL.revokeObjectURL(imageUrl);

    return undefined;
  } catch {
    return undefined;
  }
};

const loadValidVenueImageUrl = async (
  venueId: number
): Promise<string | undefined> => {
  const venueImageUrl = await loadVenueImageUrl(venueId);

  if (venueImageUrl || venueId === ALLIANZ_ARENA_ID) {
    return venueImageUrl;
  }

  return loadVenueImageUrl(ALLIANZ_ARENA_ID);
};

export const navigateToFixtureAfterVenueImage = async (
  event: MouseEvent,
  fixture: FixtureDTO,
  fixtureLink: string[],
  router: Router
): Promise<void> => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();

  if (isOpeningMatch) {
    return;
  }

  isOpeningMatch = true;

  try {
    const venueId = VENUE_IDS[fixture.teams.home.id] ?? ALLIANZ_ARENA_ID;
    const imageUrl = await loadValidVenueImageUrl(venueId);

    if (!imageUrl) {
      return;
    }

    if (preparedFixtureVenueImage) {
      URL.revokeObjectURL(preparedFixtureVenueImage.imageUrl);
    }

    const preparedImage: PreparedFixtureVenueImage = {
      fixtureId: Number(fixture.fixture.id),
      venueId,
      imageUrl,
    };
    preparedFixtureVenueImage = preparedImage;

    let navigationSucceeded = false;

    try {
      navigationSucceeded = await router.navigateByUrl(
        router.createUrlTree(fixtureLink)
      );
    } finally {
      if (!navigationSucceeded && preparedFixtureVenueImage === preparedImage) {
        URL.revokeObjectURL(imageUrl);
        preparedFixtureVenueImage = undefined;
      }
    }
  } finally {
    isOpeningMatch = false;
  }
};
