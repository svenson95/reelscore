import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { SELECT_COMPETITION_DATA } from '@app/constants';
import { CompetitionData } from '@app/models';
import { OptimizedImageComponent } from '../../optimized-image/optimized-image.component';

@Component({
  selector: 'reelscore-league-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    OptimizedImageComponent,
  ],
  styles: `
    :host ::ng-deep mat-form-field.mat-mdc-form-field-type-mat-select {
      .mat-mdc-floating-label mat-label { @apply opacity-50; }
      .mat-mdc-form-field-subscript-wrapper { display: none; }
      .mat-mdc-select-arrow { @apply opacity-50; }
      &.mat-focused .mat-mdc-select-arrow { @apply opacity-50; }

      .mdc-text-field--filled .mdc-line-ripple::before {
        border-bottom-width: 0;
      }
    }

    mat-form-field { @apply w-[220px]; }
    ::ng-deep div.leagueSelectMenu.mat-mdc-select-panel {
      max-height: 70vh;

      mat-option .mdc-list-item__primary-text {
        @apply w-full;
      }
    }

    mat-select { --mat-select-trigger-text-size: var(--fb-font-size-body-2); }
    mat-form-field.mat-mdc-form-field-type-mat-select {
      --mdc-filled-text-field-label-text-size: var(--fb-font-size-body-2);
    }

    mat-option {
      padding: 0;
      --mat-option-label-text-size: var(--fb-font-size-small);
      min-height: 32px;

      a { @apply flex w-full h-full px-4 py-1 gap-2; }
    }
  `,
  template: `
    <mat-form-field [class.is-selected]="!!selectedLeague()">
      <mat-label>Wettbewerb</mat-label>
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
            <a [routerLink]="['leagues', c.url]">
              <reelscore-optimized-image
                [source]="c.image"
                [alternate]="c.label"
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
export class LeagueSelectComponent {
  groups = SELECT_COMPETITION_DATA;
  selectedLeague = input.required<CompetitionData | undefined>();
  removeFocus = (e: MatSelectChange) => e.source.close();
}
