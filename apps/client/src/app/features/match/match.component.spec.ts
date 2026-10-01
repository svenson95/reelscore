import { Component, input, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type {
  ExtendedFixtureDTO,
  FixtureHighlights,
  FixtureId,
  GetFixtureDTO,
} from '@reelscore-sdk/models';

import type { CompetitionUrl } from '@lib/models';

import { EXAMPLE_FIXTURE } from '../../../testing/fixtures.mock';

import {
  MatchDetailsComponent,
  MatchHeaderComponent,
  PageHeaderComponent,
} from './components';
import { MatchComponent } from './match.component';
import { MatchFacade } from './match.facade';
import {
  MatchRealtimeService,
  MatchRefreshService,
  SERVICE_PROVIDERS,
} from './services';
import { STORE_PROVIDERS } from './stores';

@Component({
  selector: 'nav[rs-page-header]',
  template: '',
})
class PageHeaderStubComponent {}

@Component({
  selector: 'section[rs-match-header]',
  template: '',
})
class MatchHeaderStubComponent {
  readonly data = input.required<ExtendedFixtureDTO | null>();
  readonly highlights = input.required<FixtureHighlights | null>();
}

@Component({
  selector: 'section[rs-match-details]',
  template: '',
})
class MatchDetailsStubComponent {}

describe('MatchComponent', () => {
  let componentFixture: ComponentFixture<MatchComponent>;

  const fixture = signal<GetFixtureDTO | null>(null);
  const data = signal<ExtendedFixtureDTO | null>(null);
  const error = signal<string | null>(null);

  const facadeMock = {
    fixture,
    data,
    error,
    loadFixture: jest.fn<void, [FixtureId]>(),
    handleInvalidUrl: jest.fn<void, [CompetitionUrl]>(),
  };

  const refreshServiceMock = {
    init: jest.fn<void, [FixtureId]>(),
    destroy: jest.fn<void, []>(),
  };

  const unregisterRealtime = jest.fn<void, []>();

  const matchRealtimeServiceMock = {
    register: jest.fn<() => void, [FixtureId]>(() => unregisterRealtime),
  };

  beforeEach(async () => {
    fixture.set(null);
    data.set(null);
    error.set(null);
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MatchComponent],
    })
      .overrideComponent(MatchComponent, {
        remove: {
          imports: [
            PageHeaderComponent,
            MatchHeaderComponent,
            MatchDetailsComponent,
          ],
          providers: [MatchFacade, ...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
        },
        add: {
          imports: [
            PageHeaderStubComponent,
            MatchHeaderStubComponent,
            MatchDetailsStubComponent,
          ],
          providers: [
            { provide: MatchFacade, useValue: facadeMock },
            { provide: MatchRefreshService, useValue: refreshServiceMock },
            {
              provide: MatchRealtimeService,
              useValue: matchRealtimeServiceMock,
            },
          ],
        },
      })
      .compileComponents();
  });

  const createComponent = ({
    fixtureId = EXAMPLE_FIXTURE.fixture.id,
    competitionUrl = 'champions-league',
  }: {
    fixtureId?: FixtureId;
    competitionUrl?: CompetitionUrl;
  } = {}): ComponentFixture<MatchComponent> => {
    componentFixture = TestBed.createComponent(MatchComponent);
    componentFixture.componentRef.setInput('fixtureId', fixtureId);
    componentFixture.componentRef.setInput('competitionUrl', competitionUrl);
    componentFixture.detectChanges();

    return componentFixture;
  };

  it('should render only the error state when loading failed', () => {
    error.set('Request failed');

    const view = createComponent();

    expect(view.nativeElement.textContent).toContain(
      'Es ist ein Fehler aufgetreten.'
    );
    expect(view.nativeElement.querySelector('nav[rs-page-header]')).toBeNull();
    expect(
      view.nativeElement.querySelector('section[rs-match-header]')
    ).toBeNull();
    expect(
      view.nativeElement.querySelector('section[rs-match-details]')
    ).toBeNull();
  });

  it('should pass fixture data and highlights to the match header', () => {
    const highlights: FixtureHighlights = [];
    const getFixture: GetFixtureDTO = {
      data: EXAMPLE_FIXTURE,
      highlights,
    };
    fixture.set(getFixture);
    data.set(EXAMPLE_FIXTURE);

    const view = createComponent();
    const header = view.debugElement.query(
      By.directive(MatchHeaderStubComponent)
    ).componentInstance as MatchHeaderStubComponent;

    expect(header.data()).toBe(EXAMPLE_FIXTURE);
    expect(header.highlights()).toBe(highlights);
  });

  it('should clean up updates before registering a changed fixture', () => {
    const view = createComponent({ fixtureId: 42 });

    view.componentRef.setInput('fixtureId', 84);
    view.detectChanges();

    expect(refreshServiceMock.destroy).toHaveBeenCalledTimes(1);
    expect(unregisterRealtime).toHaveBeenCalledTimes(1);
    expect(refreshServiceMock.init).toHaveBeenNthCalledWith(2, 84);
    expect(matchRealtimeServiceMock.register).toHaveBeenNthCalledWith(2, 84);
    expect(facadeMock.loadFixture).toHaveBeenNthCalledWith(2, 84);
    expect(facadeMock.handleInvalidUrl).toHaveBeenCalledWith(
      'champions-league'
    );
  });

  it('should clean up refresh and realtime updates on destroy', () => {
    const view = createComponent();

    view.destroy();

    expect(refreshServiceMock.destroy).toHaveBeenCalledTimes(1);
    expect(unregisterRealtime).toHaveBeenCalledTimes(1);
  });
});
