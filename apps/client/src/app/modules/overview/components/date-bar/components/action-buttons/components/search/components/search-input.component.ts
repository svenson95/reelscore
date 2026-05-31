import { Component, effect, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import type { SearchResult } from '@lib/models';

import { SEARCH_SERVICE_PROVIDER, SearchService } from '../../../services';

const SEARCH_TERM_PATTERN = /^[\p{L}\p{N} ]+$/u;

const MAT_MODULES = [MatFormFieldModule, MatInputModule];

@Component({
  selector: 'rs-search-input',
  standalone: true,
  imports: [...MAT_MODULES, ReactiveFormsModule],
  providers: [SEARCH_SERVICE_PROVIDER],
  styles: `
    .search-field {
      @apply w-full;

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        @apply hidden;
      }
    }
  `,
  template: `
    <mat-form-field class="search-field">
      <input
        matInput
        type="text"
        placeholder="Suche"
        [formControl]="searchControl"
      />

      @if (searchControl.hasError('required')) {
      <mat-error>Suchbegriff ist erforderlich</mat-error>
      } @if (searchControl.hasError('minlength')) {
      <mat-error>Mindestens 3 Zeichen</mat-error>
      } @if (searchControl.hasError('maxlength')) {
      <mat-error>Maximal 15 Zeichen</mat-error>
      } @if (searchControl.hasError('pattern')) {
      <mat-error>Ungültiger Suchbegriff</mat-error>
      }
    </mat-form-field>
  `,
})
export class SearchInputComponent {
  private readonly searchService = inject(SearchService);

  readonly searchControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern(SEARCH_TERM_PATTERN),
    ],
  });

  readonly dataChange = output<{
    results: SearchResult[] | null;
    isLoading: boolean;
  }>();

  private readonly searchControlValue = toSignal<string>(
    this.searchControl.valueChanges
  );

  readonly searchingEffect = effect((onCleanup) => {
    const searchTerm = this.searchControlValue();

    if (!searchTerm || this.searchControl.invalid) {
      this.dataChange.emit({ results: null, isLoading: false });
      return;
    }

    this.dataChange.emit({ results: null, isLoading: true });

    const timeout = setTimeout(() => {
      const subscription = this.searchService
        .getBySearchTerm(searchTerm)
        .subscribe({
          next: (results) => {
            this.dataChange.emit({ results, isLoading: false });
          },
          error: () => {
            this.dataChange.emit({ results: [], isLoading: false });
          },
        });

      onCleanup(() => subscription.unsubscribe());
    }, 300);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
