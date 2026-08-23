import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { OverviewRefreshService } from './services';

describe('OverviewComponent', () => {
  let fixture: ComponentFixture<OverviewComponent>;

  const overviewRefreshServiceMock = {
    init: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(() => {
    overviewRefreshServiceMock.init.mockReset();
    overviewRefreshServiceMock.destroy.mockReset();

    TestBed.configureTestingModule({
      imports: [OverviewComponent],
    });

    TestBed.overrideComponent(OverviewComponent, {
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

    fixture = TestBed.createComponent(OverviewComponent);
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
  });
});
