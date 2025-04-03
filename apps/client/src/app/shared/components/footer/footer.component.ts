import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host { @apply flex justify-center px-rs-padding-3 py-20 border-t-[1px] border-rs-color-orange; }
  `,
  template: `
    <section>
      <reelscore-logo class="animate-fade-in" disabled />
    </section>

    <section></section>
  `,
})
export class FooterComponent {}
