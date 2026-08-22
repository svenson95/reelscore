import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'footer[rs-footer-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host {
      @apply flex justify-center border-t-[1px] border-rs-color-primary
        px-3 py-[8rem];
    }

    .footer-logo {
      @apply grayscale opacity-40;
    }
  `,
  template: `
    <div>
      <rs-logo class="footer-logo" />
    </div>

    <div></div>
  `,
})
export class FooterComponent {}
