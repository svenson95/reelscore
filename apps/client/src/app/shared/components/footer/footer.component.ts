import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'footer[rs-footer-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host { @apply flex justify-center px-3 py-[8rem] border-t-[1px] border-rs-color-primary; }
  `,
  template: `
    <div>
      <rs-logo class="animate-fade-in" disabled />
    </div>

    <div></div>
  `,
})
export class FooterComponent {}
