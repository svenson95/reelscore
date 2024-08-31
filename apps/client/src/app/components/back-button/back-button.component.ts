import { DatePipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'reelscore-back-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, DatePipe],
  styles: `
    :host {
      @apply flex gap-5;

      ::ng-deep .mat-mdc-outlined-button>.mat-icon {
        margin-left: 0;
        margin-right: 0;
      }
    }

    button { 
      --mdc-outlined-button-container-height: 40px;
      --mdc-text-button-disabled-label-text-color: var(--fb-color-text-1);
      @apply fb-as-label; 
    }
    
    button.back-button { 
      @apply p-0 min-w-[36px]; 
      
      mat-icon { @apply text-[24px] w-[22px] h-[22px] mr-0; }
    }
  `,
  template: `
    <button mat-button disabled>
      <span>{{ date() | date : 'dd.MM.yy' }}</span>
    </button>
    <button class="back-button" mat-button (click)="navigateBack()">
      <mat-icon>chevron_left</mat-icon>
    </button>
  `,
})
export class BackButtonComponent {
  date = input.required<string>();

  location = inject(Location);
  navigateBack = () => this.location.back();
}
