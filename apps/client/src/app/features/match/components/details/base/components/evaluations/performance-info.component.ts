import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rs-performance-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, CdkConnectedOverlay, CdkOverlayOrigin],
  styles: `
    :host {
      display: inline-flex;
    }

    .info-button {
      @apply inline-flex h-6 w-6 items-center justify-center rounded-full text-rs-color-text-1;
    }

    .info-button:hover,
    .info-button:focus-visible {
      @apply bg-rs-alt-bg;
    }

    .info-button mat-icon {
      @apply h-5 w-5 text-[20px];
    }

    .performance-menu {
      @apply z-50 max-w-[min(22rem,calc(100vw-2rem))] rounded-border2 bg-rs-color-primary p-4 text-black shadow-rs3;
    }

    .performance-menu-title {
      @apply mb-3 block font-semibold;
    }

    .performance-rule {
      @apply grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-2 py-1 text-rs-font-size-small;
    }

    .evaluation-item {
      @apply flex h-7 w-7 items-center justify-center rounded shadow-rs2 text-xs font-semibold leading-none;
    }

    .high {
      @apply bg-rs-color-green text-white;
    }

    .middle {
      @apply bg-gray-200 text-black;
    }

    .low {
      @apply bg-rs-color-red text-white;
    }

    .no-statistics-available {
      @apply bg-gray-500 text-white;
    }
  `,
  template: `
    <button
      class="info-button"
      type="button"
      aria-label="Erklärung der Performance-Bewertung anzeigen"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-controls]="menuId()"
      [attr.aria-describedby]="isOpen() ? menuId() : null"
      cdkOverlayOrigin
      #infoOrigin="cdkOverlayOrigin"
      (click)="toggleInfo()"
      (keydown.escape)="closeInfo()"
    >
      <mat-icon aria-hidden="true">info_outline</mat-icon>
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="infoOrigin"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="
        side() === 'away' ? awayPositions : homePositions
      "
      (overlayOutsideClick)="closeInfo()"
    >
      <aside class="performance-menu" [id]="menuId()" role="tooltip">
        <strong class="performance-menu-title">
          So wird die Performance bewertet
        </strong>
        <div class="performance-rule">
          <span class="evaluation-item high">G</span>
          <span>
            <strong>Gut:</strong> mindestens 2 Tore und mindestens 4 Schüsse
            aufs Tor sowie 8 Abschlüsse
          </span>
        </div>
        <div class="performance-rule">
          <span class="evaluation-item middle">M</span>
          <span>
            <strong>Mittelmäßig:</strong> mindestens 4 Schüsse aufs Tor und 8
            Abschlüsse, aber weniger als 2 Tore
          </span>
        </div>
        <div class="performance-rule">
          <span class="evaluation-item low">S</span>
          <span>
            <strong>Schlecht:</strong> weniger als 4 Schüsse aufs Tor oder
            weniger als 8 Abschlüsse
          </span>
        </div>
        <div class="performance-rule">
          <span class="evaluation-item no-statistics-available">—</span>
          <span
            >Bei unvollständigen Datensätzen ist keine Bewertung möglich</span
          >
        </div>
      </aside>
    </ng-template>
  `,
})
export class PerformanceInfoComponent {
  readonly side = input.required<'home' | 'away'>();
  readonly menuId = input.required<string>();
  readonly isOpen = input.required<boolean>();
  readonly openChange = output<boolean>();

  protected readonly homePositions = [
    {
      originX: 'start' as const,
      originY: 'bottom' as const,
      overlayX: 'start' as const,
      overlayY: 'top' as const,
      offsetY: 8,
    },
    {
      originX: 'start' as const,
      originY: 'top' as const,
      overlayX: 'start' as const,
      overlayY: 'bottom' as const,
      offsetY: -8,
    },
  ];

  protected readonly awayPositions = [
    {
      originX: 'end' as const,
      originY: 'bottom' as const,
      overlayX: 'end' as const,
      overlayY: 'top' as const,
      offsetY: 8,
    },
    {
      originX: 'end' as const,
      originY: 'top' as const,
      overlayX: 'end' as const,
      overlayY: 'bottom' as const,
      offsetY: -8,
    },
  ];

  protected toggleInfo(): void {
    this.openChange.emit(!this.isOpen());
  }

  protected closeInfo(): void {
    this.openChange.emit(false);
  }
}
