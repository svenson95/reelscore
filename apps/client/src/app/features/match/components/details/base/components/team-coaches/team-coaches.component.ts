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

    .team-heading {
      @apply flex min-w-0 items-center gap-2 border-b border-rs-border-color-1 pb-2 pl-2 text-base font-semibold text-rs-color-text-1 sm:gap-3 sm:pb-3 sm:text-lg;
    }

    .team-logo {
      @apply h-6 w-6 shrink-0 object-contain sm:h-8 sm:w-8;
    }

    .coach {
      @apply grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-4;
    }

    .coach-photo {
      @apply aspect-square w-14 rounded-full bg-rs-alt-bg object-cover object-top shadow-rs2 sm:w-20;
    }

    .coach-details {
      @apply flex min-w-0 flex-col gap-1 text-xs text-rs-color-text-1 sm:gap-2 sm:text-rs-font-size-body-2;
    }

    .coach-name {
      @apply block break-words text-sm font-semibold leading-tight sm:text-base;
    }

    .coach-birth,
    .coach-tenure {
      @apply text-rs-color-text-2;
    }

    .coach-team {
      @apply inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border border-rs-border-color-1 px-2 py-0.5 sm:gap-2 sm:px-3 sm:py-1;
    }

    .coach-team-logo {
      @apply h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5;
    }

    .coach-team-name {
      @apply min-w-0 break-words font-medium;
    }

    .placeholder {
      @apply h-3 w-28 max-w-full sm:h-4 sm:w-36;
    }
  `,
  template: `
    <rs-page-title title="Trainer" />

    <div class="coaches-grid" [attr.aria-busy]="isLoading()">
      @for (team of teams(); track team.id) {
      <section class="team-card" [attr.aria-label]="team.label">
        <h3 class="team-heading">
          <img class="team-logo" [src]="team.logo" alt="" loading="lazy" />
          <span>{{ team.name | teamName }}</span>
        </h3>

        @if (isLoading()) {
        <span class="rs-skeleton placeholder" aria-hidden="true"></span>
        } @else if (team.coach; as coach) {
        <article class="coach">
          <img
            class="coach-photo"
            [src]="coach.photo"
            [alt]="coach.firstname + ' ' + coach.name"
            loading="lazy"
          />
          <div class="coach-details">
            <strong class="coach-name"
              >{{ coach.firstname }} {{ coach.name }}</strong
            >
            <span class="coach-birth">
              {{ coach.age }} Jahre · geb. {{ formatDate(coach.birth.date) }}
            </span>
            <span class="coach-team">
              <img
                class="coach-team-logo"
                [src]="coach.team.logo"
                alt=""
                loading="lazy"
              />
              <span class="coach-team-name">{{ coach.team.name | teamName }}</span>
            </span>
            @if (coachStartDate(coach); as startDate) {
            <span class="coach-tenure"
              >Im Amt seit {{ formatDate(startDate) }}</span
            >
            }
          </div>
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
        name: fixtureTeams.home.name,
        logo: fixtureTeams.home.logo,
        coach: this.getCurrentCoach(fixtureTeams.home.id),
      },
      {
        id: fixtureTeams.away.id,
        label: 'Trainer des Auswärtsteams',
        name: fixtureTeams.away.name,
        logo: fixtureTeams.away.logo,
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

  protected coachStartDate(coach: TeamCoachDTO): string | null {
    const currentCareer = coach.career.find(
      (career) => career.team.id === coach.team.id && !career.end
    );

    return currentCareer?.start ?? null;
  }
}
