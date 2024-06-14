import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventWithResult } from '../event.component';

@Component({
  selector: 'futbet-event-goal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
      :host-context(.is-home) .top { @apply flex-row-reverse; }
      :host { @apply flex flex-col; }
      .top { @apply flex flex-wrap gap-2; }
      .result { @apply flex shrink-0; }
      .bottom { @apply flex text-fb-font-size-small text-fb-color-text-2; }
      .assist { @apply inline-flex flex-wrap; }
    `,
  template: `
    @if (event(); as event) {
    <div class="top">
      <span class="result">
        <span [class.font-bold]="isHome()">{{ event.result.home }}</span>
        <span>&nbsp;-&nbsp;</span>
        <span [class.font-bold]="!isHome()">{{ event.result.away }}</span>
      </span>
      <span>{{ event.player.name }}</span>
    </div>
    @if (event.assist.id) {
    <div class="bottom assist">
      <span>Vorlage:&nbsp;</span>
      <span>{{ event.assist.name }}</span>
    </div>
    } @else if(event.detail === 'Penalty') {
    <div class="bottom">
      <span>Elfmeter</span>
    </div>
    } @else if (event.detail === 'Missed Penalty') {
    <div class="bottom">
      <span>Verschossener Elfmeter</span>
    </div>
    } }
  `,
})
export class EventGoalComponent {
  event = input.required<EventWithResult>();
  isHome = input.required<boolean>();
}
