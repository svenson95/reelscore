import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type { ExtendedFixtureDTO, TeamCoachDTO } from '@reelscore-sdk/models';

import {
  getNationalityFlagUrl,
  PageTitleComponent,
  TeamNamePipe,
} from '@app/shared';

@Component({
  selector: 'rs-match-team-coaches',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, TeamNamePipe],
  styles: `
    :host {
      @apply flex flex-col;
    }

    .coaches-grid {
      @apply mt-rs1 grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 sm:gap-4;
    }

    .team-card {
      @apply flex min-w-0 flex-col gap-3 p-3 bg-rs-button-bg shadow-rs rounded-rs sm:gap-4 sm:p-5;
    }

    .team-card:nth-child(1) {
      @apply max-sm:mr-6;
    }

    .team-card:nth-child(2) {
      @apply max-sm:ml-6;
    }

    .coach {
      @apply grid min-w-0 grid-cols-[3.125rem_minmax(0,1fr)] sm:grid-cols-[4.375rem_minmax(0,1fr)] items-center gap-4 ml-2;
    }

    .coach-away {
      @apply grid-cols-[minmax(0,1fr)_3.125rem] sm:grid-cols-[minmax(0,1fr)_4.375rem] mr-2;
    }

    .coach-photo-frame {
      @apply aspect-square w-[50px] sm:w-[70px];
    }

    .coach-photo {
      @apply block h-full w-full rounded-full bg-rs-alt-bg object-cover object-top;
    }

    .coach-details {
      @apply flex min-w-0 flex-col gap-1 text-rs-color-text-1 text-rs-font-size-small sm:text-rs-font-size-body-2;
    }

    .coach-details-away {
      @apply items-end text-right;
    }

    .coach-name {
      @apply block break-words font-semibold leading-tight text-rs-font-size-body-2 sm:text-rs-font-size-body-1;
    }

    .coach-tenure {
      @apply text-rs-color-text-2 text-rs-font-size-small sm:text-rs-font-size-body-2;
    }

    .coach-meta {
      display: flex;
      flex: 0 0 1.2em;
      height: 1.2em;
      flex-wrap: nowrap;
      align-items: center;
    }

    .coach-meta-away {
      @apply justify-end;
    }

    .coach-nationality {
      @apply inline-flex w-fit max-w-full items-center gap-2;
    }

    .coach-meta-separator {
      @apply text-rs-color-text-2 mx-1.5;
    }

    .coach-nationality-name {
      @apply min-w-0 break-words font-medium;
    }

    .coach-skeleton {
      @apply rounded;
    }

    .loading-photo {
      @apply aspect-square w-[50px] rounded-full sm:w-[70px];
    }

    .coach-details-loading .coach-meta {
      flex-basis: 1.2em;
    }

    .loading-name {
      @apply h-[1.5em] w-3/4 max-w-40;
    }

    .loading-age {
      @apply h-[1.2em] w-12;
    }

    .loading-nationality {
      @apply h-[1.2em] w-16;
    }

    .loading-tenure {
      @apply h-[1.2em] w-28 max-w-full;
    }
  `,
  template: `
    <rs-page-title title="Trainer" />

    <div class="coaches-grid" [attr.aria-busy]="isLoading()">
      @for (team of teams(); track team.id) {
      <section class="team-card" [attr.aria-label]="team.label">
        @if (isLoading() || team.coach) {
        <div
          class="coach"
          [class.coach-away]="$index === 1"
          [attr.aria-hidden]="isLoading() ? 'true' : null"
        >
          @if ($index === 0) { @if (isLoading()) {
          <span
            class="rs-skeleton coach-skeleton loading-photo"
            aria-hidden="true"
          ></span>
          } @else if (team.coach; as coach) {
          <span class="rs-photo-frame coach-photo-frame">
            <img
              class="coach-photo"
              [src]="coach.photo"
              [alt]="coachName(coach)"
              loading="lazy"
            />
          </span>
          } }
          <div
            class="coach-details"
            [class.coach-details-away]="$index === 1"
            [class.coach-details-loading]="isLoading()"
            [attr.aria-hidden]="isLoading() ? 'true' : null"
          >
            @if (isLoading()) {
            <span
              class="coach-meta"
              [class.coach-meta-away]="$index === 1"
              [class.flex-row-reverse]="$index === 1"
            >
              <span class="rs-skeleton coach-skeleton loading-age"></span>
              <span class="coach-meta-separator">{{ ' · ' }}</span>
              <span
                class="coach-nationality"
                [class.flex-row-reverse]="$index === 1"
              >
                <span
                  class="coach-nationality-name rs-skeleton coach-skeleton loading-nationality"
                ></span>
              </span>
            </span>
            <span
              class="coach-name rs-skeleton coach-skeleton loading-name"
            ></span>
            <span
              class="coach-tenure rs-skeleton coach-skeleton loading-tenure"
            ></span>
            } @else if (team.coach; as coach) {
            <span
              class="coach-meta"
              [class.coach-meta-away]="$index === 1"
              [class.flex-row-reverse]="$index === 1"
            >
              @if (coach.age !== null && coach.age !== undefined) {
              <span>{{ coach.age }} Jahre</span>
              } @if (coach.nationality; as nationality) { @if (coach.age !==
              null && coach.age !== undefined) {
              <span class="coach-meta-separator">{{ ' · ' }}</span>
              }
              <span
                class="coach-nationality"
                [class.flex-row-reverse]="$index === 1"
              >
                <span class="coach-nationality-name">
                  {{ nationality | teamName }}
                </span>
                @if (nationalityFlagUrl(nationality); as flagUrl) {
                <img
                  class="rs-nationality-flag"
                  [src]="flagUrl"
                  alt=""
                  aria-hidden="true"
                />
                }
              </span>
              }
            </span>
            <span class="coach-name">
              {{ coachName(coach) }}
            </span>
            @if (coachStartDate(coach); as startDate) {
            <span class="coach-tenure">
              Im Amt seit {{ formatDate(startDate) }}
            </span>
            } }
          </div>
          @if ($index === 1) { @if (isLoading()) {
          <span
            class="rs-skeleton coach-skeleton loading-photo"
            aria-hidden="true"
          ></span>
          } @else if (team.coach; as coach) {
          <span class="rs-photo-frame coach-photo-frame">
            <img
              class="coach-photo"
              [src]="coach.photo"
              [alt]="coachName(coach)"
              loading="lazy"
            />
          </span>
          } }
        </div>
        } @else if (error()) {
        <p role="status">Trainer konnten nicht geladen werden.</p>
        } @else {
        <p>Keine Trainerdaten verfügbar.</p>
        }
      </section>
      }
    </div>
  `,
})
export class MatchTeamCoachesComponent {
  readonly fixture = input.required<ExtendedFixtureDTO | null>();
  readonly coaches = input.required<TeamCoachDTO[]>();
  readonly isLoading = input.required<boolean>();
  readonly error = input<unknown>(null);

