import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EventDTO } from '@lib/models';

@Component({
  selector: 'rs-event-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: `
    :host { @apply flex flex-col; }
    span:last-child { @apply text-rs-font-size-small text-rs-color-text-2; }
  `,
  template: `
    @if (event(); as event) {
    <span>{{ event.player.name }}</span>
    <span>
      @switch (event.comments) { @case('Tripping') { Foul durch Beinstellen }
      @case('Roughing') { Grobes Foul } @case("Argument") { Auseinandersetzung }
      @case("Holding") { Festhalten } @case("Delay of game") { Zeitspiel }
      @case("Elbowing") { Ellbogenstoß } @case("Unsportsmanlike conduct") {
      Unsportliches Verhalten } @case("Serious foul") { Schweres Foul }
      @case("Diving") { Schwalbe } @default { {{ event.detail }} } }
    </span>
    }
  `,
})
export class EventCardComponent {
  event = input.required<EventDTO>();
}
