import { renderComponent } from '@testing/client';

import { EventPlayerPhotoComponent } from './event-player-photo.component';

describe('EventPlayerPhotoComponent', () => {
  it('uses the API-Football player image for an identified player', () => {
    const componentFixture = renderComponent(EventPlayerPhotoComponent, {
      playerId: 42,
    });
    const image = componentFixture.nativeElement.querySelector('img');

    expect(image.getAttribute('src')).toBe(
      'https://media.api-sports.io/football/players/42.png'
    );
    expect(image.getAttribute('alt')).toBe('');
  });

  it('omits the image when the player ID is missing', () => {
    const componentFixture = renderComponent(EventPlayerPhotoComponent, {
      playerId: 0,
    });

    expect(componentFixture.nativeElement.querySelector('img')).toBeNull();
  });
});
