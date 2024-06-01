import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'futbet-back-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  styles: ``,
  template: `
    <button mat-icon-button (click)="navigateBack()">
      <mat-icon>chevron_left</mat-icon>
    </button>
  `,
})
export class BackButtonComponent {
  location = inject(Location);

  navigateBack(): void {
    this.location.back();
  }
}
