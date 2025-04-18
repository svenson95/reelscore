import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { BackButtonComponent } from '../../../../shared';
import { MatchFacade } from '../../match.facade';

const ANGULAR_MODULES = [DatePipe, MatButtonModule];

@Component({
  selector: 'nav[rs-page-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...ANGULAR_MODULES, BackButtonComponent],
  styles: `
    :host { @apply flex gap-5 p-5; }
    button { 
      --mdc-outlined-button-container-height: 36px;
      @apply rs-as-label; 
    }
    .spacer { @apply flex-1; }
    .date-placeholder {  @apply m-auto w-[36px] h-[12px] bg-gray-200 rounded; }
  `,
  template: `
    <rs-back-button />
    <button mat-stroked-button disabled>
      {{ routerDate() | date : 'dd.MM.yy' }}
    </button>

    <div class="spacer"></div>

    <button mat-stroked-button disabled>
      {{ routerDate() | date : 'ccc' }}
    </button>
    <button mat-stroked-button disabled>
      @let fixtureDate = fixture()?.data?.fixture?.date; @if (fixtureDate) {
      {{ fixtureDate | date : 'HH:mm' }} } @else {
      <div class="date-placeholder"></div>
      }
    </button>
  `,
})
export class PageHeaderComponent {
  private facade = inject(MatchFacade);
  fixture = this.facade.fixture;
  routerDate = this.facade.routerDate;
}
