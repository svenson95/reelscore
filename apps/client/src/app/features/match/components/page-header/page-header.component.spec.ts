import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { formatFixtureTime } from '@reelscore-sdk/helpers';
import type { GetFixtureDTO } from '@reelscore-sdk/models';

import {
  EXAMPLE_FIXTURE,
  readElementText,
  renderComponent,
} from '@testing/client';

import { LiveRefreshService } from '@app/shared';

import { MatchFacade } from '../../match.facade';

import { PageHeaderComponent } from './page-header.component';

const fixtureState = signal<GetFixtureDTO | null>(null);
const locationMock = { back: jest.fn() };

describe('PageHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [
        {
          provide: MatchFacade,
          useValue: { fixture: fixtureState, routerDate: signal('2026-05-30') },
        },
        { provide: Location, useValue: locationMock },
        {
          provide: LiveRefreshService,
          useValue: { timer: signal(30), isRunning: signal(false) },
        },
      ],
    });
  });

  it('shows the route date, navigates back and replaces the kickoff placeholder when fixture data arrives', () => {
    const componentFixture = renderComponent(PageHeaderComponent, {});

    expect(readElementText(componentFixture.nativeElement)).toContain(
      '30.05.26'
    );
    expect(
      componentFixture.nativeElement.querySelector('.date-placeholder')
    ).not.toBeNull();

    componentFixture.nativeElement.querySelector('button').click();

    expect(locationMock.back).toHaveBeenCalledTimes(1);

    fixtureState.set({ data: EXAMPLE_FIXTURE, highlights: [] });
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('.date-placeholder')
    ).toBeNull();
    expect(readElementText(componentFixture.nativeElement)).toContain(
      formatFixtureTime(EXAMPLE_FIXTURE.fixture.timestamp)
    );

    fixtureState.set(null);
    componentFixture.detectChanges();

    expect(
      componentFixture.nativeElement.querySelector('.date-placeholder')
    ).not.toBeNull();
  });
});
