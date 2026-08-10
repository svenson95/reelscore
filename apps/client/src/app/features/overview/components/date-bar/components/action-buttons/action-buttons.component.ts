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
      @apply flex gap-px;
    }
  `,
  template: `
    <rs-refresh-ticker />
    <rs-filter />
    <rs-search />
  `,
})
export class ActionButtonsComponent {}
