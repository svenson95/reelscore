import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-match-details-before',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: ``,
  template: `
    <section>
      <div>form home ... form away</div>
      <div>performance home ... performance away</div>
    </section>
    <section>
      <div>last matches home ... last matches away</div>
    </section>
    <section>
      <div>table positions (regular table and home+away table)...</div>
    </section>
  `,
})
export class MatchDetailsBeforeComponent {}
