import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type { ExtendedFixtureDTO, TeamCoachDTO } from '@reelscore-sdk/models';

import { PageTitleComponent, TeamNamePipe } from '@app/shared';

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
      @apply flex min-w-0 flex-col gap-3 p-3 bg-rs-button-bg shadow-rs3 rounded-border2 sm:gap-4 sm:p-5;
    }

    .coach {
      @apply grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-3;
    }

    .coach-away {
      @apply grid-cols-[minmax(0,1fr)_2.75rem] sm:grid-cols-[minmax(0,1fr)_4rem];
    }

    .coach-photo {
      @apply aspect-square w-11 rounded-full bg-rs-alt-bg object-cover object-top shadow-rs2 sm:w-16;
    }

    .coach-details {
      @apply flex min-w-0 flex-col gap-1 text-xs text-rs-color-text-1 sm:gap-2 sm:text-rs-font-size-body-2;
    }

    .coach-details-away {
      @apply items-end text-right;
    }

    .coach-name {
      @apply block break-words text-sm font-semibold leading-tight sm:text-base;
    }

    .coach-tenure {
      @apply text-rs-color-text-2;
    }

    .coach-meta {
      @apply flex flex-wrap items-center gap-2;
    }

    .coach-meta-away {
      @apply flex-row-reverse justify-end;
    }

    .coach-nationality {
      @apply inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border border-rs-border-color-1 px-2 py-0.5 sm:gap-2 sm:px-3 sm:py-0.5;
    }

    .coach-flag {
      @apply shrink-0 text-sm leading-none sm:text-base;
    }

    .coach-nationality-name {
      @apply min-w-0 break-words font-medium;
    }

    .coach-skeleton {
      @apply rounded;
    }

    .coach-loading {
      @apply grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-3;
    }

    .coach-loading-away {
      @apply grid-cols-[minmax(0,1fr)_2.75rem] sm:grid-cols-[minmax(0,1fr)_4rem];
    }

    .loading-photo {
      @apply aspect-square w-11 rounded-full sm:w-16;
    }

    .loading-details {
      @apply flex min-w-0 flex-col gap-2;
    }

    .loading-name {
      @apply h-4 w-3/4 max-w-40;
    }

    .loading-meta {
      @apply flex items-center gap-2;
    }

    .loading-age {
      @apply h-3 w-14;
    }

    .loading-nationality {
      @apply h-6 w-20 rounded-full sm:h-5;
    }

    .loading-tenure {
      @apply h-3 w-28 max-w-full;
    }
  `,
  template: `
    <rs-page-title title="Trainer" />

    <div class="coaches-grid" [attr.aria-busy]="isLoading()">
      @for (team of teams(); track team.id) {
      <section class="team-card" [attr.aria-label]="team.label">
        @if (isLoading()) {
        <div
          class="coach-loading"
          [class.coach-loading-away]="$index === 1"
          aria-hidden="true"
        >
          @if ($index === 0) {
          <span class="rs-skeleton coach-skeleton loading-photo"></span>
          }
          <div class="loading-details" [class.items-end]="$index === 1">
            <span class="rs-skeleton coach-skeleton loading-name"></span>
            <div class="loading-meta" [class.flex-row-reverse]="$index === 1">
              <span class="rs-skeleton coach-skeleton loading-age"></span>
              <span
                class="rs-skeleton coach-skeleton loading-nationality"
              ></span>
            </div>
            <span class="rs-skeleton coach-skeleton loading-tenure"></span>
          </div>
          @if ($index === 1) {
          <span class="rs-skeleton coach-skeleton loading-photo"></span>
          }
        </div>
        } @else if (team.coach; as coach) {
        <article class="coach" [class.coach-away]="$index === 1">
          @if ($index === 0) {
          <img
            class="coach-photo"
            [src]="coach.photo"
            [alt]="coach.firstname + ' ' + coach.lastname"
            loading="lazy"
          />
          }
          <div class="coach-details" [class.coach-details-away]="$index === 1">
            <strong class="coach-name">
              {{ coach.firstname }} {{ coach.lastname }}
            </strong>
            <span class="coach-meta" [class.coach-meta-away]="$index === 1">
              <span>{{ coach.age }} Jahre</span>
              <span class="coach-nationality">
                @if (nationalityFlag(coach.nationality); as flag) {
                <span class="coach-flag" aria-hidden="true">{{ flag }}</span>
                }
                <span class="coach-nationality-name">
                  {{ coach.nationality | teamName }}
                </span>
              </span>
            </span>
            @if (coachStartDate(coach); as startDate) {
            <span class="coach-tenure">
              Im Amt seit {{ formatDate(startDate) }}
            </span>
            }
          </div>
          @if ($index === 1) {
          <img
            class="coach-photo"
            [src]="coach.photo"
            [alt]="coach.firstname + ' ' + coach.lastname"
            loading="lazy"
          />
          }
        </article>
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
    if (!fixtureTeams) return [];

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
    return (
      this.coaches().find((coach) =>
        coach.career.some((career) => career.team.id === teamId && !career.end)
      ) ?? null
    );
  }

  protected formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return year && month && day ? `${day}.${month}.${year}` : date;
  }

  protected nationalityFlag(nationality: string): string {
    const countryCodes: Record<string, string> = {
      argentina: 'AR',
      argentinian: 'AR',
      austria: 'AT',
      austrian: 'AT',
      belgian: 'BE',
      belgium: 'BE',
      brazil: 'BR',
      brazilian: 'BR',
      canada: 'CA',
      canadian: 'CA',
      croatia: 'HR',
      croatian: 'HR',
      denmark: 'DK',
      danish: 'DK',
      england: 'GB',
      english: 'GB',
      france: 'FR',
      french: 'FR',
      germany: 'DE',
      german: 'DE',
      ghana: 'GH',
      ghanaian: 'GH',
      italy: 'IT',
      italian: 'IT',
      japan: 'JP',
      japanese: 'JP',
      mexico: 'MX',
      mexican: 'MX',
      morocco: 'MA',
      moroccan: 'MA',
      netherlands: 'NL',
      dutch: 'NL',
      nigeria: 'NG',
      nigerian: 'NG',
      norway: 'NO',
      norwegian: 'NO',
      poland: 'PL',
      polish: 'PL',
      portugal: 'PT',
      portuguese: 'PT',
      scotland: 'GB',
      scottish: 'GB',
      senegal: 'SN',
      senegalese: 'SN',
      serbia: 'RS',
      serbian: 'RS',
      spain: 'ES',
      spanish: 'ES',
      sweden: 'SE',
      swedish: 'SE',
      switzerland: 'CH',
      swiss: 'CH',
      turkey: 'TR',
      turkish: 'TR',
      ukraine: 'UA',
      ukrainian: 'UA',
      'united states': 'US',
      american: 'US',
      uruguay: 'UY',
      uruguayan: 'UY',
    };
    const countryCode = countryCodes[nationality.trim().toLowerCase()];
    if (!countryCode) return '';

    return String.fromCodePoint(
      ...[...countryCode].map((character) => this.toRegionalIndicator(character))
    );
  }

  private toRegionalIndicator(character: string): number {
    const codePoint = character.codePointAt(0);

    return codePoint === undefined ? 0 : 127397 + codePoint;
  }

  protected coachStartDate(coach: TeamCoachDTO): string | null {
    const currentCareer = coach.career.find(
      (career) => career.team.id === coach.team.id && !career.end
    );

    return currentCareer?.start ?? null;
  }
}
