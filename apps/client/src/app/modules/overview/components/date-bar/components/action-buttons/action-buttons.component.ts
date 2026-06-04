import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RefreshTickerComponent } from '@app/shared';

import { FilterComponent, SearchComponent } from './components';

const MAT_MODULES = [MatButtonModule, MatIconModule, MatTooltipModule];
@Component({
  selector: 'rs-action-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...MAT_MODULES,
    FilterComponent,
    SearchComponent,
    RefreshTickerComponent,
  ],
  styles: `
    :host {
      @apply flex;
    }

    :host ::ng-deep {
      button[mat-icon-button] {
        --mat-icon-button-state-layer-size: 36px;
        border: 1px solid var(--rs-button-border-color);
        margin-left: 1px;
      }

      mat-icon {
        @apply w-[20px] h-[20px] text-[20px] align-text-top;
      }
    }
  `,
  template: `
    <rs-refresh-ticker />
    <rs-filter />
    <rs-search />
  `,
})
export class ActionButtonsComponent {}
