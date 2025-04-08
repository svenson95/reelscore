import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'footer[rs-footer-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host { @apply flex justify-center px-rs-padding-3 py-20 border-t-[1px] border-rs-color-orange; }
  `,
  template: `
    <div>
      <rs-logo class="animate-fade-in" disabled />
    </div>

    <div></div>
  `,
})
export class FooterComponent {}
