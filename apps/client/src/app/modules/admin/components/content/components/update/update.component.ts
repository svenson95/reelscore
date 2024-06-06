import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  AdminService,
  HTTP_RAPID_SERVICE_PROVIDER,
} from '../../../../services';

import { UpdateFixtureStatisticsComponent } from './fixture-statistics/fixture-statistics.component';
import { UpdateFixturesComponent } from './fixtures/fixtures.component';
import { UpdateStandingsComponent } from './standings/standings.component';

@Component({
  selector: 'futbet-admin-content-update',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpdateFixturesComponent,
    UpdateStandingsComponent,
    UpdateFixtureStatisticsComponent,
  ],
  providers: [HTTP_RAPID_SERVICE_PROVIDER],
  styles: `
    :host { @apply flex flex-col flex-[3]; }
  `,
  template: `
    @switch(activeView()) { @case('update-standings') {
    <futbet-admin-update-standings />
    } @case('update-fixtures') {
    <futbet-admin-update-fixtures />
    } @case('update-statistics') {
    <futbet-admin-update-fixture-statistics />
    } }
  `,
})
export class ContentUpdateComponent {
  as = inject(AdminService);
  activeView = this.as.view;
}
