import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';

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
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
];

@Component({
  selector: 'rs-search-dialog',
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

    .search-dialog-content {
      @apply flex flex-col w-full;
    }

    .search-controls {
      @apply flex w-full items-start gap-rs2;
    }

    .search-field {
      @apply w-full;

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        @apply hidden;
      }
    }

    .close-button {
      @apply shrink-0;
      width: 40px;
      height: 40px;
      padding: 0;
      border: 0;
    }

    .close-button mat-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
      line-height: 24px;
    }

    .search-results {
      @apply mt-rs2;
    }

    .group {
      @apply mt-rs2 first:mt-0;
    }

    .group-title {
      @apply mb-1 text-rs-font-size-small font-semibold opacity-70;
    }

    .result-title {
      @apply truncate font-medium;
    }

    .result-subtitle {
      @apply truncate text-rs-font-size-small text-rs-color-text-2;
    }

    .result-season {
      @apply text-rs-font-size-small text-rs-color-text-2;
    }

    .empty-state {
      @apply pt-6 text-center text-rs-color-text-2;
    }
  `,
  template: `
    <mat-dialog-content class="search-dialog-content">
      <div class="search-controls">
        <mat-form-field class="search-field">
          <input
            matInput
            cdkFocusInitial
            type="search"
            placeholder="Team, Wettbewerb oder Spiel suchen"
            [formControl]="searchControl"
          />
        </mat-form-field>
      </div>

      @let groups = resultGroups(); @if (isLoading()) {
      <div class="empty-state">Suche läuft...</div>
      } @else if (groups?.length) { @for (group of groups; track group.type) {
      <div class="search-results">
        <section class="group">
          <div class="group-title">{{ group.label }}</div>

          <mat-nav-list>
            @for (result of group.results; track result.id) {
            <a
              mat-list-item
              [routerLink]="getRouterLink(result)"
              (click)="closeDialog()"
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

              <span class="result-content" matListItemTitle>
                <span class="result-title">
                  {{ getResultTitle(result) }}
                </span>

                <span class="result-subtitle">
                  {{ getResultSubtitle(result) }}
                </span>

                <span class="result-season">
                  {{ getResultSeason(result) }}
                </span>
              </span>
            </a>
            }
          </mat-nav-list>
        </section>
      </div>
      } } @else if (isSearching()) {
      <div class="empty-state">Keine Ergebnisse.</div>
      }
    </mat-dialog-content>
  `,
})
export class SearchDialogComponent {
  private readonly searchService = inject(SearchService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly teamNamePipe = inject(TeamNamePipe);
  private readonly dialogRef = inject(MatDialogRef<SearchDialogComponent>);

  readonly isLoading = signal<boolean>(false);
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

  readonly searchTerm$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap((searchTerm) => {
      if (!searchTerm.trim() || this.searchControl.invalid) {
        this.results.set(null);
        this.isLoading.set(false);
      }
    }),
    filter((searchTerm) => !!searchTerm.trim() && this.searchControl.valid),
    tap(() => this.isLoading.set(true)),
    switchMap((searchTerm) =>
      this.searchService.getBySearchTerm(searchTerm.trim())
    ),
    takeUntilDestroyed(this.destroyRef)
  );

  constructor() {
    this.searchTerm$.subscribe({
      next: (results) => {
        this.results.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.isLoading.set(false);
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getRouterLink(result: SearchResult): string[] {
    if (result.type === 'competitions') {
      const competition = SELECT_COMPETITION_DATA_FLAT.find(
        (c) => c.id === result.data.league.id
      );
      return competition ? ['competition', competition.url] : ['/'];
    } else if (result.type === 'fixtures') {
      return linkToMatch(result.data as FixtureDTO);
    }
    return ['/'];
  }

  getCompetitionLogo(result: SearchResult): string {
    switch (result.type) {
      case 'competitions':
        return getCompetitionLogo(result.data.league.id, 24);
      case 'fixtures':
        return getCompetitionLogo(result.data.league.id, 24);
      case 'teams':
        return getTeamLogo(result.data.team.id, 48);
    }
  }

  getCompetitionLogoSet(result: SearchResult): string {
    switch (result.type) {
      case 'competitions':
        return getCompetitionLogoSrcSet(result.data.league.id, 24);
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
