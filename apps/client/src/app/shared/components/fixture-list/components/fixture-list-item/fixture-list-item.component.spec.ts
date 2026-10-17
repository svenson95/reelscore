import {
  type AfterViewInit,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';

import { EXAMPLE_FIXTURE } from '@testing/client';

import {
  ScrollService,
  VenueImageService,
} from '../../../../../features/match/components/match-header/data-access';
import { MatchHeaderComponent } from '../../../../../features/match/components/match-header/match-header.component';
import { linkToMatch } from '../../../../utils';

import { FixtureListItemComponent } from './fixture-list-item.component';

let firstHeaderBackground: string | undefined;

@Component({
  imports: [MatchHeaderComponent],
  template: `<section
    rs-match-header
    [fixtureId]="fixtureId"
    [data]="null"
    [highlights]="null"
  ></section>`,
})
class TestMatchPage implements AfterViewInit {
  readonly fixtureId = EXAMPLE_FIXTURE.fixture.id;
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);

  ngAfterViewInit(): void {
    firstHeaderBackground =
      this.element.nativeElement.querySelector<HTMLElement>(
        '.background-wrapper'
      )?.style.backgroundImage;
  }
}

@Component({
  imports: [FixtureListItemComponent, RouterOutlet],
  template: `<rs-fixture-list-item [fixture]="fixture" /><router-outlet />`,
})
class TestHostComponent {
  readonly fixture = EXAMPLE_FIXTURE;
}

describe('FixtureListItemComponent', () => {
  const originalFetch = globalThis.fetch;
  const originalCreateObjectUrl = URL.createObjectURL;
  const originalRevokeObjectUrl = URL.revokeObjectURL;

  beforeEach(async () => {
    firstHeaderBackground = undefined;
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([
          {
            path: '**',
            component: TestMatchPage,
          },
        ]),
      ],
    })
      .overrideComponent(MatchHeaderComponent, {
        set: {
          providers: [
            VenueImageService,
            {
              provide: ScrollService,
              useValue: {
                observeScrollPosition: jest.fn(),
                destroy: jest.fn(),
              },
            },
          ],
        },
      })
      .compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.restoreAllMocks();
    globalThis.fetch = originalFetch;
    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
  });

  it('waits for decoding and renders the header with its image before match data arrives', async () => {
    let finishDecoding!: () => void;
    let markDecodingStarted!: () => void;
    const decodingStarted = new Promise<void>((resolve) => {
      markDecodingStarted = resolve;
    });
    const decoding = new Promise<void>((resolve) => {
      finishDecoding = resolve;
    });
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['image']),
    }) as jest.MockedFunction<typeof fetch>;
    URL.createObjectURL = jest.fn().mockReturnValue('blob:venue-preload');
    URL.revokeObjectURL = jest.fn();

    jest.spyOn(window, 'Image').mockImplementation(() => {
      const image = document.createElement('img');
      image.decode = jest.fn(() => {
        markDecodingStarted();
        return decoding;
      });
      Object.defineProperty(image, 'naturalWidth', { value: 400 });
      Object.defineProperty(image, 'naturalHeight', { value: 400 });

      return image;
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    const router = TestBed.inject(Router);

    fixture.detectChanges();

    const expectedUrl = router.serializeUrl(
      router.createUrlTree(linkToMatch(EXAMPLE_FIXTURE))
    );

    const link = fixture.nativeElement.querySelector(
      '[data-testid="fixture-list-item"]'
    ) as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe(expectedUrl);
    link.click();

    await decodingStarted;
    link.click();
    expect(router.url).not.toBe(expectedUrl);
    expect(firstHeaderBackground).toBeUndefined();
    finishDecoding();

    await fixture.whenStable();

    expect(router.url).toBe(expectedUrl);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(firstHeaderBackground).toContain('blob:venue-preload');
  });

  it('updates the native link when its fixture changes', () => {
    const fixture = TestBed.createComponent(FixtureListItemComponent);
    const router = TestBed.inject(Router);
    fixture.componentRef.setInput('fixture', EXAMPLE_FIXTURE);
    fixture.detectChanges();

    const nextFixture = {
      ...EXAMPLE_FIXTURE,
      fixture: { ...EXAMPLE_FIXTURE.fixture, id: 123456 },
    };
    fixture.componentRef.setInput('fixture', nextFixture);
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    const expectedUrl = router.serializeUrl(
      router.createUrlTree(linkToMatch(nextFixture))
    );

    expect(link.getAttribute('href')).toBe(expectedUrl);
  });
});
