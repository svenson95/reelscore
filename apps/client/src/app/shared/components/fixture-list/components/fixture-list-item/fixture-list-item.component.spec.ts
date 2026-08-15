import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { EXAMPLE_FIXTURE } from '../../../../../../testing/fixtures.mock';
import { linkToMatch } from '../../../../constants';

import { FixtureListItemComponent } from './fixture-list-item.component';

@Component({
  template: '',
})
class TestMatchComponent {}

describe('FixtureListItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixtureListItemComponent],
      providers: [
        provideRouter([
          {
            path: '**',
            component: TestMatchComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  it('should navigate to the match when clicked', async () => {
    const fixture = TestBed.createComponent(FixtureListItemComponent);
    const router = TestBed.inject(Router);

    fixture.componentRef.setInput('fixture', EXAMPLE_FIXTURE);
    fixture.detectChanges();

    const expectedUrl = router.serializeUrl(
      router.createUrlTree(linkToMatch(EXAMPLE_FIXTURE))
    );

    const link = fixture.nativeElement.querySelector(
      '[data-testid="fixture-list-item"]'
    ) as HTMLAnchorElement;

    link.click();

    await fixture.whenStable();

    expect(router.url).toBe(expectedUrl);
  });
});
