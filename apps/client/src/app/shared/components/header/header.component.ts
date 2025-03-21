import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { BreakpointObserverService, LeagueService } from '../../services';
import { LogoComponent } from '../logo/logo.component';
import { LeagueSelectComponent } from './components';

const SELECTED_LEAGUE_DEFAULT = 'start';

@Component({
  selector: 'header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, LogoComponent, LeagueSelectComponent],
  styles: `
    :host { @apply p-fb-padding-3 border-b-[1px] bg-fb-red; }
    .wrapper { @apply flex items-center justify-between lg:px-fb-padding-3; }
  `,
  template: `
    <div class="wrapper">
      <a mat-button [routerLink]="['/']">
        <reelscore-logo [showLoadingIndicator]="true" />
      </a>
      <reelscore-league-select [selectedLeague]="selectedLeague()" />
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
