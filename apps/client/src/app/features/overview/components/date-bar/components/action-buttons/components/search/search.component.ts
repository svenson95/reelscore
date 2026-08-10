import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import type { MatMenuTrigger } from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { filter, startWith, switchMap, take } from 'rxjs';

import {
  linkToMatch,
  SELECT_COMPETITION_DATA_FLAT,
  TeamNamePipe,
} from '@app/shared';
import type {
  FixtureDTO,
  SearchResult,
  SearchResultGroup,
  SearchType,
} from '@lib/models';

import { SearchInputComponent, SearchResultsComponent } from './components';

const MAT_MODULES = [MatButtonModule, MatIconModule, MatMenuModule];

@Component({
  selector: 'rs-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TeamNamePipe],
  imports: [...MAT_MODULES, SearchInputComponent, SearchResultsComponent],
  styles: `
    :host {
      @apply flex;
    }

    ::ng-deep .search-menu .mat-mdc-menu-content {
      @apply p-0;
    }

    .search-menu-content {
      @apply flex flex-col w-[90vw] xs:w-[400px] p-rs2;
    }

    .no-data {
      @apply pt-8 pb-4 text-center text-rs-color-text-2;
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
        <rs-search-input
          class="search-field"
          (dataChange)="updateData($event.results, $event.isLoading)"
        />

        @let groups = resultGroups(); @if (isLoading()) {
        <div class="no-data">Suche läuft ...</div>
        } @else if (groups?.length && groups !== null) {
        <rs-search-results
          [groups]="groups"
          (clickEvent)="navigateAfterMenuClose($event, searchMenuTrigger)"
        />
        } @else if (isSearching()) {
        <div class="no-data">Keine Ergebnisse</div>
        }
      </div>
    </mat-menu>
  `,
})
export class SearchComponent {
  private readonly router = inject(Router);

  readonly searchComponent = viewChild.required(SearchInputComponent);

  private readonly results = signal<SearchResult[] | null>(null);

  readonly resultGroups = computed<SearchResultGroup[] | null>(() => {
    const results = this.results();

    if (results === null) {
      return null;
    }

    const searchGroupLabels: Record<SearchType, string> = {
      fixtures: 'Spiele',
      competitions: 'Wettbewerbe',
      teams: 'Teams',
    };

    return (['competitions', 'teams', 'fixtures'] as const)
      .map((type) => ({
        type,
        label: searchGroupLabels[type],
        results: results.filter((result) => result.type === type),
      }))
      .filter((group) => group.results.length);
  });

  readonly isLoading = signal<boolean>(false);

  private readonly searchTerm = toSignal(
    toObservable(this.searchComponent).pipe(
      filter((c): c is SearchInputComponent => c !== undefined),
      switchMap((component) =>
        component.searchControl.valueChanges.pipe(
          startWith(component.searchControl.value)
        )
      )
    ),
    {
      initialValue: '',
    }
  );

  readonly isSearching = computed<boolean>(() => {
    const searchTerm = this.searchTerm().trim();
    const searchComponent = this.searchComponent();
    return searchTerm.length >= 3 && searchComponent.searchControl.valid;
  });

  updateData(results: SearchResult[] | null, isLoading: boolean): void {
    this.results.set(results);
    this.isLoading.set(isLoading);
  }

  navigateAfterMenuClose(result: SearchResult, trigger: MatMenuTrigger): void {
    trigger.menuClosed.pipe(take(1)).subscribe(() => {
      const link = this.getRouterLink(result);
      void this.router.navigate(link);
    });

    trigger.closeMenu();
  }

  private getRouterLink(result: SearchResult): string[] {
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
}