  protected readonly teams = computed(() => {
    const fixtureTeams = this.fixture()?.teams;
    if (!fixtureTeams) {
      if (!this.isLoading()) return [];

      return [
        {
          id: 'home',
          label: 'Trainer des Heimteams',
          coach: null,
        },
        {
          id: 'away',
          label: 'Trainer des Auswärtsteams',
          coach: null,
        },
      ];
    }

    return [
      {
        id: fixtureTeams.home.id,
        label: 'Trainer des Heimteams',
        coach: this.getCurrentCoach(fixtureTeams.home.id),
      },
      {
        id: fixtureTeams.away.id,
        label: 'Trainer des Auswärtsteams',
        coach: this.getCurrentCoach(fixtureTeams.away.id),
      },
    ];
  });

  private getCurrentCoach(teamId: number): TeamCoachDTO | null {
    const currentCoaches = this.coaches().filter((coach) =>
      coach.career.some((career) => career.team.id === teamId && !career.end)
    );

    return (
      currentCoaches
        .map((coach) => ({
          coach,
          currentCareer: coach.career.find(
            (career) => career.team.id === teamId && !career.end
          ),
        }))
        .sort((first, second) =>
          (second.currentCareer?.start ?? '').localeCompare(
            first.currentCareer?.start ?? ''
          )
        )[0]?.coach ?? null
    );
  }

  protected formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return year && month && day ? `${day}.${month}.${year}` : date;
  }

  protected coachName(coach: TeamCoachDTO): string {
    return coach.name || '';
  }

  protected readonly nationalityFlagUrl = getNationalityFlagUrl;

  protected coachStartDate(coach: TeamCoachDTO): string | null {
    const currentCareer = coach.career.find(
      (career) => career.team.id === coach.team.id && !career.end
    );

    return currentCareer?.start ?? null;
  }
}
