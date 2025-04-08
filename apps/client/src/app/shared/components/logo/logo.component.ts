import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  input,
} from '@angular/core';

import { LoadingService } from '../../services';

@Component({
  selector: 'rs-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply select-none text-rs-font-size-body-1 tracking-wide font-normal; }
    :host span:first-child { @apply text-rs-color-orange; }
    :host span:last-child { @apply text-white; }
    :host([disabled]) { @apply opacity-75; }

    :host.is-loading {
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: var(--rs-color-orange);
        animation: underlineAnimation 1s infinite ease-in-out;
      }

      @keyframes underlineAnimation {
        0% {
          transform: scaleX(0);
          transform-origin: bottom left;
        }
        49% {
          transform-origin: bottom left;
        }
        50% {
          transform: scaleX(1);
          transform-origin: bottom right;
        }
        100% {
          transform: scaleX(0);
          transform-origin: bottom right;
        }
      }
    }
  `,
  template: `
    <span>reel</span>
    <span>score</span>
  `,
})
export class LogoComponent {
  isLoading = inject(LoadingService).isLoading;
  showLoadingIndicator = input<boolean>(false);

  @HostBinding('class.is-loading')
  get loadingClassBinding() {
    return this.showLoadingIndicator() && this.isLoading() === true;
  }
}
