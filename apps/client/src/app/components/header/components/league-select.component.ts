import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';

import { LogoComponent } from '../../../components';
import { LEAGUES_METADATA } from '../../../constants';
import { BreakpointObserverService } from '../../../services';
import { SelectLeagueState } from '../../../models';

@Component({
  selector: 'futbet-header-league-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonToggleModule, LogoComponent],
  styles: `
		:host {
			width: 100%;
			@apply w-full self-end;

      mat-button-toggle.mat-button-toggle {
        &:not(.logo-toggle) ::ng-deep .mat-button-toggle-label-content {
          font-size: var(--fb-font-size-body-2);
          // material class height change (1)
          line-height: calc(var(--fb-size-league-select-height) - 10px);
        }
      }
		}

		mat-button-toggle-group {
			@apply w-full border-none rounded-none self-end;

			.mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
    			border-left: none;
			}
		}

		mat-button-toggle.mat-button-toggle {
			border-bottom: 2px solid transparent;

			&.mat-button-toggle-checked {
				border-bottom-color: var(--fb-color-green-1);
			}

      &.logo-toggle {
        @apply mr-2 min-[600px]:mr-auto;

        --mat-standard-button-toggle-selected-state-background-color: transparent;
      }

			&:not(.logo-toggle) {
        @apply bg-transparent self-end;

				// material class height change (2)
				height: var(--fb-size-league-select-height);

        &:not(.mat-button-toggle-checked) {
          --mat-standard-button-toggle-text-color: var(--fb-color-text-2);
        }
			}
		}
	`,
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedLeague()?.url ?? default"
    >
      <mat-button-toggle
        [value]="default"
        class="logo-toggle"
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
        <span class="league-label">{{ l.label }}</span>
      </mat-button-toggle>
      } }
    </mat-button-toggle-group>
  `,
})
export class LeagueSelectComponent {
  readonly leagues = LEAGUES_METADATA;

  private breakpoint = inject(BreakpointObserverService);

  selectedLeague = input.required<SelectLeagueState>();
  default = input.required<string>();

  isMobile = computed<boolean>(() => this.breakpoint.isMobile());
}
