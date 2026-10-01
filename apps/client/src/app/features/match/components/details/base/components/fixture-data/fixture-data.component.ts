import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

import { getCompetitionRoundLabel, PageTitleComponent } from '@app/shared';

@Component({
  selector: 'rs-match-fixture-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent],
  styles: `
    :host {
      @apply flex flex-col mb-3;
    }

    .fixture-data {
      @apply mx-auto mt-rs1 w-[400px] xs:w-[450px] max-w-[calc(100%-1.5rem)] bg-rs-button-bg shadow-rs3 rounded-border2;
    }

    ul {
      @apply py-4;
    }

    li:not(:last-of-type) .item {
      @apply pb-3;
    }

    .item {
      @apply flex justify-center px-8 gap-6 text-rs-color-text-1;
    }

    .item .value {
      @apply flex-[3_3_0%] sm:flex-[2_2_0%];
    }

    .item .key {
      @apply text-rs-color-text-2 text-right tracking-wider font-extralight flex-[2_2_0%];
    }

    .item span {
      @apply text-rs-font-size-body-2;
    }

    .item .list-item-placeholder {
      @apply w-[100px] max-w-full h-[12px];
    }
  `,
  template: `
    <rs-page-title title="Details" />

    <div class="fixture-data" [attr.aria-busy]="isLoading()">
      <ul>
        @for (item of items(); track item.label) {
        <li>
          <div class="item">
            <span class="key">{{ item.label }}</span>
            <span class="value">
              @if (visibleData()) {
              {{ item.value }}
              } @else {
              <span
                class="rs-skeleton list-item-placeholder"
                aria-hidden="true"
              ></span>
              }
            </span>
          </div>
        </li>
        }
      </ul>
    </div>
  `,
})
export class MatchFixtureDataComponent {
  readonly fixture = input.required<ExtendedFixtureDTO | null>();
  readonly isLoading = input.required<boolean>();

  protected readonly visibleData = computed<ExtendedFixtureDTO | null>(() =>
    this.isLoading() ? null : this.fixture()
  );

  protected readonly items = computed(() => {
    const fixture = this.visibleData();

    return [
      { label: 'Wettbewerb', value: fixture?.league.name },
      {
        label: 'Spieltag',
        value: fixture
          ? getCompetitionRoundLabel(fixture.league.round, {
              id: fixture.league.id,
              season: fixture.league.season,
            })
          : undefined,
      },
      { label: 'Stadion', value: fixture?.fixture.venue.name },
      { label: 'Stadt', value: fixture?.fixture.venue.city },
      { label: 'Schiedsrichter', value: fixture?.fixture.referee },
    ];
  });
}
