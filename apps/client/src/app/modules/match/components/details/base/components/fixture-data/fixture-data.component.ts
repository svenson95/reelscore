import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { RoundLabelPipe } from '@app/shared';
import { ExtendedFixtureDTO } from '@lib/models';

import { FixtureStore } from '../../../../../store';

@Component({
  selector: 'rs-match-fixture-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RoundLabelPipe],
  styles: `
    :host { @apply flex flex-col py-5; }
    ul { @apply py-5; }
    li:not(:last-of-type) .item { @apply pb-2; }
    .item { @apply flex justify-center px-4 gap-6 text-rs-color-text-3; }
    .item > *:not(.key) { @apply flex-2 sm:flex-1; }
    .key { @apply text-rs-color-orange text-right tracking-wider font-extralight flex-1; }
    .key, .value { @apply content-center;}
    span { @apply text-rs-font-size-body-2;}
    .list-item-placeholder {  @apply w-[100px] h-[16px] my-1 bg-gray-200 rounded; }
  `,
  template: `
    <ul>
      <li>
        <div class="item">
          <span class="key">Spieltag</span>
          <div class="value">
            @if (isLoaded()) {
            <span>{{ data()!.league.round | roundLabel }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Stadion</span>
          <div class="value">
            @if (isLoaded()) {
            <span>{{ data()!.fixture.venue.name }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Stadt</span>
          <div class="value">
            @if (isLoaded()) {
            <span>{{ data()!.fixture.venue.city }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </div>
      </li>

      <li>
        <div class="item">
          <span class="key">Schiedsrichter</span>
          <div class="value">
            @if (isLoaded()) {
            <span>{{ data()!.fixture.referee }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </div>
      </li>
    </ul>
  `,
})
export class MatchFixtureDataComponent {
  fixtureStore = inject(FixtureStore);
  data = computed<ExtendedFixtureDTO | null>(
    () => this.fixtureStore.fixture()?.data ?? null
  );
  isLoaded = computed<boolean>(() => !!this.data());
}
