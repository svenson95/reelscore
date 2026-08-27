import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { RealtimeService } from './shared/services/realtime.service';
import { StartupService } from './shared/services/startup/startup.service';
import { VisibilityObserverService } from './shared/services/visibility-observer.service';

import { RealtimeUpdateService } from './realtime/realtime-update.service';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  const startupServiceMock = {
    routeActivated: false,
    hideAppInitializer: jest.fn(),
    removeAppInitializerElement: jest.fn(),
  };

  const realtimeServiceMock = {
    connect: jest.fn(),
  };

  const realtimeUpdateServiceMock = {
    init: jest.fn(),
  };

  const visibilityObserverServiceMock = {
    init: jest.fn(),
  };

  beforeEach(async () => {
    startupServiceMock.routeActivated = false;
    startupServiceMock.hideAppInitializer.mockClear();

    realtimeServiceMock.connect.mockClear();
    realtimeUpdateServiceMock.init.mockClear();
    visibilityObserverServiceMock.init.mockClear();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: StartupService,
          useValue: startupServiceMock,
        },
        {
          provide: RealtimeService,
          useValue: realtimeServiceMock,
        },
        {
          provide: VisibilityObserverService,
          useValue: visibilityObserverServiceMock,
        },
      ],
    })
      .overrideComponent(AppComponent, {
        remove: {
          imports: [HeaderComponent, FooterComponent],
          providers: [RealtimeUpdateService],
        },
        add: {
          providers: [
            {
              provide: RealtimeUpdateService,
              useValue: realtimeUpdateServiceMock,
            },
          ],
        },
      })
      .compileComponents();

    component = TestBed.createComponent(AppComponent).componentInstance;
  });

  describe('initialization', () => {
    it('should initialize realtime updates, connect realtime and observe visibility', () => {
      component.ngOnInit();

      expect(realtimeUpdateServiceMock.init).toHaveBeenCalledTimes(1);
      expect(realtimeServiceMock.connect).toHaveBeenCalledTimes(1);
      expect(visibilityObserverServiceMock.init).toHaveBeenCalledTimes(1);
    });

    it('should initialize realtime updates before connecting realtime', () => {
      component.ngOnInit();

      const realtimeUpdateOrder =
        realtimeUpdateServiceMock.init.mock.invocationCallOrder[0];

      const realtimeConnectOrder =
        realtimeServiceMock.connect.mock.invocationCallOrder[0];

      expect(realtimeUpdateOrder).toBeLessThan(realtimeConnectOrder);
    });
  });

  describe('route activation', () => {
    it('should hide app initializer only after first route activation', () => {
      component.onRouteActivated();
      component.onRouteActivated();

      expect(startupServiceMock.routeActivated).toBe(true);
      expect(startupServiceMock.hideAppInitializer).toHaveBeenCalledTimes(1);
    });
  });
});
