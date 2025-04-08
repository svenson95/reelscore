import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FilterButtonComponent } from './filter-button.component';

@Component({
  selector: 'rs-action-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FilterButtonComponent,
  ],
  styles: `
    :host { 
      @apply flex gap-5;

      ::ng-deep {
        mat-icon { @apply w-[20px] h-[20px] text-[20px]; }

        .mat-mdc-icon-button { 
          @apply bg-rs-color-orange p-[2px];
          --mdc-icon-button-state-layer-size: 36px;
        }
      }
    }
  `,
  template: `
    <rs-filter-button />
    <button mat-icon-button aria-label="Search button" matTooltip="Suche">
      <mat-icon>search</mat-icon>
    </button>
  `,
})
export class ActionButtonsComponent {}
