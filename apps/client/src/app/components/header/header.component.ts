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
    :host { @apply flex justify-between p-fb-padding-3 pb-0 border-b-[1px]; }
  `,
  template: `
    <a mat-button [routerLink]="['/']">
      <reelscore-logo />
    </a>
    <reelscore-league-select-mobile [selectedLeague]="selectedLeague()" />
  `,
})
export class HeaderComponent {
  leagueService = inject(LeagueService);
  breakpoint = inject(BreakpointObserverService);
  isMobile = this.breakpoint.isMobile;

  selectedLeague = this.leagueService.selectedLeague;
  default = SELECTED_LEAGUE_DEFAULT;
}
