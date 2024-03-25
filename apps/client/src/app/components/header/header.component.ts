import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { BreakpointObserverService } from '../../services';

import { LeagueSelectMobileComponent } from './league-select-mobile.component';
import { LeagueSelectComponent } from './league-select.component';

@Component({
  selector: 'header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LeagueSelectComponent, LeagueSelectMobileComponent],
  providers: [BreakpointObserverService],
  template: `
    <futbet-header-league-select />
    @if (isMobile()) {
    <futbet-league-select-mobile />
    }
  `,
})
export class HeaderComponent {
  private readonly breakpoint = inject(BreakpointObserverService);
  readonly isMobile = computed<boolean>(() => this.breakpoint.isMobile());
}
