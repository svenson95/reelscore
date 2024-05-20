import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
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
  encapsulation: ViewEncapsulation.None,
  styles: `
    header {
      mat-button-toggle.mat-button-toggle {
        &:not(.logo-toggle) .mat-button-toggle-label-content {
          font-size: var(--fb-font-size-small);
          // material class height change (1)
          line-height: calc(var(--fb-size-league-select-height) - 10px);
        }
      }

      .mat-mdc-form-field-type-mat-select {
        .mdc-text-field--filled:not(.mdc-text-field--disabled) {
          @apply bg-transparent;
        }

        .mat-mdc-floating-label mat-label {
          @apply opacity-50;
        }

        .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }

        .mat-mdc-select-arrow {
          @apply opacity-50;
        }

        &.mat-focused .mat-mdc-select-arrow {
          @apply opacity-50;
        }

        .mdc-text-field--filled .mdc-line-ripple::before {
          border-bottom-width: 0;
        }

        .mdc-text-field--filled:not(.mdc-text-field--disabled)
          .mdc-line-ripple::after {
          border-bottom-color: var(--fb-color-green-1);
        }
      }
    }
  `,
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
