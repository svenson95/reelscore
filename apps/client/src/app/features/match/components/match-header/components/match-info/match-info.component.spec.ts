import { TestBed } from '@angular/core/testing';

import { EXAMPLE_FIXTURE } from '../../../../../../../testing/fixtures.mock';
import {
  readElementText,
  renderComponent,
} from '../../../../../../../testing/match-components.testing';

import { MatchInfoComponent } from './match-info.component';

describe('MatchInfoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatchInfoComponent] });
  });

  it('renders team placeholders without a status while no fixture is available', () => {
    const componentFixture = renderComponent(MatchInfoComponent, {
      data: null,
    });

    expect(
      componentFixture.nativeElement.querySelectorAll('.rs-skeleton')
    ).toHaveLength(4);
    expect(componentFixture.nativeElement.querySelector('.status')).toBeNull();
  });

  it.each([
    ['NS', '', false],
    ['1H', "48'", true],
    ['HT', 'HZ', true],
    ['INT', 'Unterbrechung', true],
    ['P', 'Elfmeterschießen', true],
    ['FT', 'ENDE', false],
    ['CANC', 'Abgesagt', false],
  ] as const)(
    'renders the %s status and reacts to updates',
    (fixtureStatus, expectedStatusLabel, isPlaying) => {
      const componentFixture = renderComponent(MatchInfoComponent, {
        data: EXAMPLE_FIXTURE,
      });

      componentFixture.componentRef.setInput('data', {
        ...EXAMPLE_FIXTURE,
        fixture: {
          ...EXAMPLE_FIXTURE.fixture,
          status: { short: fixtureStatus, long: '', elapsed: 45, extra: 3 },
        },
      });
      componentFixture.detectChanges();

      const statusElement =
        componentFixture.nativeElement.querySelector('.status');

      expect(statusElement ? readElementText(statusElement) : '').toBe(
        expectedStatusLabel
      );

      if (statusElement) {
        expect(statusElement.classList.contains('is-playing')).toBe(isPlaying);
      }

      expect(readElementText(componentFixture.nativeElement)).toContain(
        'Arsenal'
      );
    }
  );
});
