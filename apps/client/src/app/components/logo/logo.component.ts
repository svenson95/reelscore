import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'futbet-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatButtonModule],
  template: `
    <button
      mat-button
      class="cursor-pointer"
      (click)="onLogoClick()"
      [disabled]="disabled()"
    >
      <span class="font-normal">fut</span>
      <span class="font-bold">bet</span>
    </button>
  `,
  styles: `
    .mat-mdc-button[disabled],
    .mat-mdc-button.mat-mdc-button-disabled {
      color: var(--fb-color-text-1);
    }
  `,
})
export class LogoComponent {
  private readonly router = inject(Router);
  readonly disabled = input<string | undefined>(undefined);

  readonly isDisabled = computed<boolean>(() =>
    this.disabled() !== undefined ? true : false
  );

  public onLogoClick(): void {
    this.router.navigateByUrl('');
  }
}
