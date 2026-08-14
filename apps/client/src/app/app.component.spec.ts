import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { StartupService } from './shared/services/startup/startup.service';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  const startupServiceMock = {
    routeActivated: false,
    hideAppInitializer: jest.fn(),
    removeAppInitializerElement: jest.fn(),
  };

  beforeEach(async () => {
    startupServiceMock.routeActivated = false;
    startupServiceMock.hideAppInitializer.mockClear();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: StartupService,
          useValue: startupServiceMock,
        },
      ],
    })
      .overrideComponent(AppComponent, {
        remove: {
          imports: [HeaderComponent, FooterComponent],
        },
      })
      .compileComponents();

    component = TestBed.createComponent(AppComponent).componentInstance;
  });

  it('should hide app initializer only after first route activation', () => {
    component.onRouteActivated();
    component.onRouteActivated();

    expect(startupServiceMock.routeActivated).toBe(true);
    expect(startupServiceMock.hideAppInitializer).toHaveBeenCalledTimes(1);
  });
});
