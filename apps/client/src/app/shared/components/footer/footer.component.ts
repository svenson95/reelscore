import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host { @apply flex justify-center px-fb-padding-3 py-20 border-t-[1px]; }
    reelscore-logo { @apply text-fb-color-white; }
  `,
  template: `
    <section>
      <reelscore-logo disabled />
    </section>

    <section></section>
  `,
})
export class FooterComponent {}
