import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { PageTitleComponent, RoundLabelPipe } from '@app/shared';
import type { ExtendedFixtureDTO } from '@lib/models';

import { FixtureStore } from '../../../../../store';

@Component({
  selector: 'rs-match-fixture-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, RoundLabelPipe],
  styles: `
    :host {
      @apply flex flex-col mb-3;
    }

    .fixture-data {
      @apply mx-auto mt-rs1 w-[350px] xs:w-[450px] bg-rs-button-bg shadow-rs3 rounded-border2;
    }

    ul {
      @apply py-4;
    }

    li:not(:last-of-type) .item {
      @apply pb-3;
    }

    .item {
      @apply flex justify-center px-4 gap-6 text-rs-color-text-1;
    }

    .item > *:not(.key) {
      @apply flex-2 sm:flex-1;
    }

    .key {
      @apply text-rs-color-text-2 text-right tracking-wider font-extralight flex-1;
    }

    span {
      @apply text-rs-font-size-body-2;
    }

    .list-item-placeholder {
      @apply w-[100px] h-[16px] my-1 bg-gray-200 rounded;
    }
  `,
  template: `
    <rs-page-title title="Details" />

    <div class="fixture-data">
      <ul>
        <li>
          <div class="item">
            <span class="key">Wettbewerb</span>

            @if (data(); as fixture) {
            <span class="value">{{ fixture.league.name }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </li>

        <li>
          <div class="item">
            <span class="key">Spieltag</span>

            @if (data(); as fixture) {
            <span class="value">
              {{
                fixture.league.round
                  | roundLabel
                    : {
                        id: fixture.league.id,
                        season: fixture.league.season
                      }
              }}
            </span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </li>

        <li>
          <div class="item">
            <span class="key">Stadion</span>

            @if (data(); as fixture) {
            <span class="value">{{ fixture.fixture.venue.name }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </li>

        <li>
          <div class="item">
            <span class="key">Stadt</span>

            @if (data(); as fixture) {
            <span class="value">{{ fixture.fixture.venue.city }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </li>

        <li>
          <div class="item">
            <span class="key">Schiedsrichter</span>

            @if (data(); as fixture) {
            <span class="value">{{ fixture.fixture.referee }}</span>
            } @else {
            <div class="list-item-placeholder"></div>
            }
          </div>
        </li>
      </ul>
    </div>
  `,
})
export class MatchFixtureDataComponent {
  private readonly fixtureStore = inject(FixtureStore);

  readonly data = computed<ExtendedFixtureDTO | null>(
    () => this.fixtureStore.fixture()?.data ?? null
  );
}
