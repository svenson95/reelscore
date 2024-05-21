import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoComponent],
  template: `
    <section>
      <futbet-logo disabled />
    </section>

    <section></section>
  `,
})
export class FooterComponent {}
