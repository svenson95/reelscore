import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FilterButtonComponent, SearchMenuComponent } from './components';

@Component({
  selector: 'rs-action-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FilterButtonComponent,
    SearchMenuComponent,
  ],
  styles: `
    :host {
      @apply flex;
    }

    :host ::ng-deep {
      .mat-mdc-icon-button {
        --mdc-icon-button-state-layer-size: 36px;
        border: 1px solid var(--rs-button-border-color);
        margin-left: 1px;
      }

      mat-icon {
        @apply w-[20px] h-[20px] text-[20px] align-text-top;
      }
    }
  `,
  template: `
    <rs-filter-button />

    <rs-search-menu />
  `,
})
export class ActionButtonsComponent {}
