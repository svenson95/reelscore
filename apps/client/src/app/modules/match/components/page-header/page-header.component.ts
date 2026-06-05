import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { BackButtonComponent, RefreshTickerComponent } from '@app/shared';
import type { DateString } from '@lib/shared';

import { MatchFacade } from '../../match.facade';

const EXTERNAL_MODULES = [DatePipe, MatButtonModule];

@Component({
  selector: 'nav[rs-page-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...EXTERNAL_MODULES, BackButtonComponent, RefreshTickerComponent],
  styles: `
    :host { @apply flex p-3; }
    button {
      --mat-button-outlined-container-height: 36px; // TODO refactor to material.scss
    }
    rs-refresh-ticker { @apply ml-px; }
    .spacer { @apply flex-1; }
    .date-placeholder {  @apply m-auto w-[36px] h-[12px] bg-gray-200 rounded; }
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
      @if (fixtureData(); as fixtureDate) {
      {{ fixtureDate | date : 'HH:mm' }} } @else {
      <div class="date-placeholder"></div>
      }
    </button>
  `,
})
export class PageHeaderComponent {
  private readonly facade = inject(MatchFacade);

  readonly routerDate = this.facade.routerDate;

  readonly fixtureData = computed<DateString | null>(
    () => this.facade.fixture()?.data?.fixture?.date ?? null
  );
}
