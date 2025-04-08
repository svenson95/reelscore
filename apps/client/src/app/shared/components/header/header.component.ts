import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { BreakpointObserverService, LeagueService } from '../../services';

import { LogoComponent } from '../logo/logo.component';

import { LeagueSelectComponent } from './components';

const SELECTED_LEAGUE_DEFAULT = 'start';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, LogoComponent, LeagueSelectComponent],
  styles: `
    :host { @apply p-rs-padding-3 border-b-[1px] border-rs-color-orange rs-bg-color z-[15] relative; }
    .wrapper { @apply flex items-center justify-between lg:px-rs-padding-3; }
  `,
  template: `
    <div class="wrapper">
      <a mat-button [routerLink]="['/']">
        <rs-logo [showLoadingIndicator]="true" />
      </a>
      <rs-league-select [selectedLeague]="selectedLeague()" />
    </div>
  `,
})
export class HeaderComponent {
  leagueService = inject(LeagueService);
  breakpoint = inject(BreakpointObserverService);
  isMobile = this.breakpoint.isMobile;

  selectedLeague = this.leagueService.selectedLeague;
  default = SELECTED_LEAGUE_DEFAULT;
}
