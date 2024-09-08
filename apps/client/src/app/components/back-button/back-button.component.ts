import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'reelscore-back-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  styles: `
    :host {
      @apply flex gap-5;

      ::ng-deep .mat-mdc-outlined-button>.mat-icon {
        margin-left: 0;
        margin-right: 0;
      }
    }
    
    button.back-button { 
      --mdc-outlined-button-container-height: 40px;
      @apply p-0 min-w-[36px]; 
      
      mat-icon { @apply text-[24px] w-[24px] h-[24px] mr-0; }
    }
  `,
  template: `
    <button class="back-button" mat-button (click)="navigateBack()">
      <mat-icon>chevron_left</mat-icon>
    </button>
  `,
})
export class BackButtonComponent {
  location = inject(Location);
  navigateBack = () => this.location.back();
}
