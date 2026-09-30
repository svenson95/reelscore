import { TestBed } from '@angular/core/testing';

import { EXAMPLE_FIXTURE } from '../../../../../../../../testing/fixtures.mock';

import { MatchFixtureDataComponent } from './fixture-data.component';

describe('MatchFixtureDataComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchFixtureDataComponent],
    }).compileComponents();
  });

  const createComponent = (isLoading = false) => {
    const view = TestBed.createComponent(MatchFixtureDataComponent);
    view.componentRef.setInput('fixture', EXAMPLE_FIXTURE);
    view.componentRef.setInput('isLoading', isLoading);
    view.detectChanges();
    return view;
  };

  const readRows = (element: HTMLElement) =>
    Array.from(element.querySelectorAll('li')).map((row) => [
      row.querySelector('.key')?.textContent?.trim(),
      row.querySelector('.value')?.textContent?.trim(),
    ]);

  it('should render fixture details in order with a translated round', () => {
    const view = createComponent();

    expect(readRows(view.nativeElement)).toEqual([
      ['Wettbewerb', 'UEFA Champions League'],
      ['Spieltag', 'Finale'],
      ['Stadion', 'Puskas Arena'],
      ['Stadt', 'Budapest'],
      ['Schiedsrichter', 'D. Siebert'],
    ]);
    expect(view.nativeElement.querySelector('.rs-skeleton')).toBeNull();
    expect(
      view.nativeElement
        .querySelector('.fixture-data')
        .getAttribute('aria-busy')
    ).toBe('false');
  });

  it('should hide fixture values while loading and reveal them when loading finishes', () => {
    const view = createComponent(true);

    expect(view.nativeElement.querySelectorAll('.rs-skeleton')).toHaveLength(5);
    expect(
      readRows(view.nativeElement).every(([, value]) => value === '')
    ).toBe(true);
    expect(
      view.nativeElement
        .querySelector('.fixture-data')
        .getAttribute('aria-busy')
    ).toBe('true');

    view.componentRef.setInput('isLoading', false);
    view.detectChanges();

    expect(view.nativeElement.querySelector('.rs-skeleton')).toBeNull();
    expect(view.nativeElement.textContent).toContain('Puskas Arena');
  });

  it('should show placeholders when fixture data is removed without a loading flag', () => {
    const view = createComponent();

    view.componentRef.setInput('fixture', null);
    view.detectChanges();

    expect(view.nativeElement.querySelectorAll('.rs-skeleton')).toHaveLength(5);
    expect(
      readRows(view.nativeElement).every(([, value]) => value === '')
    ).toBe(true);
    expect(
      view.nativeElement
        .querySelector('.fixture-data')
        .getAttribute('aria-busy')
    ).toBe('false');
  });

  it('should update the round translation for a changed competition and season', () => {
    const view = createComponent();

    view.componentRef.setInput('fixture', {
      ...EXAMPLE_FIXTURE,
      league: {
        ...EXAMPLE_FIXTURE.league,
        id: 78,
        season: 2026,
        round: 'Regular Season - 3',
      },
    });
    view.detectChanges();

    expect(readRows(view.nativeElement)[1]).toEqual([
      'Spieltag',
      '3. Spieltag',
    ]);
  });
});
