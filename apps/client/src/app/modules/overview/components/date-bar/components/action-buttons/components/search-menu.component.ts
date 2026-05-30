import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import {
  getCompetitionLogo,
  getCompetitionLogoSrcSet,
  getTeamLogo,
  getTeamLogoSrcSet,
  linkToMatch,
  ResponsiveImageComponent,
  SELECT_COMPETITION_DATA_FLAT,
  TeamNamePipe,
} from '@app/shared';
import type {
  FixtureDTO,
  SearchResult,
  SearchResultGroup,
  SearchType,
} from '@lib/models';

import { SEARCH_SERVICE_PROVIDER, SearchService } from '../services';

const SEARCH_TERM_PATTERN = /^[\p{L}\p{N} ]+$/u;

const SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  fixtures: 'Spiele',
  competitions: 'Wettbewerbe',
  teams: 'Teams',
};

const MAT_MODULES = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
];

@Component({
  selector: 'rs-search-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SEARCH_SERVICE_PROVIDER, TeamNamePipe],
  imports: [
    A11yModule,
    ReactiveFormsModule,
    RouterLink,
    ...MAT_MODULES,
    ResponsiveImageComponent,
  ],
  styles: `
    :host {
      @apply block;
    }

    .search-menu-content {
      @apply flex flex-col w-[90vw] xs:w-[400px] p-rs2;
    }

    .search-field {
      @apply w-full;

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        @apply hidden;
      }
    }

    .search-results {
      @apply mt-rs2 max-h-[60dvh];
    }

    .group {
      @apply mt-rs2 first:mt-0;
    }

    .group-title {
      @apply mb-1 text-rs-font-size-small font-semibold text-rs-color-text-2;
    }

    .result-title {
      @apply truncate font-medium text-rs-font-size-body-2;
    }

    .result-subtitle {
      @apply truncate text-rs-font-size-small text-rs-color-text-2;
    }

    .result-season {
      @apply text-rs-font-size-small text-rs-color-text-2;
    }

    .no-data {
      @apply pt-6 pb-2 text-center text-rs-color-text-2;
    }
  `,
  template: `
    <button
      class="search-button"
      mat-icon-button
      type="button"
      [matMenuTriggerFor]="searchMenu"
      #searchMenuTrigger="matMenuTrigger"
      aria-label="Suche öffnen"
      [class.is-open]="searchMenuTrigger.menuOpen"
    >
      <mat-icon>search</mat-icon>
    </button>

    <mat-menu
      #searchMenu="matMenu"
      class="search-menu"
      xPosition="before"
      yPosition="below"
      [overlapTrigger]="false"
    >
      <div
        class="search-menu-content"
        (click)="$event.stopPropagation()"
        (keydown)="$event.stopPropagation()"
      >
        <mat-form-field class="search-field">
          <input
            matInput
            cdkFocusInitial
            type="search"
            placeholder="Team oder Wettbewerb"
            [formControl]="searchControl"
          />
        </mat-form-field>

        @let groups = resultGroups(); @if (isLoading()) {
        <div class="no-data">Suche läuft ...</div>
        } @else if (groups?.length) {
        <div class="search-results">
          @for (group of groups; track group.type) {
          <section class="group">
            <div class="group-title">{{ group.label }}</div>

            <mat-nav-list>
              @for (result of group.results; track result.id) {
              <a
                mat-list-item
                [routerLink]="getRouterLink(result)"
                (click)="searchMenuTrigger.closeMenu()"
              >
                <mat-icon class="result-icon" matListItemIcon>
                  <rs-responsive-image
                    [source]="getCompetitionLogo(result)"
                    [sourceSet]="getCompetitionLogoSet(result)"
                    altText="league logo"
                    [width]="24"
                    [height]="24"
                  />
                </mat-icon>

                <div class="result-content flex flex-col" matListItemTitle>
                  <div class="flex">
                    <span class="result-title leading-normal">
                      {{ getResultTitle(result) }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <span class="result-subtitle leading-normal">
                      {{ getResultSubtitle(result) }}
                    </span>

                    <span class="result-season leading-normal">
                      {{ getResultSeason(result) }}
                    </span>
                  </div>
                </div>
              </a>
              }
            </mat-nav-list>
          </section>
          }
        </div>
        } @else if (isSearching()) {
        <div class="no-data">Keine Ergebnisse</div>
        }
      </div>
    </mat-menu>
  `,
})
export class SearchMenuComponent {
  private readonly searchService = inject(SearchService);
  private readonly teamNamePipe = inject(TeamNamePipe);

