import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { BackButtonComponent, RefreshTickerComponent } from '@app/shared';
import { formatFixtureTime } from '@lib/shared';

import { MatchFacade } from '../../match.facade';

const EXTERNAL_MODULES = [DatePipe, MatButtonModule];

@Component({
  selector: 'nav[rs-page-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...EXTERNAL_MODULES, BackButtonComponent, RefreshTickerComponent],
  styles: `
    :host { @apply flex p-3; }

    button {
      @apply border-none;
      --mat-button-outlined-container-height: 36px;
    }

    rs-refresh-ticker { @apply ml-px; }
    .spacer { @apply flex-1; }
    .date-placeholder {
      @apply m-auto w-[36px] h-[12px] bg-gray-200 rounded;
    }
  `,
  template: `
    <rs-back-button />

    <button mat-stroked-button disabled>
      {{ routerDate() | date : 'dd.MM.yy' }}
    </button>

    <rs-refresh-ticker />

    <div class="spacer"></div>

    <button mat-stroked-button disabled>
      {{ routerDate() | date : 'ccc' }}
    </button>

    <button mat-stroked-button disabled>
      @if (fixtureTime(); as time) {
      {{ time }}
      } @else {
      <div class="date-placeholder"></div>
      }
    </button>
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
