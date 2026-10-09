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

    .team-card:nth-child(1) {
      @apply max-sm:mr-6;
    }

    .team-card:nth-child(2) {
      @apply max-sm:ml-6;
    }

    .coach {
      @apply grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)] items-center gap-4 ml-2;
    }

    .coach-away {
      @apply grid-cols-[minmax(0,1fr)_2.75rem] sm:grid-cols-[minmax(0,1fr)_4rem] mr-2;
    }

    .coach-photo {
      @apply aspect-square w-11 rounded-full bg-rs-alt-bg object-cover object-top shadow-rs2 sm:w-16;
    }

    .coach-details {
      @apply flex min-w-0 flex-col gap-1 text-xs text-rs-color-text-1 sm:text-rs-font-size-body-2;
    }

    .coach-details-away {
      @apply items-end text-right;
    }

    .coach-name {
      @apply block break-words text-rs-font-size-body-1 font-semibold leading-tight;
    }

    .coach-tenure {
      @apply text-rs-color-text-2;
    }

    .coach-meta {
      display: flex;
      height: 1.2em;
      flex: 0 0 1.2em;
      flex-wrap: wrap;
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

    .coach-flag {
      @apply h-[16px] w-[20px] shrink-0 rounded-sm object-cover shadow-rs3;
    }

    .coach-nationality-name {
      @apply min-w-0 break-words font-medium;
    }

    .coach-skeleton {
      @apply rounded;
    }

    .loading-photo {
      @apply aspect-square w-11 rounded-full sm:w-16;
    }

    .loading-name {
      @apply h-[18.75px] w-3/4 max-w-40;
    }

    .loading-age {
      @apply h-3 w-12;
    }

    .loading-nationality {
      @apply h-3 w-16;
    }

    .loading-tenure {
      @apply h-4 w-28 max-w-full;
    }
  `,
  template: `
    <rs-page-title title="Trainer" />

    <div class="coaches-grid" [attr.aria-busy]="isLoading()">
      @for (team of teams(); track team.id) {
      <section class="team-card" [attr.aria-label]="team.label">
        @if (isLoading() || team.coach) {
        <article
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
          <img
            class="coach-photo"
            [src]="coach.photo"
            [alt]="coachName(coach)"
            loading="lazy"
          />
          } }
          <div
            class="coach-details"
            [class.coach-details-away]="$index === 1"
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
                  class="coach-flag"
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
          <img
            class="coach-photo"
            [src]="coach.photo"
            [alt]="coachName(coach)"
            loading="lazy"
          />
          } }
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

  protected nationalityFlagUrl(nationality: string | null | undefined): string {
    if (!nationality) return '';

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
      romania: 'RO',
      romanian: 'RO',
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

    return `https://media.api-sports.io/flags/${countryCode.toLowerCase()}.svg`;
  }

  protected coachStartDate(coach: TeamCoachDTO): string | null {
    const currentCareer = coach.career.find(
      (career) => career.team.id === coach.team.id && !career.end
    );

    return currentCareer?.start ?? null;
  }
}
