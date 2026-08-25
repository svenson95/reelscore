import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RefreshTickerComponent } from '@app/shared';

import { DateNavigationService } from '../../../services';

import { FilterComponent } from './filter.component';
import { SearchComponent } from './search/search.component';

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
    <rs-refresh-ticker [active]="isToday()" />
    <rs-filter />
    <rs-search />
  `,
})
export class ActionButtonsComponent {
  private readonly dateNavigationService = inject(DateNavigationService);
  readonly isToday = this.dateNavigationService.isToday;
}
