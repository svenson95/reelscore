import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { BackButtonComponent, RefreshTickerComponent } from '@app/shared';
import { formatFixtureTime } from '@lib/shared';

import { MatchFacade } from '../../match.facade';

@Component({
  selector: 'nav[rs-page-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, BackButtonComponent, RefreshTickerComponent],
  styles: `
    :host {
      @apply flex p-3;
    }

    .header-label {
      @apply inline-flex h-9 min-w-16 px-4 items-center justify-center rounded-border2 bg-rs-button-bg shadow-rs3 text-rs-font-size-body-2 font-medium;
    }

    .header-label + .header-label {
      @apply ml-[1px];
    }

    rs-refresh-ticker {
      @apply ml-px;
    }

    .spacer {
      @apply flex-1;
    }

    .date-placeholder {
      @apply m-auto h-[12px] w-[36px] rounded bg-gray-200;
    }
  `,
  template: `
    <rs-back-button />

    <span class="header-label">
      {{ routerDate() | date : 'dd.MM.yy' }}
    </span>

    <rs-refresh-ticker />

    <div class="spacer"></div>

    <span class="header-label">
      {{ routerDate() | date : 'ccc' }}
    </span>

    <span class="header-label">
      @if (fixtureTime(); as time) {
      {{ time }}
      } @else {
      <span class="date-placeholder"></span>
      }
    </span>
  `,
})
export class PageHeaderComponent {
  private readonly facade = inject(MatchFacade);

  readonly routerDate = this.facade.routerDate;

  private readonly fixture = computed(
    () => this.facade.fixture()?.data?.fixture ?? null
  );

  readonly fixtureTime = computed<string | null>(() => {
    const fixture = this.fixture();

    return fixture ? formatFixtureTime(fixture.timestamp) : null;
  });
}
