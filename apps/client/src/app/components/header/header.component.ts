import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BreakpointObserverService, LeagueService } from '../../services';

import {
  LeagueSelectComponent,
  LeagueSelectMobileComponent,
} from './components';

const SELECTED_LEAGUE_DEFAULT = 'start';

@Component({
  selector: 'header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LeagueSelectComponent, LeagueSelectMobileComponent],
  styles: `
    :host { @apply flex p-fb-padding-3 pb-0 border-b-[1px]; }
  `,
  template: `
    <futbet-header-league-select
      [selectedLeague]="selectedLeague()"
      [default]="default"
    />
    @if (isMobile()) {
    <futbet-league-select-mobile [selectedLeague]="selectedLeague()" />
    }
  `,
})
export class HeaderComponent {
  leagueService = inject(LeagueService);
  breakpoint = inject(BreakpointObserverService);
  isMobile = this.breakpoint.isMobile;

  selectedLeague = this.leagueService.selectedLeague;
  default = SELECTED_LEAGUE_DEFAULT;
}
