import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  styles: `
    :host { @apply flex justify-center px-fb-padding-3 py-10; }
    futbet-logo { @apply grayscale opacity-35; }
  `,
  template: `
    <section>
      <futbet-logo disabled />
    </section>

    <section></section>
  `,
})
export class FooterComponent {}
