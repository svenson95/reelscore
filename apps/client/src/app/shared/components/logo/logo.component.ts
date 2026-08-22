import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { LoadingService } from '../../services';

const MIN_LOADING_DURATION_MS = 1000;

@Component({
  selector: 'rs-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'app-logo',
    '[class.is-loading]': 'isLoadingIndicatorVisible()',
  },
  styles: `
    :host {
      @apply inline-flex select-none items-center
        text-rs-font-size-body-1 font-semibold tracking-normal
        text-rs-color-text-1;
    }

    .logo-icon {
      @apply flex size-9 shrink-0 items-center justify-center
        overflow-hidden rounded-border2;
    }

    .logo-icon picture {
      @apply flex items-center justify-center;
    }

    .logo-icon img {
      @apply size-7 object-contain;
    }

    .logo-text {
      @apply relative;
    }

    :host.is-loading .logo-text::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: -2px;
      left: 0;
      background-color: var(--rs-color-primary);
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
  `,
  template: `
    <span class="logo-icon" aria-hidden="true">
      <picture>
        <source
          srcset="assets/icons/logo-white.png"
          media="(prefers-color-scheme: dark)"
        />
        <img src="assets/icons/logo-black.png" alt="" />
      </picture>
    </span>

    <span class="logo-text">reelscore</span>
  `,
})
export class LogoComponent {
  private readonly loadingService = inject(LoadingService);
  private readonly destroyRef = inject(DestroyRef);

  readonly showLoadingIndicator = input(false);

  readonly isLoadingIndicatorVisible = signal(false);

  private loadingStartedAt = 0;
  private hideTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const shouldShow =
        this.showLoadingIndicator() && this.loadingService.isLoading();

      if (shouldShow) {
        this.showLoading();
      } else {
        this.hideLoading();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearHideTimeout();
    });
  }

  private showLoading(): void {
    this.clearHideTimeout();

    if (this.isLoadingIndicatorVisible()) {
      return;
    }

    this.loadingStartedAt = Date.now();
    this.isLoadingIndicatorVisible.set(true);
  }

  private hideLoading(): void {
    if (!this.isLoadingIndicatorVisible()) {
      return;
    }

    const elapsed = Date.now() - this.loadingStartedAt;
    const remaining = Math.max(MIN_LOADING_DURATION_MS - elapsed, 0);

    if (remaining === 0) {
      this.isLoadingIndicatorVisible.set(false);
      return;
    }

    this.hideTimeout = setTimeout(() => {
      this.isLoadingIndicatorVisible.set(false);
      this.hideTimeout = undefined;
    }, remaining);
  }

  private clearHideTimeout(): void {
    if (this.hideTimeout === undefined) {
      return;
    }

    clearTimeout(this.hideTimeout);
    this.hideTimeout = undefined;
  }
}
