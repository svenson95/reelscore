import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SELECT_COMPETITION_DATA } from '@app/constants';
import { CompetitionData } from '@app/models';

@Component({
  selector: 'reelscore-league-select-mobile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatFormFieldModule, MatSelectModule],
  styles: `
    :host ::ng-deep mat-form-field.mat-mdc-form-field-type-mat-select {
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
    }

    ::ng-deep div.leagueSelectMenu.mat-mdc-select-panel {
      max-height: 70vh;
    }

    mat-form-field {
      @apply w-[200px];
    }

    mat-option {
      padding: 0;
      --mat-option-label-text-size: 14px;

      ::ng-deep .mdc-list-item__primary-text {
        @apply w-full;
      }
    }

    a { @apply flex w-full h-full px-4 py-3; }
  `,
  template: `
    <mat-form-field [class.is-selected]="!!selectedLeague()">
      <mat-label>Liga</mat-label>
      <mat-select
        hideSingleSelectionIndicator
        panelClass="leagueSelectMenu"
        [value]="selectedLeague()?.url ?? null"
        (selectionChange)="removeFocus($event)"
      >
        @for (group of groups; track group.label) {
        <mat-optgroup [label]="group.label">
          @for (c of group.competitions; track c.id) {
          <mat-option [value]="c.url">
            <a [routerLink]="['leagues', c.url]">{{ c.label }}</a>
          </mat-option>
          }
        </mat-optgroup>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class LeagueSelectComponent {
  groups = SELECT_COMPETITION_DATA;
  selectedLeague = input.required<CompetitionData | undefined>();
  removeFocus = (e: MatSelectChange) => e.source.close();
}
