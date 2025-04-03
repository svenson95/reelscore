import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'reelscore-back-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  styles: `
    @use '@angular/material' as mat;
    :host {
      @apply flex gap-5;

      ::ng-deep .mat-mdc-outlined-button>.mat-icon {
        margin-left: 0;
        margin-right: 0;
      }
    }
    
    button.back-button { 
      min-width: 36px;

      @include mat.button-overrides(
        (
          filled-container-height: 36px,
          filled-horizontal-padding: 0,
          filled-icon-spacing: 0,
          filled-icon-offset: 0
        )
      );
    }
  `,
  template: `
    <button class="back-button" mat-flat-button (click)="navigateBack()">
      <mat-icon>chevron_left</mat-icon>
    </button>
  `,
})
export class BackButtonComponent {
  location = inject(Location);
  navigateBack = () => this.location.back();
}
