import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FilterButtonComponent } from './filter-button.component';

@Component({
  selector: 'reelscore-action-buttons',
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

      ::ng-deep .mat-mdc-icon-button { 
        --mdc-icon-button-state-layer-size: 36px;
        @apply p-[2px] rounded-[0] border-[1px] border-solid;
        border-color: var(--mdc-outlined-button-disabled-outline-color);
        
        .mat-icon { @apply w-[20px] h-[20px] text-[20px]; }

        .mat-mdc-button-persistent-ripple { 
          @apply rounded-[0];
        }
      }
    }
  `,
  template: `
    <reelscore-filter-button />
    <button mat-icon-button aria-label="Search button" matTooltip="Suche">
      <mat-icon>search</mat-icon>
    </button>
  `,
})
export class ActionButtonsComponent {}
