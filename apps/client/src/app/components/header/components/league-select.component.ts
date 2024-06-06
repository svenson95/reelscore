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
import { COMPETITION_DATA } from '../../../constants';
import { SelectLeagueData } from '../../../models';
import { BreakpointObserverService } from '../../../services';

@Component({
  selector: 'futbet-header-league-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonToggleModule, LogoComponent],
  styles: `
		:host {
			@apply w-full self-end;

      .mat-button-toggle ::ng-deep .mat-button-toggle-label-content {
        @apply p-0;

        &:not(.logo-toggle) {
          @apply text-fb-font-size-body-2;
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
      --mat-standard-button-toggle-height: var(--fb-size-league-select-height);
			border-bottom: 2px solid transparent;

			&.mat-button-toggle-checked {
				border-bottom-color: var(--fb-color-green-1);
			}

      &.logo-toggle {
        --mat-standard-button-toggle-selected-state-background-color: transparent;
        @apply mr-2 min-[600px]:mr-auto;
      }

			&:not(.logo-toggle) {
        @apply bg-transparent self-end;

        &:not(.mat-button-toggle-checked) {
          --mat-standard-button-toggle-text-color: var(--fb-color-text-2);
        }
			}
		}

    a { @apply flex w-full h-full px-4 py-1; }
	`,
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedLeague()?.url ?? default"
    >
      <mat-button-toggle [value]="default" class="logo-toggle">
        <a [routerLink]="['/']">
          <futbet-logo />
        </a>
      </mat-button-toggle>
      @if (!isMobile()) { @for (l of leagues; track l.label) {
      <mat-button-toggle [value]="l.url">
        <a [routerLink]="['leagues', l.url]">
          {{ l.label }}
        </a>
      </mat-button-toggle>
      } }
    </mat-button-toggle-group>
  `,
})
export class LeagueSelectComponent {
  readonly leagues = COMPETITION_DATA;

  private breakpoint = inject(BreakpointObserverService);

  selectedLeague = input.required<SelectLeagueData | undefined>();
  default = input.required<string>();

  isMobile = computed<boolean>(() => this.breakpoint.isMobile());
}
