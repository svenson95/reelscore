import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventWithResult } from '../event.component';

@Component({
  selector: 'futbet-event-goal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
      :host-context(.is-home) { @apply flex-row-reverse; }
      :host { @apply flex gap-3; }
      .names { @apply flex flex-col; }
      .names div { @apply text-fb-font-size-small; }
    `,
  template: `
    @if (event(); as event) {
    <div>
      <span>{{ event.result.home }} - {{ event.result.away }}</span>
    </div>
    <div class="names">
      <span>{{ event.player.name }}</span>
      @if (event.assist.id) {
      <div>
        <span>Vorlage: </span>
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
