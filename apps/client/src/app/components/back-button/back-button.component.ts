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
  selector: 'futbet-back-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, DatePipe],
  styles: `
    :host ::ng-deep .mat-mdc-outlined-button>.mat-icon {
      margin-left: 0;
      margin-right: 0;
    }

    div { @apply flex items-center gap-2; }
    mat-icon { @apply text-[20px] w-[16px] h-[20px]; }
  `,
  template: `
    <button mat-stroked-button extended (click)="navigateBack()">
      <div>
        <span>{{ date() | date : 'dd.MM.yy' }}</span>
        <mat-icon>chevron_left</mat-icon>
      </div>
    </button>
  `,
})
export class BackButtonComponent {
  location = inject(Location);
  date = input.required<string>();

  navigateBack(): void {
    this.location.back();
  }
}
