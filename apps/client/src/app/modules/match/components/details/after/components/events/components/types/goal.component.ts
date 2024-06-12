import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventWithResult } from '../event.component';

@Component({
  selector: 'futbet-event-goal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
      :host-context(.is-home) .result { @apply flex-row-reverse; }
      :host { @apply flex gap-3 flex-col md:flex-row; }
      .result { @apply flex shrink-0 gap-2; }
      .names { @apply flex flex-col; }
      .assist { @apply flex md:flex-row items-start text-fb-color-text-2 text-fb-font-size-small; }
    `,
  template: `
    @if (event(); as event) {
    <div class="names">
      <div class="result">
        <span>{{ event.result.home }} - {{ event.result.away }}</span>
        <span>{{ event.player.name }}</span>
      </div>
      @if (event.assist.id) {
      <div class="assist">
        <span>Vorlage:&nbsp;</span>
        <span>{{ event.assist.name }}</span>
      </div>
      } @else if(event.detail === 'Penalty') {
      <div>
        <span>Elfmeter</span>
      </div>
      } @else if (event.detail === 'Missed Penalty') {
      <div>
        <span>Verschossener Elfmeter</span>
      </div>
      }
    </div>
    }
  `,
})
export class EventGoalComponent {
  event = input.required<EventWithResult>();
}
