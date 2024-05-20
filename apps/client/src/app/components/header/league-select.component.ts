import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';

import { LEAGUES_METADATA } from '../../constants';
import { BreakpointObserverService, LeagueService } from '../../services';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'futbet-header-league-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonToggleModule, LogoComponent],
  styles: `
		:host {
			width: 100%;
			@apply w-full self-end;
		}

		mat-button-toggle-group {
			@apply w-full border-none rounded-none self-end;

			&.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard {
    			border-left: none;
			}
		}

		mat-button-toggle.mat-button-toggle-appearance-standard {
			@apply bg-transparent;
		}

		mat-button-toggle.mat-button-toggle {
			border-bottom: 2px solid transparent;

			&.mat-button-toggle-checked {
				border-bottom-color: var(--fb-color-green-1);
			}

			&:not(.logo-toggle) {
				// material class height change (2)
				height: var(--fb-size-league-select-height);
				align-self: end;
			}
		}
	`,
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedLeague()?.url ?? SELECTED_LEAGUE_DEFAULT"
    >
      <mat-button-toggle
        [value]="SELECTED_LEAGUE_DEFAULT"
        class="logo-toggle mr-2 min-[600px]:mr-auto"
        [routerLink]="['/']"
      >
        <futbet-logo />
      </mat-button-toggle>
      @if (!isMobile()) { @for (l of leagues; track l.label) {
      <mat-button-toggle
        [value]="l.url"
        [routerLink]="['leagues', l.url]"
        [class]="l.url"
      >
        <span class="league-label">{{ l.flag }} {{ l.label }}</span>
      </mat-button-toggle>
      } }
    </mat-button-toggle-group>
  `,
})
export class LeagueSelectComponent {
  private readonly leagueService = inject(LeagueService);
  private readonly breakpoint = inject(BreakpointObserverService);

  readonly SELECTED_LEAGUE_DEFAULT = this.leagueService.SELECTED_LEAGUE_DEFAULT;
  readonly leagues = LEAGUES_METADATA;
  readonly selectedLeague = this.leagueService.selectedLeague;

  readonly isMobile = computed<boolean>(() => this.breakpoint.isMobile());
}
