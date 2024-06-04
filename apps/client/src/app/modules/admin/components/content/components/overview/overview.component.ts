import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminService, DATABASE_SERVICE_PROVIDER } from '../../../../service';
import { OverviewFixturesComponent } from './fixtures/fixtures.component';

@Component({
  selector: 'futbet-admin-content-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverviewFixturesComponent],
  providers: [DATABASE_SERVICE_PROVIDER],
  styles: `
  `,
  template: `
    @switch(activeView()) { @case('overview-standings') {
    <!-- <futbet-admin-overview-standings /> -->
    } @case('overview-fixtures') {
    <futbet-admin-overview-fixtures />
    } @case('overview-statistics') {
    <!-- <futbet-admin-overview-statistics /> -->
    } }
  `,
})
export class ContentOverviewComponent {
  as = inject(AdminService);
  activeView = this.as.view;
}
