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

  it.each([
    { teamId: 1, logo: null },
    { teamId: 1, logo: 'https://media.api-sports.io/football/teams/1.png' },
    { teamId: null, logo: null },
  ])(
    'uses local logos and preserves the fallback with team ID $teamId and logo $logo',
    ({ teamId, logo }) => {
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
            team: { id: teamId, name: 'Germany', logo, colors: null },
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
        fixture.nativeElement.querySelector(
          '.team-header .missing-image-placeholder'
        )
      ).not.toBeNull();

      const teamLogo = fixture.nativeElement.querySelector(
        '.team-header img'
      ) as HTMLImageElement | null;

      if (teamId !== null) {
        expect(teamLogo?.getAttribute('src')).toBe(
          'assets/images/team-logo-responsive/14x14/1@1x.png'
        );
        expect(teamLogo?.getAttribute('srcset')).toBe(
          'assets/images/team-logo-responsive/14x14/1@1x.png 1x, ' +
            'assets/images/team-logo-responsive/14x14/1@2x.png 2x, ' +
            'assets/images/team-logo-responsive/14x14/1@3x.png 3x'
        );
        teamLogo?.dispatchEvent(new Event('error'));
        fixture.detectChanges();
      }

      expect(
        fixture.nativeElement.querySelector('.team-header img')
      ).toBeNull();
      expect(
        fixture.nativeElement.querySelector(
          '.team-header .missing-image-placeholder'
        )
      ).not.toBeNull();
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
    }
  );
});
