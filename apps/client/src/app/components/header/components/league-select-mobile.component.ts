import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { COMPETITION_DATA } from '../../../constants';
import { SelectLeagueData } from '../../../models';

@Component({
  selector: 'futbet-league-select-mobile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatFormFieldModule, MatSelectModule],
  styles: `
    mat-form-field {
      @apply w-[200px];
    }

    :host mat-form-field.mat-mdc-form-field-type-mat-select ::ng-deep {
      .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        @apply bg-transparent;
      }

      .mat-mdc-floating-label mat-label {
        @apply opacity-50;
      }

      .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .mat-mdc-select-arrow {
        @apply opacity-50;
      }

      &.mat-focused .mat-mdc-select-arrow {
        @apply opacity-50;
      }

      .mdc-text-field--filled .mdc-line-ripple::before {
        border-bottom-width: 0;
      }

      .mdc-text-field--filled:not(.mdc-text-field--disabled)
        .mdc-line-ripple::after {
        border-bottom-color: var(--fb-color-green-1);
        }
    }

    mat-option {
      padding: 0;

      ::ng-deep .mdc-list-item__primary-text {
        @apply w-full;
      }
    }

    a { @apply flex w-full h-full px-4 py-3; }
  `,
  template: `
    <mat-form-field>
      <mat-label>Liga</mat-label>
      <mat-select
        hideSingleSelectionIndicator
        [value]="selectedLeague()?.url ?? null"
      >
        @for (l of leagues; track l.id) {
        <mat-option [value]="l.url">
          <a [routerLink]="['leagues', l.url]">{{ l.label }}</a>
        </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class LeagueSelectMobileComponent {
  readonly leagues = COMPETITION_DATA;

  selectedLeague = input.required<SelectLeagueData | undefined>();
}
