import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host { @apply flex justify-center px-rs-padding-3 py-20 border-t-[1px]; }
  `,
  template: `
    <section>
      <reelscore-logo class="animate-fade-in" disabled />
    </section>

    <section></section>
  `,
})
export class FooterComponent {}
