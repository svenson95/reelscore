import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import type { MatchLineupsResult } from '@reelscore-sdk/models';

import { HttpFixtureLineupsService } from '../../../../../data-access';
import { FixtureLineupsStore } from '../../../../../state';

import { FixtureLineupsComponent } from './fixture-lineups.component';

describe('FixtureLineupsComponent', () => {
  it('shows an empty state and an initial loading error', () => {
    const requests: Subject<MatchLineupsResult>[] = [];
    TestBed.configureTestingModule({
      providers: [
        FixtureLineupsStore,
        {
          provide: HttpFixtureLineupsService,
          useValue: {
            getLineups: () => {
              const request = new Subject<MatchLineupsResult>();
              requests.push(request);
              return request;
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(FixtureLineupsComponent);
    const store = TestBed.inject(FixtureLineupsStore);
    store.loadLineups(1);
    fixture.detectChanges();
    requests[0].next({ lineups: [], playerStatistics: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Keine Aufstellungen verfügbar'
    );

    store.loadLineups(2);
    fixture.detectChanges();
    requests[1].error(new Error('Unavailable'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Fehler beim Laden der Aufstellungen'
    );
  });

  it('shows loading, lineups without player statistics and refresh errors', () => {
    const requests: Subject<MatchLineupsResult>[] = [];
    TestBed.configureTestingModule({
      providers: [
        FixtureLineupsStore,
        {
          provide: HttpFixtureLineupsService,
          useValue: {
            getLineups: () => {
              const request = new Subject<MatchLineupsResult>();
              requests.push(request);
              return request;
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(FixtureLineupsComponent);
    const store = TestBed.inject(FixtureLineupsStore);
    store.loadLineups(123);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Aufstellungen werden geladen'
    );

    requests[0].next({
      lineups: [
        {
          team: { id: 1, name: 'Germany', logo: null, colors: null },
          formation: '4-3-3',
          startXI: [
            {
              player: {
                id: 10,
                name: 'F. Wirtz',
                number: 17,
                pos: 'M',
                grid: '1:1',
              },
            },
          ],
          substitutes: [],
          coach: { id: null, name: null, photo: null },
        },
      ],
      playerStatistics: [],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Deutschland');
    expect(
      fixture.nativeElement
        .querySelector('.pitch-player-name')
        .textContent.trim()
    ).toBe('Wirtz');
    expect(fixture.nativeElement.textContent).toContain('Mittelfeld');

    store.loadLineups(123);
    fixture.detectChanges();
    requests[1].error(new Error('Unavailable'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Aktualisierung der Aufstellungen fehlgeschlagen'
    );
    expect(fixture.nativeElement.textContent).toContain('Wirtz');
  });
});
