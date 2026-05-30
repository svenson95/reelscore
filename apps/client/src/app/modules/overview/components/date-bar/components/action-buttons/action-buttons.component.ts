import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FilterButtonComponent, SearchDialogComponent } from './components';

@Component({
  selector: 'rs-action-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FilterButtonComponent,
  ],
  styles: `
  :host {
    @apply flex;

    ::ng-deep {
      .mat-mdc-icon-button {
        --mdc-icon-button-state-layer-size: 36px;
        border: 1px solid var(--rs-button-border-color);
        margin-left: 1px;
      }

      mat-icon { @apply w-[20px] h-[20px] text-[20px] align-text-top; }
    }
  }
`,
  template: `
    <rs-filter-button />

    <button
      mat-icon-button
      aria-label="Search button"
      matTooltip="Suche"
      (click)="openSearchDialog()"
    >
      <mat-icon>search</mat-icon>
    </button>
  `,
})
export class ActionButtonsComponent {
  private readonly dialog = inject(MatDialog);

  openSearchDialog(): void {
    this.dialog.open(SearchDialogComponent, {
      width: 'min(720px, calc(100vw - 2rem))',
      maxWidth: '100vw',
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'rs-search-dialog-panel',
    });
  }
}
