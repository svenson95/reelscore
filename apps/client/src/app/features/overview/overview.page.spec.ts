import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewRefreshService } from './data-access';

import { OverviewPage } from './overview.page';

describe('OverviewPage', () => {
  let fixture: ComponentFixture<OverviewPage>;

  const overviewRefreshServiceMock = {
    init: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(() => {
    overviewRefreshServiceMock.init.mockReset();
    overviewRefreshServiceMock.destroy.mockReset();

    TestBed.configureTestingModule({
      imports: [OverviewPage],
    });

    TestBed.overrideComponent(OverviewPage, {
      set: {
        imports: [],
        providers: [
          {
            provide: OverviewRefreshService,
            useValue: overviewRefreshServiceMock,
          },
        ],
        template: '',
      },
    });

    fixture = TestBed.createComponent(OverviewPage);
  });

  describe('lifecycle', () => {
    it('should initialize overview refresh service', () => {
      fixture.detectChanges();

      expect(overviewRefreshServiceMock.init).toHaveBeenCalledTimes(1);
    });

    it('should destroy overview refresh service', () => {
      fixture.detectChanges();

      fixture.destroy();

      expect(overviewRefreshServiceMock.destroy).toHaveBeenCalledTimes(1);
    });

    it('should animate navigation again after the cached route is reattached', () => {
      fixture.componentInstance.onRouteDetach();
      expect(fixture.componentInstance.animateNavigation()).toBe(false);

      fixture.componentInstance.onRouteAttach();

      expect(fixture.componentInstance.animateNavigation()).toBe(true);
    });
  });
});
