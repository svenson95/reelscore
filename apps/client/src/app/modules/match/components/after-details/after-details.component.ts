import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-match-after-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: ``,
  template: `
    <section>
      <div>match events...</div>
    </section>

    <section>
      <div>match stats...</div>
    </section>

    <section>
      <div>line-up...</div>
    </section>
  `,
})
export class MatchAfterDetailsComponent {}
