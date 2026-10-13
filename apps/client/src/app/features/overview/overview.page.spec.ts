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
        template: `
          <nav [class.animate-drop-from-top]="animateNavigation()"></nav>
        `,
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

    it('should not replay the navigation animation after route reuse', () => {
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('nav')
          ?.classList.contains('animate-drop-from-top')
      ).toBe(true);

      fixture.componentInstance.onRouteDetach();
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('nav')
          ?.classList.contains('animate-drop-from-top')
      ).toBe(false);
    });
  });
});
