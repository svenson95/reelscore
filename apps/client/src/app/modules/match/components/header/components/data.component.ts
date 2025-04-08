import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  OptimizedImageComponent,
  ResultLabelComponent,
  TeamNamePipe,
  getTeamLogo,
} from '@app/shared';
import { FixtureDTO } from '@lib/models';

@Component({
  selector: 'rs-match-header-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, TeamNamePipe, ResultLabelComponent],
  styles: `
    :host { @apply flex w-full; }
    div { @apply flex flex-1 sm:text-rs-font-size-body-1; }
    .team-column { @apply flex-col gap-2 text-rs-font-size-body-2; }
    .result-column { @apply items-center justify-center gap-1 text-rs-font-size-body-1; }
    .team-name { @apply leading-[16px] text-center; }
    .team-logo { @apply m-auto; }
    .team-name-placeholder { @apply w-[100px] h-[16px] bg-gray-200 rounded m-auto; }
    .team-logo-placeholder { @apply w-[48px] h-[48px] bg-gray-200 rounded-full self-center; }
  `,
  template: `
    <div class="team-column">
      <div class="team-logo">
        @if (isLoaded()) {
        <rs-optimized-image
          [source]="getTeamLogo(data()!.teams.home.id)"
          alternate="home logo"
          width="48"
          height="48"
        />
        } @else {
        <div class="team-logo-placeholder"></div>
        }
      </div>
      <span class="team-name">
        @if (isLoaded()) {
        {{ data()!.teams.home.name | teamName }}
        } @else {
        <div class="team-name-placeholder"></div>
        }
      </span>
    </div>

    <div class="result-column">
      @if (isLoaded()) {
      <rs-result-label
        [result]="data()!.goals"
        [status]="data()!.fixture.status.short"
        [isNotStarted]="isNotStarted(data()!)"
        [showPostponedText]="true"
      />
      }
    </div>

    <div class="team-column">
      <div class="team-logo">
        @if (isLoaded()) {
        <rs-optimized-image
          [source]="getTeamLogo(data()!.teams.away.id)"
          alternate="away logo"
          width="48"
          height="48"
        />
        } @else {
        <div class="team-logo-placeholder"></div>
        }
      </div>
      <span class="team-name">
        @if (isLoaded()) {
        {{ data()!.teams.away.name | teamName }}
        } @else {
        <div class="team-name-placeholder"></div>
        }
      </span>
    </div>
  `,
})
export class HeaderDataComponent {
  data = input.required<FixtureDTO | undefined>();

  isLoaded = computed<boolean>(() => !!this.data());

  getTeamLogo = getTeamLogo;
  isNotStarted = (fixture: FixtureDTO): boolean => {
    const notStartedValues = ['TBD', 'NS'];
    return notStartedValues.some((v) => v === fixture.fixture.status.short);
  };
}