  readonly isLoading = signal<boolean>(false);

  readonly searchControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern(SEARCH_TERM_PATTERN),
    ],
  });

  readonly searchTerm = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value,
  });

  readonly isSearching = computed(() => {
    const searchTerm = this.searchTerm().trim();

    return searchTerm.length >= 3 && this.searchControl.valid;
  });

  private readonly results = signal<SearchResult[] | null>(null);

  readonly resultGroups = computed<SearchResultGroup[] | null>(() => {
    const results = this.results();

    if (results === null) {
      return null;
    }

    return (['competitions', 'teams', 'fixtures'] as const)
      .map((type) => ({
        type,
        label: SEARCH_TYPE_LABELS[type],
        results: results.filter((result) => result.type === type),
      }))
      .filter((group) => group.results.length);
  });

  searchingEffect = effect((onCleanup) => {
    const searchTerm = this.searchTerm().trim();

    if (!searchTerm || this.searchControl.invalid) {
      this.results.set(null);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    const timeout = setTimeout(() => {
      const subscription = this.searchService
        .getBySearchTerm(searchTerm)
        .subscribe({
          next: (results) => {
            this.results.set(results);
            this.isLoading.set(false);
          },
          error: () => {
            this.results.set([]);
            this.isLoading.set(false);
          },
        });

      onCleanup(() => subscription.unsubscribe());
    }, 300);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  getRouterLink(result: SearchResult): string[] {
    if (result.type === 'competitions') {
      const competition = SELECT_COMPETITION_DATA_FLAT.find(
        (c) => c.id === result.data.league.id
      );

      return competition ? ['/', 'competition', competition.url] : ['/'];
    }

    if (result.type === 'fixtures') {
      return linkToMatch(result.data as FixtureDTO);
    }

    return ['/'];
  }

  getCompetitionLogo(result: SearchResult): string {
    switch (result.type) {
      case 'competitions':
      case 'fixtures':
        return getCompetitionLogo(result.data.league.id, 24);

      case 'teams':
        return getTeamLogo(result.data.team.id, 48);
    }
  }

  getCompetitionLogoSet(result: SearchResult): string {
    switch (result.type) {
      case 'competitions':
      case 'fixtures':
        return getCompetitionLogoSrcSet(result.data.league.id, 24);

      case 'teams':
        return getTeamLogoSrcSet(result.data.team.id, 48);
    }
  }

  getResultTitle(result: SearchResult): string {
    switch (result.type) {
      case 'fixtures':
        return [
          this.teamNamePipe.transform(result.data.teams.home.name ?? ''),
          this.teamNamePipe.transform(result.data.teams.away.name ?? ''),
        ]
          .filter(Boolean)
          .join(' - ');

      case 'competitions':
        return result.data.league.name ?? '';

      case 'teams':
        return this.teamNamePipe.transform(result.data.team.name ?? '');
    }
  }

  getResultSubtitle(result: SearchResult): string {
    switch (result.type) {
      case 'fixtures':
        return result.data.league.name ?? '';

      case 'competitions':
        return result.data.league.country ?? '';

      case 'teams':
        return '';
    }
  }

  getResultSeason(result: SearchResult): string {
    if (result.type === 'fixtures') {
      const season = Number(String(result.data.league.season).substring(2, 4));

      return `${season}/${season + 1}`;
    }

    return '';
  }
}
