import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { SELECT_COMPETITION_DATA } from '../../../constants';
import { CompetitionData } from '../../../models';
import { OptimizedImageComponent } from '../../optimized-image/optimized-image.component';

@Component({
  selector: 'nav[rs-competition-select]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    OptimizedImageComponent,
  ],
  styles: `
    :host ::ng-deep mat-form-field.mat-mdc-form-field-type-mat-select {
      .mat-mdc-form-field-subscript-wrapper { @apply hidden; }
      .mdc-text-field--filled .mdc-line-ripple::before { @apply border-b-0; }
    }

    mat-form-field { @apply w-[220px] bg-white; }
    ::ng-deep div.competitionSelectMenu.mat-mdc-select-panel {
      @apply max-h-[70vh];

      mat-option .mdc-list-item__primary-text { @apply w-full; }

      .mat-mdc-optgroup-label {
        .mdc-list-item__primary-text { @apply contents; }

        ::after {
          content: '';
          background: #e3e3e3;
          height: 1px;
          width: 100%;
          display: inline-flex;
          vertical-align: middle;
          margin-left: 10px;
        }
      }
    }

    mat-form-field.mat-mdc-form-field-type-mat-select {
      --mdc-filled-text-field-label-text-size: var(--rs-font-size-body-1);
      --mdc-filled-text-field-label-text-color: var(--rs-color-text-2);
      --mdc-filled-text-field-hover-label-text-color: var(--rs-color-text-1);
    }

    mat-select { 
      --mat-select-trigger-text-size: var(--rs-font-size-body-1);
      --mat-select-enabled-arrow-color: var(--rs-color-text-2);
      --mat-select-focused-arrow-color: var(--fb-color-black);
    }

    mat-option {
      --mat-option-label-text-size: var(--rs-font-size-small);
      @apply min-h-[32px] p-0;

      a { @apply flex w-full h-full px-4 py-1 gap-2; }
      .competition-logo + span { @apply leading-[1.3] content-center; }
    }
  `,
  template: `
    <mat-form-field [class.is-selected]="!!selectedCompetition()">
      <mat-label>Wettbewerb</mat-label>
      <mat-select
        hideSingleSelectionIndicator
        panelClass="competitionSelectMenu"
        [value]="selectedCompetition()?.url ?? null"
        (selectionChange)="removeFocus($event)"
      >
        @for (group of groups; track group.label) {
        <mat-optgroup [label]="group.label">
          @for (c of group.competitions; track c.id) {
          <mat-option [value]="c.url">
            <a [routerLink]="['competition', c.url]">
              <rs-optimized-image
                class="competition-logo"
                [source]="c.image"
                [altText]="c.label"
                width="14"
                height="14"
              />
              <span>{{ c.label }}</span>
            </a>
          </mat-option>
          }
        </mat-optgroup>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class CompetitionSelectComponent {
  groups = SELECT_COMPETITION_DATA;
  selectedCompetition = input.required<CompetitionData | undefined>();
  removeFocus = (e: MatSelectChange) => e.source.close();
}
